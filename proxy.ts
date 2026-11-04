import { NextRequest, NextResponse } from 'next/server';

// Boss-only hostname router. This project contains no Admin routes/actions.
export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith('/_next/') || path === '/favicon.ico' || path === '/robots.txt') {
    return NextResponse.next();
  }
  if (path === '/portal-boss' || path.startsWith('/portal-boss/')) {
    return new NextResponse('Not found', { status: 404 });
  }
  const host = req.nextUrl.hostname.toLowerCase();
  const expected = (process.env.BOSS_HOST || 'example.com').toLowerCase();
  const allowed = host === expected || host === `www.${expected}` || host === 'localhost' ||
    host.endsWith('.vercel.app');
  if (!allowed) return new NextResponse('Unknown host', { status: 404 });

  const publicPaths = ['/login', '/forgot-password', '/reset-password'];
  const hasSession = Boolean(req.cookies.get('flg_cars_boss_session')?.value);
  if (!hasSession && path !== '/' && !publicPaths.includes(path)) {
    const to = req.nextUrl.clone(); to.pathname = '/login'; to.search = '';
    return NextResponse.redirect(to);
  }
  const to = req.nextUrl.clone();
  to.pathname = `/portal-boss${path === '/' ? '' : path}`;
  return NextResponse.rewrite(to);
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
