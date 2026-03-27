# Salam Small Goods — Website

A multi-page marketing website for **Salam Small Goods**, a family-owned halal butcher shop in Broadmeadows, VIC. Built with Next.js using a **claymorphism** UI design style.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Data Layer](#data-layer)
- [Components](#components)
- [Getting Started](#getting-started)
- [Scripts](#scripts)

---

## Project Overview

| Property | Value |
|----------|-------|
| Project ID | `iux011` |
| Client | Salam Small Goods |
| Developer | IUX IT Pty Ltd |
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + Custom CSS (Claymorphism) |
| UI Library | Ant Design v6 |
| Language | JavaScript (JSX) |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.6 | React framework, routing, SSR/SSG |
| React | 19.2.3 | UI rendering |
| Ant Design | ^6.3.2 | Contact form, mobile nav Drawer |
| Tailwind CSS | ^4 | Utility-first CSS base |
| @tailwindcss/postcss | ^4 | Tailwind PostCSS integration |

---

## Design System

### Claymorphism

The UI uses **claymorphism** — elements appear soft, tactile, and slightly 3D through:

- Large `border-radius` (24–28px on cards, 50px on buttons and pills)
- Hard-offset `box-shadow` (e.g. `8px 8px 0px`) giving a flat 3D lift
- Inner inset highlights on cards for depth
- Warm gradient backgrounds on cards and buttons
- No hard borders — everything is rounded

### Colour Palette

All colours are defined as CSS custom properties in `src/app/globals.css`.

#### Core Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-ink` | `#2A0D04` | Headings, strong text |
| `--color-body` | `#5A3020` | Body text, descriptions |
| `--color-muted` | `#7A5040` | Labels, secondary text |
| `--color-surface` | `#E8D0A8` | Page background |

#### Card Surfaces

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-surface-raised` | `#FBF0DC` | Card background (light stop) |
| `--color-surface-mid` | `#F5E4C4` | Card background (dark stop) |
| `--color-surface-strong` | `#F8EDD4` | Elevated card (light stop) |
| `--color-surface-strong-mid` | `#F0E0BC` | Elevated card (dark stop) |
| `--color-surface-hi` | `#FFFAF2` | Inset highlight |

#### Clay Shadows

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-shadow` | `#B8784A` | Standard clay hard shadow |
| `--color-shadow-strong` | `#A06838` | Elevated card shadow |
| `--color-shadow-inset` | `#D4A870` | Inset shadow |

#### Brand Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent` | `#CC3A20` | Primary red — CTAs, accent headings |
| `--color-accent-dark` | `#B02808` | Accent gradient dark stop |
| `--color-accent-shadow` | `#7A1808` | Accent hard shadow |
| `--color-accent-hi` | `#E05030` | Accent inset highlight |

#### Status

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-status-ok` | `#3E6B2A` | In Stock badge |
| `--color-status-err` | `#A83020` | Out of Stock badge |

#### Footer

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-footer-bg` | `#1A0804` | Footer background |
| `--color-footer-text` | `#EDD5B0` | Footer headings |
| `--color-footer-muted` | `#B89070` | Footer body text |

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
| `.product-image-container` | `aspect-ratio: 4/3` image wrapper for product cards — swap emoji placeholder for `<Image>` when real photos are ready |

### Responsive Layout Classes

| Class | Behaviour |
|-------|-----------|
| `.hero-grid` | 2-col grid → 1-col on mobile (hides right visual column) |
| `.about-grid` | 2-col grid → 1-col on mobile |
| `.contact-grid` | 3:2 col grid → 1-col on mobile |

---

## Project Structure

```
iux011-salam-smallgoods-website/
├── public/                              # Static assets
├── src/
│   ├── lib/
│   │   ├── products.js                  # Product + category data (12 products, 5 categories)
│   │   └── shopInfo.js                  # Shop contact, address, trading hours
│   └── app/
│       ├── globals.css                  # CSS custom properties + claymorphism utilities
│       ├── layout.js                    # Root layout, metadata, Geist font setup
│       ├── page.js                      # Home page (/)
│       ├── about/
│       │   └── page.js                  # About page (/about)
│       ├── products/
│       │   ├── page.js                  # Products landing — category grid (/products)
│       │   └── [category-slug]/
│       │       ├── page.js              # Category listing (/products/:category-slug)
│       │       └── [product-slug]/
│       │           └── page.js          # Product detail (/products/:category-slug/:product-slug)
│       ├── contact/
│       │   └── page.js                  # Contact page (/contact)
│       └── components/
│           ├── shared/
│           │   ├── Navbar.js            # Site navigation (desktop + mobile drawer)
│           │   └── Footer.js            # Site footer (3-col: Brand, Contact, Hours)
│           ├── home/
│           │   ├── Hero.js              # Hero — 2×2 featured product grid + stat strip
│           │   ├── HomeCategories.js    # Category browse cards
│           │   ├── WhyChooseUs.js       # 3 feature tiles (Halal, Fresh, Family)
│           │   └── AboutSnippet.js      # About preview with stats and CTA
│           ├── about/
│           │   ├── AboutHero.js         # About page banner
│           │   ├── OurStory.js          # Story text + stat grid
│           │   └── OurValues.js         # 3 value cards (Halal, Family, Fresh)
│           ├── products/
│           │   ├── FilterBar.js         # Category filter pill buttons
│           │   └── ProductCard.js       # Product card with image, stock badge, CTA
│           └── contact/
│               ├── ContactForm.js       # Ant Design contact form
│               └── ShopInfoCard.js      # Address, phone, email, trading hours
├── package.json
├── next.config.mjs
└── postcss.config.mjs
```

---

## Pages

### Home — `/`

**File:** `src/app/page.js`

| Section | Component | Description |
|---------|-----------|-------------|
| Hero | `Hero.js` | Overline, headline, description, CTA buttons, stat strip, 2×2 featured product image grid |
| Categories | `HomeCategories.js` | Browse-by-category card grid with product counts |
| Why Choose Us | `WhyChooseUs.js` | 3 clay tiles — Halal Certified, Fresh Daily Cuts, Family Recipe |
| About Snippet | `AboutSnippet.js` | Shop story summary, stats, link to full About page |

---

### About — `/about`

**File:** `src/app/about/page.js`

| Section | Component | Description |
|---------|-----------|-------------|
| Banner | `AboutHero.js` | Red clay banner with page title |
| Story | `OurStory.js` | 2-col layout — story text + stat cards (25+ years, 100% halal, etc.) |
| Values | `OurValues.js` | 3 value cards — Halal Certified, Family Owned, Fresh Daily |

---

### Products — `/products`

**File:** `src/app/products/page.js`

- Category card grid — each card links to `/products/:category-slug`
- Displays product count per category

---

### Category — `/products/:category-slug`

**File:** `src/app/products/[category-slug]/page.js`

- Clay banner with category name
- Breadcrumb navigation
- Grid of `ProductCard` components for that category
- Statically generated via `generateStaticParams`

---

### Product Detail — `/products/:category-slug/:product-slug`

**File:** `src/app/products/[category-slug]/[product-slug]/page.js`

- Red hero banner with product image, name, category badge, stock status
- Breadcrumb navigation
- About This Product card with full `details` text
- Sidebar: stock status indicator, Halal Certified card
- Contact Us prompt card
- Related products grid (up to 3 from the same category)
- Statically generated via `generateStaticParams`

---

### Contact — `/contact`

**File:** `src/app/contact/page.js`

- Two-column layout (3:2, stacks on mobile):
  - **Left:** Contact form — Name, Email, Phone, Message + submit
  - **Right:** Shop info — address, phone, email, trading hours
- Form built with Ant Design `Form`
- On submit: shows success notification, resets fields

---

## Data Layer

All data lives in `src/lib/` and is imported directly by pages and components.

### `src/lib/products.js`

**Exports:**
- `products` — array of 12 product objects
- `categories` — array of 5 category objects
- `getProductBySlug(categorySlug, productSlug)` — returns a single product or `null`
- `getProductsByCategory(categorySlug)` — returns filtered product array
- `getCategoryBySlug(slug)` — returns a single category or `null`

**Product object shape:**

```js
{
  id: 1,
  slug: 'beef-sausages',
  name: 'Beef Sausages',
  category: 'Beef',
  categorySlug: 'beef',
  description: '...',          // short — used on cards
  details: '...',              // long — used on product detail page
  image: 'https://...',        // placeholder from picsum.photos — replace with real images
  inStock: true,
  featured: true,              // if true, shown in Hero 2×2 grid
}
```

**Category object shape:**

```js
{
  label: 'Beef',
  slug: 'beef',
  emoji: '🥩',
  description: 'Premium halal beef cuts, mince & smallgoods',
}
```

**Products included:**

| # | Name | Category | In Stock | Featured |
|---|------|----------|----------|----------|
| 1 | Beef Sausages | Beef | Yes | Yes |
| 2 | Lamb Chops | Lamb | Yes | Yes |
| 3 | Chicken Wings | Chicken | Yes | Yes |
| 4 | Beef Jerky | Jerky & Cured | No | Yes |
| 5 | Lamb Mince | Lamb | Yes | No |
| 6 | Chicken Breast Fillets | Chicken | Yes | No |
| 7 | Beef Salami | Smallgoods | Yes | No |
| 8 | Beef Mince | Beef | Yes | No |
| 9 | Lamb Shank | Lamb | No | No |
| 10 | Chicken Thigh Fillets | Chicken | No | No |
| 11 | Beef Pastrami | Jerky & Cured | Yes | No |
| 12 | Lamb Sausages | Smallgoods | Yes | No |

> **Note:** All product images use `picsum.photos` placeholder URLs. Replace with real product photography before going live.

---

### `src/lib/shopInfo.js`

Exports a single `shopInfo` object:

```js
{
  name: 'Salam Small Goods',
  tagline: '...',
  description: '...',
  address: '42 Mercer Street, Broadmeadows VIC 3047',
  phone: '(03) 9305 4812',
  email: 'hello@salamsmallgoods.com.au',
  hours: [
    { day: 'Monday – Friday', time: '7:00 AM – 6:00 PM' },
    { day: 'Saturday', time: '7:00 AM – 5:00 PM' },
    { day: 'Sunday', time: '8:00 AM – 2:00 PM' },
  ],
}
```

> **Note:** All data in `src/lib/` is placeholder. Replace with verified real content before going live.

---

## Components

### `Navbar.js`
- `'use client'` — uses `usePathname` for active link and `useState` for drawer/dropdown
- Desktop: horizontal pill nav links — active link styled with red clay button
- Products link has a hover dropdown listing all categories
- Mobile: hamburger opens Ant Design `Drawer` from the right with expandable Products sub-menu
- Breakpoint: `640px`

### `Footer.js`
- Server component
- 3-column grid: Brand + tagline, Contact (address/phone/email with labels), Trading Hours
- Dark warm brown background (`#1A0804` → `#2A1208`) — hardcoded (not CSS vars) for reliable rendering
- Bottom bar: copyright line + "Developed by IUX IT Pty Ltd"
- No emojis

### `Hero.js`
- Server component
- Imports featured products directly from `products.js`
- Left: red overline, headline, description, two CTA buttons, stat strip (25+, 100%, 500+)
- Right: 2×2 clickable grid of featured product images with name overlay — hidden on mobile
- Background matches navbar (`#E8D0A8`) for a seamless top-of-page appearance

### `HomeCategories.js`
- `'use client'` — uses `onMouseEnter`/`onMouseLeave` for hover lift effect
- Clay card per category with description and product count badge
- Links to `/products/:category-slug`

### `WhyChooseUs.js`
- Server component
- 3 clay tiles with warm-palette gradients (terracotta tint, amber, olive)
- Halal Certified / Fresh Daily Cuts / Family Recipe

### `AboutSnippet.js`
- Server component
- Uses `.about-grid` responsive class
- Inline stats (25+ years, 100% halal, 500+ regulars)

### `AboutHero.js`
- Server component — uses `.clay-banner` class

### `OurStory.js`
- Server component
- 2-col layout: story text (left) + image placeholder card with 2×2 stat cards (right)

### `OurValues.js`
- Server component
- 3 value cards with warm-palette gradients — Halal Certified, Family Owned, Fresh Daily

### `FilterBar.js`
- `'use client'` — calls `onChange` prop on button click
- Reads categories from `src/lib/products.js`
- Applies `.clay-filter-btn-active` to the selected category

### `ProductCard.js`
- Server component (stateless display)
- `.product-image-container` — `aspect-ratio: 4/3`, `object-fit: cover` — ready for real images
- Category badge (dark ink text on cream) — WCAG AA compliant at 11px
- Stock badge — solid green (`#3E6B2A`) for In Stock, solid red (`#A83020`) for Out of Stock
- "Read More →" links to product detail page

### `ContactForm.js`
- `'use client'` — uses Ant Design `Form`, `Input`, `message`
- Fields: Name (required), Email (required + validation), Phone (optional), Message (required)
- Simulates submission with 800ms delay — replace with real API call before going live

### `ShopInfoCard.js`
- Server component
- Pulls data from `shopInfo`
- Clickable phone (`tel:`) and email (`mailto:`) links

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start with hot reload |
| Build | `npm run build` | Production build |
| Start | `npm run start` | Serve production build |
| Lint | `npm run lint` | Run ESLint |

---

## Pre-Launch Checklist

- [ ] Replace all `picsum.photos` placeholder images with real product photography
- [ ] Verify all shop info (address, phone, email, hours) in `src/lib/shopInfo.js`
- [ ] Connect `ContactForm.js` to a real form submission API or email service
- [ ] Update product data in `src/lib/products.js` with real names, descriptions, and stock status
- [ ] Add real social media links to footer
- [ ] Test all pages on mobile (375px) and tablet (768px)
- [ ] Run accessibility contrast check on final colour values
- [ ] Configure `next.config.mjs` `images.remotePatterns` when switching to Next.js `<Image>` component
