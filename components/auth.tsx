import Link from 'next/link';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { login, forgotPassword, resetPassword } from '@/app/actions';
import type { Portal } from '@/lib/api';

function Brand() {
  return <div className="brand"><span className="brand-mark">F</span><div>FLG CARS<small>VEHICLE OPERATIONS</small></div></div>;
}

function AuthFrame({ children, subtitle }: {children: React.ReactNode; subtitle: string}) {
  return <div className="auth-layout"><aside className="auth-side"><Brand />
    <div className="auth-pitch"><span className="overline">PRECISION IN EVERY DETAIL</span>
      <h1>Clarity for<br/>every <em>vehicle.</em></h1><p>{subtitle}</p>
      <svg viewBox="0 0 680 170" className="car-outline" aria-hidden="true"><path d="M48 123C83 118 100 113 124 105L192 48Q208 35 245 34H391Q421 34 445 57L506 104L574 116Q605 119 620 135V148H48Z" fill="none" stroke="#94adbb" strokeWidth="3"/><path d="M179 94 219 49H390L447 96Z" fill="#244359" stroke="#839caa" strokeWidth="2"/><circle cx="165" cy="144" r="29" stroke="#c9f16b" strokeWidth="4" fill="#132e44"/><circle cx="506" cy="144" r="29" stroke="#c9f16b" strokeWidth="4" fill="#132e44"/><path d="M40 152h595" stroke="#7d95a4" strokeWidth="2"/></svg>
    </div><div className="auth-foot">© FLG CARS 2026 <span>Built for better decisions.</span></div></aside>
    <main className="auth-main"><div className="auth-card">{children}<p className="auth-bottom">No public registration · Account access managed by FLG CARS</p></div></main></div>;
}

export function Login({ portal, error, reset }: {portal: Portal; error?: string; reset?: string}) {
  return <AuthFrame subtitle="One intelligent space to track vehicle condition, manage repairs and make informed decisions with confidence.">
    <div className="overline dark">SECURE {portal === 'boss' ? 'EXECUTIVE' : 'ADMIN'} ACCESS</div>
    <h2>Welcome back.</h2><p className="lede">Sign in to your {portal === 'boss' ? 'read-only Boss dashboard' : 'Administrator workspace'}.</p>
    <div className="role-pill"><ShieldCheck size={15}/> {portal === 'boss' ? 'BOSS VIEWER · ONE AUTHORIZED ACCOUNT' : 'ADMINISTRATOR · MANAGEMENT ACCESS'}</div>
    {error && <div className="error">{error === 'credentials' ? 'Invalid credentials or the WordPress API is unavailable.' : 'Unable to authorize this login.'}</div>}
    {reset && <div className="success">Your password was updated. Sign in with your new password.</div>}
    <form action={login} className="auth-form"><input type="hidden" name="portal" value={portal}/>
      <label>Email address<input type="text" name="email" required autoComplete="username" placeholder="you@yourcompany.co.za"/></label>
      <label>Password<input type="password" name="password" required autoComplete="current-password" placeholder="Enter your password"/></label>
      <div className="login-helper"><span><LockKeyhole size={13}/> Secured connection</span>{portal === 'boss' && <Link href="/forgot-password">Forgot password?</Link>}</div>
      <button className="btn primary full" type="submit">Sign in <ArrowRight size={16}/></button>
    </form>
  </AuthFrame>;
}

export function Forgot({ sent }: {sent?: boolean}) {
  return <AuthFrame subtitle="Secure access to the information that matters most.">
    <Link href="/login" className="back">← Back to sign in</Link>
    <h2>Reset your password.</h2><p className="lede">Enter the Boss account email to receive a secure, time-limited password reset link.</p>
    {sent && <div className="success">If the address is eligible, reset instructions have been sent.</div>}
    <form action={forgotPassword} className="auth-form"><label>Boss email address<input type="email" name="email" required placeholder="boss@yourcompany.co.za"/></label>
      <button className="btn primary full">Send reset instructions <ArrowRight size={16}/></button></form>
  </AuthFrame>;
}

export function Reset({ loginName, resetKey, error }: {loginName?: string; resetKey?: string; error?: string}) {
  return <AuthFrame subtitle="Security is built into every layer of FLG CARS.">
    <Link href="/login" className="back">← Back to sign in</Link><h2>Choose a new password.</h2>
    <p className="lede">Use at least 12 characters. Password reset invalidates previous sessions.</p>
    {error && <div className="error">{error === 'expired' ? 'This reset link is invalid or expired. Request a new one.' : 'Passwords must match and contain at least 12 characters.'}</div>}
    {(!loginName || !resetKey) ? <div className="error">No valid reset key supplied. <Link href="/forgot-password">Request a link</Link>.</div> :
      <form action={resetPassword} className="auth-form">
        <input type="hidden" name="login" value={loginName}/><input type="hidden" name="key" value={resetKey}/>
        <label>New password<input type="password" name="password" minLength={12} required autoComplete="new-password"/></label>
        <label>Confirm password<input type="password" name="confirm" minLength={12} required autoComplete="new-password"/></label>
        <button className="btn primary full">Update password <ArrowRight size={16}/></button></form>}
  </AuthFrame>;
}
