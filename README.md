# FLG CARS — Boss Viewer

Standalone Next.js 16 App Router app. Deploy this directory as a separate Vercel project or repository. It contains **read-only** Boss dashboard pages, plus authentication and password recovery. **No Admin pages or vehicle mutation actions are included.**

## Deploy

1. Install the shared `flg-cars-api.php` WordPress plugin and configure the single Boss account email plus SMTP (see the main project README).
2. Create a separate Vercel project for this Boss app. Set Root Directory to `boss-app` if using the combined repository; otherwise use a dedicated repo root.
3. Set `BOSS_HOST=your-domain.co.za` and `WP_API_URL=https://api.your-domain.co.za/wp-json` in Vercel environment variables.
4. Add the Boss hostname (and optionally `www`) to this Vercel project's Domains, and configure TLS and DNS.
5. Use Forgot Password to initialize the seeded Boss account password via a secure WordPress reset email.

Local dev: `npm ci && npm run dev`, then visit `http://localhost:3000/login`.

Authentication uses an HttpOnly, host-only `flg_cars_boss_session` cookie. Read-only API requests always verify that the WordPress session belongs to the single pinned Boss identity.
