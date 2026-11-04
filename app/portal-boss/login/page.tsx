import { Login } from '@/components/auth';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{error?:string;reset?:string}>}) {
  const q=await searchParams; return <Login portal="boss" error={q.error} reset={q.reset}/>;
}
