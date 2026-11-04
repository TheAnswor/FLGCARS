import { actor, vehicle } from '@/lib/api';
import { BossVehicleDetail } from '@/components/boss-vehicle-detail';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}) {
  const user=await actor('boss'); const {id}=await params;
  if(!/^\d+$/.test(id)) notFound(); const car=await vehicle(Number(id));
  return <BossVehicleDetail user={user} car={car}/>;
}
