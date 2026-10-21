# AI Scout — Production AI Discovery & Learning Platform

AI Scout is a full-stack AI discovery, intelligence, and learning platform designed for developers, students, creators, and enterprise teams.

---

## 1. Architectural Highlights

- **Framework**: Next.js 15+ (App Router, Standalone build output)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 with dark futuristic color system (`#050816` page background, electric blue and purple accents)
- **Database & ORM**: PostgreSQL 16 + Prisma 6.x
- **Authentication**: `better-auth` session cookies with server-side role and membership enforcement
- **Payments**: Razorpay SDK with HMAC SHA256 timing-safe verification, transactional membership provisioning, and webhook handling
- **Content Pipeline**: Google Sheets API automated synchronization with Zod validation and per-row error telemetry
- **Notifications**: Transactional email dispatcher with `NotificationOutbox` table
- **Containerization**: Production multi-stage Dockerfile, Docker Compose, and Nginx reverse proxy with gzip and rate limiting

---

## 2. Directory Structure

```
ai_scout/
├── app/
│   ├── (public)/              # Public pages: /, /news, /tools, /learn, /community, /pricing, /about, /contact
│   ├── (auth)/                # Auth pages: /login, /register
│   ├── (protected)/           # Authenticated & Premium: /account, /premium, /payment/success, /payment/cancel
│   ├── admin/                 # Admin views: /admin, /admin/content, /admin/tools, /admin/learn, /admin/sync
│   └── api/                   # Handlers: /api/auth, /api/payments, /api/webhooks, /api/sync, /api/contact, /api/health
├── components/
│   ├── home/                  # HeroSection, FeaturedSection, ToolsSection, LearnSection, CommunitySection, UpskillSection
│   ├── layout/                # Navbar, Footer
│   └── payment/               # PricingClient (Razorpay modal integration)
├── lib/
│   ├── auth/                  # better-auth configuration & session helpers (getCurrentUser, requireAdmin, requirePremium)
│   ├── db/                    # Prisma client singleton
│   ├── payments/              # Razorpay SDK orders & HMAC signature verification
│   ├── sheets/                # Google Sheets synchronization engine
│   ├── notifications/         # Email dispatcher & Outbox processor
│   └── utils.ts               # Shared helper functions (formatDate, slugify, cn)
├── prisma/
│   ├── schema.prisma          # Database schema models, enums & indexes
│   └── seed.ts                # Production seed data (Plans, Categories, Tools, Articles, Tutorials)
├── docker/
│   ├── Dockerfile             # Multi-stage production container build
│   ├── nginx/nginx.conf       # Reverse proxy, SSL, rate-limits & gzip
│   └── scripts/               # Backup and restore scripts
├── scripts/
│   └── make-admin.ts          # CLI tool to grant ADMIN role to any email
├── .env.example               # Full environment variable template
├── docker-compose.yml         # Production multi-container orchestration
└── middleware.ts              # Route protection and security headers
```

---

## 3. Local Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Docker installed)
- npm

### Installation
1. Clone the repository and navigate to the project root:
   ```bash
   cd ai_scout
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your `DATABASE_URL` and `BETTER_AUTH_SECRET`.

4. Generate Prisma Client and apply migrations:
   ```bash
   npx prisma db push
   ```

5. Seed the database with initial categories, plans, tools, and tutorials:
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Admin Account Setup

1. Register a new user account through the web interface at `/register`.
2. Grant the account administrative privileges from your terminal:
   ```bash
   npx tsx scripts/make-admin.ts your-email@example.com
   ```
3. Log in and navigate to `/admin` to access the administration dashboard.

---

## 5. Google Sheets Publishing Pipeline

AI Scout can synchronize content directly from a Google Sheet into the database:

### Spreadsheet Structure (Sheet tab name: `Articles`)
Columns must follow this exact order:
- **Col A**: `Title`
- **Col B**: `Summary`
- **Col C**: `Content` (Markdown or text)
- **Col D**: `CategorySlug` (e.g. `productivity`, `coding-dev`)
- **Col E**: `Status` (`DRAFT` or `PUBLISHED`)
- **Col F**: `AccessLevel` (`FREE` or `PREMIUM`)
- **Col G**: `Author`
- **Col H**: `ReadTime` (minutes, integer)

### Triggering Synchronization
- **Via Admin UI**: Navigate to `/admin/sync` and click **Trigger Manual Sync Now**.
- **Via Automated Cron (VPS)**:
  ```bash
  crontab -e
  # Sync every hour:
  0 * * * * curl -X POST -H "Authorization: Bearer YOUR_SYNC_SECRET" https://aiscout.in/api/sync/sheets
  ```

---

## 6. Razorpay Payment Gateway

1. Obtain your API Keys from the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` in your environment.
3. In Razorpay Settings → Webhooks, add your webhook URL:
   - **URL**: `https://aiscout.in/api/webhooks/razorpay`
   - **Secret**: Set matching `RAZORPAY_WEBHOOK_SECRET`
   - **Events**: `payment.captured`, `payment.failed`, `refund.created`

---

## 7. Production Deployment (Docker Compose)

### 1. VPS Provisioning
Ensure Docker and Docker Compose are installed on your Linux server (Ubuntu 22.04+ recommended).

### 2. Deployment
```bash
# Clone repository onto VPS
git clone <your-repo-url> /opt/aiscout
cd /opt/aiscout

# Configure production environment
cp .env.example .env
nano .env

# Obtain SSL Certificate via Certbot
sudo apt install certbot
sudo certbot certonly --standalone -d aiscout.in -d www.aiscout.in

# Start all containers
docker compose up -d --build

# Run database migrations and seed inside the container
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
```

---

## 8. Database Backup & Restore

### Automated Nightly Backup
Add the backup script to root crontab:
```bash
0 2 * * * docker compose -f /opt/aiscout/docker-compose.yml exec -T postgres /bin/sh /opt/aiscout/docker/scripts/backup.sh
```

### Restore from Backup
```bash
docker compose exec -T postgres /bin/sh /opt/aiscout/docker/scripts/restore.sh /backups/aiscout_db_YYYYMMDD_HHMMSS.sql.gz
```

---

## 9. Security Best Practices

- All passwords are encrypted with scrypt.
- Session tokens are stored in HTTP-only, SameSite=Lax cookies.
- Server-side premium content gating strictly prevents content payload leaks to unauthorized users.
- Payments use cryptographic HMAC SHA256 timing-safe verification.
- Rate limiting is enforced at both the Nginx level and Next.js middleware.
