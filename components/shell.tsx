import Link from 'next/link';
import { LayoutGrid, CarFront, Wrench, ChartNoAxesCombined, LogOut, ShieldCheck } from 'lucide-react';
import { logout } from '@/app/actions';
import type { Actor, Portal } from '@/lib/api';

export function Shell({ portal, user, current, children }: {
  portal: Portal; user: Actor; current: string; children: React.ReactNode;
}) {
  const links = [
    { href: '/dashboard', label: 'Overview', Icon: LayoutGrid },
    { href: '/dashboard#inventory', label: 'Vehicle inventory', Icon: CarFront },
    { href: '/dashboard#repairs', label: 'Repair tracker', Icon: Wrench },
    { href: '/dashboard#analytics', label: 'Analytics', Icon: ChartNoAxesCombined },
  ];
  return <div className="app-layout"><aside className="sidebar">
    <Link href="/dashboard" className="brand"><span className="brand-mark">F</span><div>FLG CARS<small>VEHICLE OPERATIONS</small></div></Link>
    <div className="nav-caption">WORKSPACE</div><nav className="nav-list">{links.map(({ href, label, Icon }) => <Link key={label} href={href} className={current===label ? 'nav-link active' : 'nav-link'}><Icon size={18}/>{label}</Link>)}</nav>
    <div className="sidebar-end"><div className="side-callout"><ShieldCheck size={22}/><strong>{portal==='boss' ? 'A clearer fleet picture' : 'Keep the fleet moving'}</strong><p>{portal==='boss' ? 'Your vehicle intelligence, in one read-only view.' : 'Accurate reports power better decisions.'}</p></div>
      <div className="side-profile"><span className="avatar">{portal==='boss'?'BO':'AD'}</span><div><strong>{user.display_name}</strong><small>{portal==='boss'?'Boss · Read-only':'Administrator'}</small></div><form action={logout}><button title="Sign out" className="icon-button"><LogOut size={18}/></button></form></div></div>
  </aside><div className="app-main"><header className="topbar"><div className="breadcrumb">FLG CARS <span>›</span> <b>{current}</b></div><div className="top-right"><span className="connected"><i/> Connected to WordPress</span><span className="avatar small-avatar">{portal==='boss'?'BO':'AD'}</span></div></header><main className="content">{children}</main></div></div>;
}
