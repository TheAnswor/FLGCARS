'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/lib/api';

function text(form: FormData, key: string): string { return String(form.get(key) || '').trim(); }
async function requireBossHost() {
  const host = ((await headers()).get('host') || '').split(':')[0].toLowerCase();
  const expected = (process.env.BOSS_HOST || 'example.com').toLowerCase();
  if (host !== expected && host !== `www.${expected}` && !host.endsWith('.vercel.app') &&
      !(process.env.NODE_ENV !== 'production' && host === 'localhost')) {
    redirect('/login?error=portal');
  }
}

export async function login(form: FormData) {
  await requireBossHost();
  let result: { token: string; role: string; expires_in: number };
  try {
    result = await api('/flg-cars/v1/auth/login', {
      method: 'POST', body: JSON.stringify({ email: text(form, 'email'), password: text(form, 'password'), portal: 'boss' })
    }, '');
  } catch { redirect('/login?error=credentials'); }
  if (result.role !== 'boss' || !/^[a-f0-9]{64}$/.test(result.token)) redirect('/login?error=credentials');
  (await cookies()).set('flg_cars_boss_session', result.token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    path: '/', maxAge: Math.min(result.expires_in, 12 * 60 * 60)
  });
  redirect('/dashboard');
}

export async function logout() {
  try { await api('/flg-cars/v1/auth/logout', { method: 'POST' }); } catch { /* clear locally regardless */ }
  (await cookies()).delete('flg_cars_boss_session');
  redirect('/login');
}

export async function forgotPassword(form: FormData) {
  await requireBossHost();
  await api('/flg-cars/v1/auth/forgot', {
    method: 'POST', body: JSON.stringify({ email: text(form, 'email') })
  }, '').catch(() => null);
  redirect('/forgot-password?sent=1');
}

export async function resetPassword(form: FormData) {
  await requireBossHost();
  const password = text(form, 'password');
  const confirm = text(form, 'confirm');
  if (password.length < 12 || password !== confirm) redirect('/reset-password?error=invalid');
  try {
    await api('/flg-cars/v1/auth/reset', { method: 'POST',
      body: JSON.stringify({ login: text(form, 'login'), key: text(form, 'key'), password }) }, '');
  } catch { redirect('/reset-password?error=expired'); }
  redirect('/login?reset=1');
}
