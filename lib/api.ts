import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Portal = 'boss' | 'admin';
export type Part = {
  id: number; name: string; quantity: number; unit_cost: number;
  supplier: string; sourcing_status: string;
};
export type Issue = {
  id: number; vehicle_id: number; category: string; severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  description: string; labor_cost: number; estimated_total: number; parts: Part[];
};
export type Vehicle = {
  id: number; make: string; model: string; plate: string; vin: string; year: number;
  color: string; location: string; image_id: number; image_url: string | null;
  status: 'HEALTHY' | 'DAMAGED'; issues: Issue[]; estimate: number; updated_at: string;
};
export type Actor = { id: number; role: Portal; display_name: string };

const base = () => {
  const raw = process.env.WP_API_URL;
  if (!raw) throw new Error('WP_API_URL is not configured');
  const origin = raw.replace(/\/$/, '');
  if (!origin.startsWith('https://') && process.env.NODE_ENV === 'production') {
    throw new Error('WP_API_URL must use HTTPS');
  }
  return origin.endsWith('/wp-json') ? origin : `${origin}/wp-json`;
};

export async function api<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const auth = token ?? (await cookies()).get('flg_cars_boss_session')?.value;
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (auth) headers.set('Authorization', `Bearer ${auth}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(`${base()}${path}`, {
    ...options, headers, cache: 'no-store', signal: AbortSignal.timeout(20000)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message || `WordPress API returned ${response.status}`);
  return payload as T;
}

export async function actor(expected: Portal): Promise<Actor> {
  let user: Actor;
  try {
    user = await api<Actor>('/flg-cars/v1/auth/me');
  } catch {
    redirect('/login');
  }
  if (user.role !== expected) redirect('/login?error=forbidden');
  return user;
}

export async function vehicles(): Promise<Vehicle[]> {
  return api<Vehicle[]>('/flg-cars/v1/vehicles');
}

export async function vehicle(id: number): Promise<Vehicle> {
  return api<Vehicle>(`/flg-cars/v1/vehicles/${id}`);
}

export function zar(value: number): string {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR',
    maximumFractionDigits: 0 }).format(Number(value) || 0).replace('ZAR', 'R');
}
