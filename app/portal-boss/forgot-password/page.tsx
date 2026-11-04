import { Forgot } from '@/components/auth';
export default async function Page({searchParams}:{searchParams:Promise<{sent?:string}>}) {
  const q=await searchParams; return <Forgot sent={q.sent==='1'}/>;
}
