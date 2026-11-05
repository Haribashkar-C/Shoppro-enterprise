# ShopPro — Enterprise E-commerce (Next.js)

A responsive, full-stack single-vendor commerce starter inspired by the supplied page-map reference. Built with Next.js App Router, React, TypeScript, Prisma and PostgreSQL.

## Pages included
- Homepage and category navigation
- Product listing with search and category filtering
- Product details and stock display
- Shopping cart with quantity controls
- Checkout and order success
- Login and registration
- Customer account, order history and order tracking
- Admin dashboard with product creation and order status management

## Requirements
- Node.js 20.9+
- npm
- PostgreSQL 14+

## Setup (Windows PowerShell)
1. Extract the ZIP and open the folder in VS Code.
2. Install packages:
   ```powershell
   npm install
   ```
3. Create a PostgreSQL database named `enterprise_shop`.
4. Copy environment template:
   ```powershell
   Copy-Item .env.example .env
   ```
5. Edit `.env` and set `DATABASE_URL`, `AUTH_SECRET` (at least 32 random bytes), `APP_URL`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD`.
6. Generate Prisma client and create schema:
   ```powershell
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```
7. Run:
   ```powershell
   npm run dev
   ```
8. Open http://localhost:3000

## Admin
The seed script creates an admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`. Do not use the sample values in a public deployment.

## Security included
- Server-side authorization for customer and admin operations
- Password hashing with bcrypt (12 rounds)
- Signed JWT session in an HttpOnly, SameSite=Lax cookie
- Zod validation and bounded input lengths
- Login/registration rate limit starter
- Secure response headers and no powered-by header
- Transactional checkout with atomic stock decrements
- User-scoped cart and order access

## Important production hardening
This is a working starter, not a certified or audited enterprise deployment. Before production:
- Use a managed PostgreSQL database, TLS, backups and migrations (`prisma migrate deploy`).
- Replace the in-memory rate limiter with Redis or an API gateway; multiple server instances do not share its counters.
- Set a strong random `AUTH_SECRET`, rotate secrets, and set `APP_URL` to the exact HTTPS origin.
- Add CSRF/origin validation consistently to every mutation endpoint, security monitoring, audit logs, email verification, password reset, MFA for admins, and session revocation.
- Add a proper payment provider flow (Razorpay/Stripe): create provider orders server-side, verify signatures/webhooks, use idempotency keys, and only mark paid after verified provider events. Online payment is intentionally not falsely simulated here; COD is enabled.
- Add product update/delete APIs, image upload service, saved address CRUD, wishlist mutation endpoints, tax rules, coupon engine, shipping integrations and automated tests.
- Configure a strict Content Security Policy after validating the external image/font hosts and use a managed image CDN.
- Run dependency and security scans before release.

## Image notes
Product and category seed images use Unsplash URLs. For a production catalogue, upload owned/licensed images to a CDN and store validated URLs.
