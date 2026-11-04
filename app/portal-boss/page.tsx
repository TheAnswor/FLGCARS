import { actor } from '@/lib/api';
import { redirect } from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Home() { await actor('boss'); redirect('/dashboard'); }
