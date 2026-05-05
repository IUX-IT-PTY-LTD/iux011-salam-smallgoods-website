# Salam Small Goods — Website

A full-stack marketing website with a custom CMS admin panel for **Salam Small Goods**, a family-owned halal butcher shop in Broadmeadows, VIC. Built with Next.js, Firebase, and a **claymorphism** UI design style.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Public Pages](#public-pages)
- [Admin Panel](#admin-panel)
- [API Routes](#api-routes)
- [Data Layer](#data-layer)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## Project Overview

| Property | Value |
|----------|-------|
| Project ID | `iux011` |
| Client | Salam Small Goods |
| Developer | IUX IT Pty Ltd |
| Framework | Next.js 16.1.6 (App Router) |
| Styling | Tailwind CSS v4 + Custom CSS (Claymorphism) |
| UI Library | Ant Design v5 |
| Language | JavaScript (JSX) |
| Database | Cloud Firestore |
| Auth | Firebase Authentication |
| Images | Cloudinary |
| Email | Resend |
| Deployment | Vercel |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16.1.6 | React framework, routing, SSR/SSG, Server Actions |
| React 19 | UI rendering |
| Ant Design v5 | Admin panel UI components |
| Tailwind CSS v4 | Utility CSS base |
| Firebase Admin SDK | Server-side Firestore reads/writes, session cookie auth |
| Firebase Client SDK | Client-side `signInWithEmailAndPassword` (admin login only) |
| Cloudinary | Product image uploads, transformation, CDN delivery |
| Resend | Outbound email for admin contact replies |

---

## Design System

### Claymorphism

The UI uses **claymorphism** — elements appear soft, tactile, and slightly 3D through:

- Large `border-radius` (24–28px on cards, 50px on buttons and pills)
- Hard-offset `box-shadow` (e.g. `8px 8px 0px`) giving a flat 3D lift
- Inner inset highlights on cards for depth
- Warm gradient backgrounds on cards and buttons
- No hard borders — everything is rounded

### Colour Tokens

All colour tokens are stored in Firestore (`site_theme/config`) and injected as CSS custom properties at render time via `src/app/layout.js`. They can be edited live from the `/admin/design` panel.

The static `:root {}` block has been removed from `globals.css` — tokens come exclusively from the database.

#### Token Groups

| Group | Tokens | Usage |
|-------|--------|-------|
| Text | `colorInk`, `colorBody`, `colorMuted` | Headings, body, secondary text |
| Surfaces | `colorSurface`, `colorSurfaceRaised`, `colorSurfaceMid`, `colorSurfaceStrong`, `colorSurfaceStrongMid`, `colorSurfaceHi` | Page bg, card backgrounds |
| Shadows | `colorShadow`, `colorShadowStrong`, `colorShadowInset` | Clay hard shadows and insets |
| Accent | `colorAccent`, `colorAccentDark`, `colorAccentShadow`, `colorAccentHi` | CTAs, banners, active states |
| Status | `colorStatusOk`, `colorStatusErr` | In Stock / Out of Stock badges |
| Footer | `colorFooterBg`, `colorFooterBg2`, `colorFooterText`, `colorFooterMuted` | Footer background and text |

### Clay CSS Utility Classes

Defined in `src/app/globals.css`:

| Class | Description |
|-------|-------------|
| `.clay-card` | Standard clay card — cream gradient bg, hard offset shadow, inset highlight |
| `.clay-card-strong` | Elevated clay card — deeper shadow |
| `.clay-btn-primary` | Red pill button — primary CTA |
| `.clay-btn-secondary` | Cream pill button — secondary CTA |
| `.clay-filter-btn` | Inactive category filter pill |
| `.clay-filter-btn-active` | Active category filter pill (red) |
| `.clay-badge` | Small floating label pill |
| `.clay-banner` | Full-width red gradient page header banner |
| `.product-image-container` | `aspect-ratio: 4/3` image wrapper for product cards |

---

## Architecture

### Data Flow

```
Public pages (Server Components)
  └── src/lib/products.js     → Firestore /products, /categories
  └── src/lib/shopInfo.js     → Firestore /shop_info/config
  └── src/lib/content.js      → Firestore /page_sections/{id}/content_blocks
  └── src/lib/theme.js        → Firestore /site_theme/config
        └── injected as <style> in layout.js

Admin panel (/admin/*)
  └── Ant Design client components
  └── Server Actions (src/app/actions/)
        └── write to Firestore → revalidatePath → public pages update

Contact form
  └── POST /api/contact → Firestore /contact_submissions
  └── Admin replies → /api/admin/contacts/[id]/reply
        └── Firestore /replies subcollection + Resend email
```

### Auth Flow

1. Admin enters credentials at `/admin/login`
2. Firebase client SDK `signInWithEmailAndPassword` → ID token
3. Client POSTs ID token to `POST /api/auth/session`
4. Server creates `httpOnly` session cookie via `adminAuth.createSessionCookie`
5. `src/proxy.js` verifies the cookie on every `/admin/*` and `/api/admin/*` request

### Firestore Collections

```
/site_theme/config          ← singleton: all CSS colour tokens
/shop_info/config           ← singleton: name, tagline, description, address, phone, email, hours, social, logoUrl, logoPublicId
/categories/{slug}          ← category docs (label, slug, emoji, description, order)
/products/{slug}            ← product docs (name, imageUrl, inStock, featured, order…)
/page_sections/{pageSlug_sectionKey}
  └── /content_blocks/{key} ← CMS content (type: text|richtext|image|url|json, value)
/contact_submissions/{id}   ← contact form submissions (status: new|read|replied)
  └── /replies/{id}         ← admin reply thread
```

---

## Project Structure

```
iux011-salam-smallgoods-website/
├── scripts/
│   └── seed.mjs                         # Firestore seed script (run once)
├── src/
│   ├── proxy.js                         # Next.js 16 middleware (auth guard)
│   ├── lib/
│   │   ├── firebaseAdmin.js             # Firebase Admin SDK singleton
│   │   ├── firebaseClient.js            # Firebase Client SDK singleton (auth only)
│   │   ├── adminAuthHelper.js           # verifyAdminSession() helper
│   │   ├── products.js                  # Firestore product/category fetchers
│   │   ├── shopInfo.js                  # Firestore shop info fetcher
│   │   ├── content.js                   # Firestore page section/content fetchers
│   │   ├── theme.js                     # Firestore theme fetcher + CSS builder
│   │   └── email.js                     # Resend reply email sender
│   └── app/
│       ├── globals.css                  # Clay utility classes (no :root tokens)
│       ├── layout.js                    # Root layout — async, injects theme CSS
│       ├── page.js                      # Home page (/)
│       ├── about/page.js                # About page (/about)
│       ├── products/
│       │   ├── page.js                  # Products landing (/products)
│       │   └── [category-slug]/
│       │       ├── page.js              # Category listing
│       │       └── [product-slug]/
│       │           ├── page.js          # Product detail
│       │           └── ProductImageViewer.js  # Client component — lightbox popup for full image
│       ├── contact/page.js              # Contact page (/contact)
│       ├── actions/
│       │   ├── products.js              # Server actions: CRUD + bulk delete for products
│       │   ├── categories.js            # Server actions: CRUD for categories
│       │   ├── shopInfo.js              # Server action: updateShopInfo
│       │   ├── content.js               # Server action: saveSection
│       │   └── theme.js                 # Server action: saveTheme
│       ├── api/
│       │   ├── contact/route.js         # POST — public contact form submission
│       │   ├── auth/session/route.js    # POST/DELETE — session cookie management
│       │   └── admin/
│       │       ├── upload/route.js      # POST — Cloudinary signed upload params
│       │       ├── contacts/route.js    # GET — list contact submissions
│       │       └── contacts/[id]/
│       │           ├── route.js         # GET/PATCH — submission detail + status
│       │           └── reply/route.js   # POST — send reply email + store reply doc
│       ├── admin/
│       │   ├── login/page.js            # Admin login page (unguarded)
│       │   └── (panel)/                 # Route group — all pages use AdminShell layout
│       │       ├── layout.js
│       │       ├── components/
│       │       │   └── AdminShell.js    # Sidebar + header layout (Ant Design); logo from shop_info at top, "Developed by IUX IT Pty Ltd v1.0.0" footer pinned to bottom
│       │       ├── dashboard/page.js    # Dashboard — links to all sections
│       │       ├── products/
│       │       │   ├── page.js
│       │       │   └── ProductsManager.js
│       │       ├── categories/
│       │       │   ├── page.js
│       │       │   └── CategoriesManager.js
│       │       ├── shop-info/
│       │       │   ├── page.js
│       │       │   └── ShopInfoForm.js
│       │       ├── content/
│       │       │   ├── page.js
│       │       │   └── ContentEditor.js
│       │       ├── design/
│       │       │   ├── page.js
│       │       │   └── DesignEditor.js
│       │       └── contacts/
│       │           ├── page.js
│       │           ├── ContactsInbox.js
│       │           └── [id]/
│       │               ├── page.js
│       │               └── ContactDetail.js
│       └── components/
│           ├── shared/
│           │   ├── Navbar.js
│           │   └── Footer.js
│           ├── home/
│           │   ├── Hero.js
│           │   ├── HomeCategories.js
│           │   ├── WhyChooseUs.js
│           │   └── AboutSnippet.js
│           ├── about/
│           │   ├── AboutHero.js
│           │   ├── OurStory.js
│           │   └── OurValues.js
│           ├── products/
│           │   ├── FilterBar.js
│           │   └── ProductCard.js
│           └── contact/
│               ├── ContactForm.js
│               └── ShopInfoCard.js
├── next.config.mjs
└── package.json
```

---

## Public Pages

### Home — `/`

| Section | Component | Content Source |
|---------|-----------|----------------|
| Hero | `Hero.js` | Firestore `home_hero` content blocks + up to 4 featured products displayed in a 2×2 square grid; images served as Cloudinary-optimised 600×600 `c_fill` crops |
| Categories | `HomeCategories.js` | Firestore `/categories` + `home_homeCategories` blocks |
| Why Choose Us | `WhyChooseUs.js` | Firestore `home_whyChooseUs` content blocks |
| About Snippet | `AboutSnippet.js` | Firestore `home_aboutSnippet` content blocks |

### About — `/about`

| Section | Component | Content Source |
|---------|-----------|----------------|
| Banner | `AboutHero.js` | Firestore `about_aboutHero` blocks |
| Story | `OurStory.js` | Firestore `about_ourStory` blocks |
| Values | `OurValues.js` | Firestore `about_ourValues` blocks |

### Products — `/products`

- Category grid from Firestore `/categories`
- Links to `/products/:category-slug`

### Category — `/products/:category-slug`

- Product grid filtered by `categorySlug` from Firestore
- Statically generated via `generateStaticParams`

### Product Detail — `/products/:category-slug/:product-slug`

- Full product detail from Firestore `/products/{slug}`
- Product image displayed at a fixed `4:3` aspect ratio, served as a Cloudinary-optimised 480×360 `c_fill` crop
- "Full image" button opens a lightbox popup (`ProductImageViewer.js` client component) — full-resolution image shown in a dark overlay; close via ✕ button, backdrop click, or Escape key; Cloudinary URL is never exposed in the browser address bar
- Related products (same category)
- Statically generated via `generateStaticParams`

### Contact — `/contact`

- `ContactForm.js` — POSTs to `POST /api/contact` → stored in Firestore
- `ShopInfoCard.js` — reads from Firestore `shop_info/config`

---

## Admin Panel

All admin routes are at `/admin/*` and require a valid session cookie. Unauthenticated requests are redirected to `/admin/login`.

> **Navbar logo** — The public site navbar displays only the shop logo (no name or tagline text). The logo is rendered as a 64 × 64 px circle (`objectFit: cover`) loaded with `priority` to avoid fade-in. Upload a square PNG with a background via `/admin/shop-info`. The mobile drawer shows the same logo at 44 × 44 px.
>
> **Admin sidebar logo** — The admin panel sidebar also shows the shop logo (72 × 72 px circle when expanded, 40 × 40 px when collapsed) fetched from `shop_info/config` via `PanelLayout` and passed as a `logoUrl` prop to `AdminShell`. Falls back to the 🥩 emoji if no logo has been uploaded yet.

### `/admin/login`

Firebase email/password sign-in. On success, creates a 14-day `httpOnly` session cookie and redirects to `/admin/dashboard`.

### `/admin/dashboard`

Quick-access grid linking to all admin sections.

### `/admin/products`

- List all products in an Ant Design Table (name, category, image thumb, stock/featured toggles, actions)
- Pagination with page-size switcher (10 / 20 / 50) and a total count display
- Row checkboxes for multi-select; bulk delete button appears in the toolbar when rows are selected — uses a Firestore batch commit via `bulkDeleteProducts` server action
- Create and edit products via a Drawer form
- Cloudinary image upload (signed upload flow — client uploads directly to Cloudinary)
  - Client-side pre-processing before upload: accepts JPG / PNG only (max 10 MB input), resizes to max 1200 px on the longest side, re-encodes as JPEG at 0.85 quality → Cloudinary receives ~200–400 KB regardless of input size
- Toggle `inStock` and `featured` inline via Switch components
- Delete individual products with confirmation; bulk delete selected rows with a single confirmation
- Changes `revalidatePath` the relevant public pages immediately

### `/admin/categories`

- List all categories with product count
- Create, edit, delete via Drawer form
- Emoji field uses a searchable picker popover (curated set of ~30 food/butcher emojis) instead of a plain text input
- Delete is blocked if the category has products

### `/admin/shop-info`

- Upload and replace the shop logo (Cloudinary signed upload, stored as `logoUrl`/`logoPublicId`)
- Edit shop name, tagline, description, address, phone, email, social links
- Dynamic trading hours rows — add, remove, reorder inline

### `/admin/content`

- Tab per page (Home, About, Products, Contact)
- Card per section within each page
- Fields rendered by type:
  - `text` → Input
  - `richtext` → TextArea
  - `url` → Input
  - `json` → structured array editor (for stats, feature cards, value cards)
- Save writes to Firestore and calls `revalidatePath` for the page

### `/admin/design`

- Colour pickers for all CSS token groups: Text/Surfaces, Card Surfaces, Shadows, Brand Accent, Status, Footer
- Live preview pane: banner, clay card, buttons, footer swatch update as you pick
- Save writes to `site_theme/config` and calls `revalidatePath('/', 'layout')` — all pages update globally

### `/admin/contacts`

- Inbox table with tabs: All / New / Read / Replied
- New submissions shown in bold with a count badge
- Click row → opens detail page

### `/admin/contacts/[id]`

- Full submission detail (name, email, phone, subject, message, received date)
- Auto-marks submission as "read" on open
- Reply thread (chronological history of previous replies)
- Send reply form — dispatches via `POST /api/admin/contacts/[id]/reply`

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/contact` | Public | Store contact form submission in Firestore |
| `POST` | `/api/auth/session` | Public | Exchange Firebase ID token for session cookie |
| `DELETE` | `/api/auth/session` | Public | Clear session cookie (logout) |
| `POST` | `/api/admin/upload` | Admin | Return Cloudinary signed upload parameters |
| `GET` | `/api/admin/contacts` | Admin | List contact submissions (optional `?status=` filter) |
| `GET` | `/api/admin/contacts/[id]` | Admin | Submission detail + replies subcollection |
| `PATCH` | `/api/admin/contacts/[id]` | Admin | Update submission status field |
| `POST` | `/api/admin/contacts/[id]/reply` | Admin | Add reply doc, update status, send email via Resend |

---

## Data Layer

### `src/lib/products.js`

Async functions — all read from Firestore via Firebase Admin SDK:

| Function | Description |
|----------|-------------|
| `getProducts()` | All products ordered by `order` |
| `getFeaturedProducts()` | Products where `featured === true` |
| `getProductsByCategory(slug)` | Products filtered by `categorySlug` |
| `getProductBySlug(categorySlug, productSlug)` | Single product lookup |
| `getCategories()` | All categories ordered by `order` |
| `getCategoryBySlug(slug)` | Single category lookup |

**Server actions (`src/app/actions/products.js`)** also include `bulkDeleteProducts(items)` — accepts an array of `{ slug, categorySlug }` objects, deletes them in a single Firestore batch, and revalidates affected paths once.

All functions apply `serializeDoc()` to convert Firestore Timestamps to ISO strings before returning.

**Product document shape (Firestore):**

```js
{
  slug: 'beef-sausages',
  name: 'Beef Sausages',
  categorySlug: 'beef',
  description: '...',         // short — product card
  details: '...',             // long — product detail page
  imageUrl: 'https://...',    // Cloudinary URL (or picsum placeholder)
  imagePublicId: null,        // Cloudinary public_id (if uploaded via admin)
  inStock: true,
  featured: true,
  order: 0,
  createdAt: '2026-...',
  updatedAt: '2026-...',
}
```

### `src/lib/shopInfo.js`

`getShopInfo()` — reads `shop_info/config` from Firestore.

### `src/lib/content.js`

| Function | Description |
|----------|-------------|
| `getSection(pageSlug, sectionKey)` | Returns flat `{ key: value }` map for a section; JSON blocks auto-parsed |
| `getAdminPageSections(pageSlug)` | Returns sections + raw block data for the admin content editor |

### `src/lib/theme.js`

| Export | Description |
|--------|-------------|
| `getTheme()` | Reads `site_theme/config`; falls back to `DEFAULT_THEME` |
| `buildThemeCss(theme)` | Returns `:root { --color-*: value; }` CSS string |
| `DEFAULT_THEME` | Hardcoded fallback for all tokens |

Token key → CSS var conversion: `colorAccent` → `--color-accent`

---

## Authentication

- **Provider:** Firebase Authentication (email/password)
- **Admin user:** created manually in Firebase Console → Authentication
- **Session:** `httpOnly; SameSite=Strict` cookie, 14-day expiry
- **Guard:** `src/proxy.js` — verifies cookie on all `/admin/*` and `/api/admin/*` requests
- **Verify helper:** `src/lib/adminAuthHelper.js` — `verifyAdminSession()` used in every admin API route

---

## Environment Variables

Store in `.env.local` (never commit). Set the same variables in Vercel dashboard for production.

```bash
# Firebase Client SDK (public — safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-only — keep secret)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=         # keep \n escape sequences in the key

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_SITE_URL=               # http://localhost:3000 locally, live URL on Vercel
```

To generate the Firebase Admin credentials: Firebase Console → Project Settings → Service Accounts → Generate new private key → copy `project_id`, `client_email`, `private_key`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication (email/password) and Firestore enabled
- A Cloudinary account
- A Resend account with `salamsmallgoods.com.au` domain verified (for email replies)

### Install

```bash
npm install
```

### Configure

Copy all variables listed in [Environment Variables](#environment-variables) into `.env.local`.

### Seed Firestore

Run once to populate all collections with the prototype data:

```bash
node --env-file=.env.local scripts/seed.mjs
```

The script is idempotent — it skips collections that already contain data. To overwrite existing data:

```bash
node --env-file=.env.local scripts/seed.mjs --reset
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start with Turbopack hot reload |
| Build | `npm run build` | Production build |
| Start | `npm run start` | Serve production build |
| Lint | `npm run lint` | Run ESLint |
| Seed | `node --env-file=.env.local scripts/seed.mjs` | Populate Firestore |

---

## Deployment

### Vercel

1. Push to GitHub and connect the repo in Vercel
2. Set all environment variables from `.env.local` in Vercel → Project Settings → Environment Variables
3. Deploy — Vercel auto-detects Next.js and builds accordingly

### Resend Domain Verification

Before admin email replies will deliver, verify `salamsmallgoods.com.au` in the Resend dashboard (add the required DNS TXT/MX records). The admin reply UI works regardless; only the outbound email delivery depends on this.

### Pre-Launch Checklist

- [ ] Seed Firestore: `node --env-file=.env.local scripts/seed.mjs`
- [ ] Admin login flow tested (wrong password rejected, redirect to dashboard on success)
- [ ] All `/admin/*` routes redirect to login when unauthenticated
- [ ] Products CRUD verified — create, edit, delete, image upload
- [ ] Content editor verified — hero title change reflects on home page
- [ ] Design token change verified — accent colour updates all CTAs globally
- [ ] Contact form submission appears in admin inbox with status "New"
- [ ] Admin reply sends email and updates status to "Replied"
- [ ] All product images replaced with real photography (currently using Cloudinary-hosted or picsum placeholders)
- [ ] Real shop info verified in Firestore (address, phone, email, hours)
- [ ] Domain `salamsmallgoods.com.au` verified in Resend
- [ ] `NEXT_PUBLIC_SITE_URL` updated to live URL in Vercel
- [ ] `next build` passes with no errors
