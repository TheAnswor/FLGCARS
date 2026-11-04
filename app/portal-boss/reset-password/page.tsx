import { Reset } from '@/components/auth';
export default async function Page({searchParams}:{searchParams:Promise<{login?:string;key?:string;error?:string}>}) {
  const q=await searchParams; return <Reset loginName={q.login} resetKey={q.key} error={q.error}/>;
}
