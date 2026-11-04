import { actor, vehicles } from '@/lib/api';
import { BossDashboard } from '@/components/boss-dashboard';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const user=await actor('boss'); const data=await vehicles(); const q=await searchParams;
  return <BossDashboard user={user} data={data} query={q.q}/>;
}
