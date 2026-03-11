# Salam Small Goods — Website

A multi-page website for **Salam Small Goods**, a family-owned halal butcher shop in Broadmeadows, VIC. Built with Next.js using a **claymorphism** UI design style.

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
| Project Name | `iux011-salam-smallgoods-website` |
| Client | Salam Small Goods |
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
| Ant Design | ^6.3.2 | Form, Drawer (mobile nav), message notifications |
| Tailwind CSS | ^4 | Utility-first CSS base |
| @tailwindcss/postcss | ^4 | Tailwind PostCSS integration |

---

## Design System

### Claymorphism

The UI uses **claymorphism** — a design style where elements appear soft, inflated, and 3D, achieved through:

- Heavy `border-radius` (24–28px on cards, 50px on buttons/pills)
- Layered `box-shadow` — outer drop shadow + inner highlights
- Warm pastel gradient backgrounds on cards and buttons
- No hard borders; everything feels rounded and puffy

### Colour Palette

| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#FF6B6B` | Buttons, accents, category badges |
| Secondary | `#FFA07A` | Hover states, footer headings |
| Background | `#FAFAF5` | Page background |
| Card BG | `#FFF8F0` → `#FFEEDD` | Clay card gradient |
| Text Dark | `#3D1A0E` | Headings, body text |
| Text Muted | `#8B6F6F` | Descriptions, labels |
| Shadow | `#E0B99A` | Outer clay shadow colour |

### Clay CSS Utility Classes

Defined in `src/app/globals.css`:

| Class | Description |
|-------|-------------|
| `.clay-card` | Standard clay card with gradient bg and layered shadow |
| `.clay-card-strong` | Stronger clay card with deeper shadow |
| `.clay-btn-primary` | Red pill button (primary CTA) |
| `.clay-btn-secondary` | Cream pill button (secondary CTA) |
| `.clay-filter-btn` | Inactive category filter pill |
| `.clay-filter-btn-active` | Active category filter pill (red) |
| `.clay-badge` | Small floating label badge |
| `.clay-banner` | Full-width gradient page header banner |
| `.clay-section-title` | Large section heading style |

### Responsive Layout Classes

| Class | Behaviour |
|-------|-----------|
| `.hero-grid` | 2-col grid → 1-col on mobile (hides visual column) |
| `.about-grid` | 2-col grid → 1-col on mobile |
| `.contact-grid` | 3:2 col grid → 1-col on mobile |

---

## Project Structure

```
iux011-salam-smallgoods-website/
├── public/                        # Static assets
├── src/
│   ├── lib/
│   │   ├── products.js            # Dummy product data (12 products)
│   │   └── shopInfo.js            # Shop contact, address, trading hours
│   └── app/
│       ├── globals.css            # Claymorphism utilities + theme variables
│       ├── layout.js              # Root layout, metadata, font setup
│       ├── page.js                # Home page (/)
│       ├── products/
│       │   └── page.js            # Products page (/products)
│       ├── contact/
│       │   └── page.js            # Contact page (/contact)
│       └── components/
│           ├── shared/
│           │   ├── Navbar.js      # Site navigation (desktop + mobile drawer)
│           │   └── Footer.js      # Site footer
│           ├── home/
│           │   ├── Hero.js        # Hero section with badges and CTAs
│           │   ├── FeaturedProducts.js  # 4 featured product cards
│           │   ├── WhyChooseUs.js # 3 feature tiles
│           │   └── AboutSnippet.js # About section with stats
│           ├── products/
│           │   ├── FilterBar.js   # Category filter pill buttons
│           │   └── ProductCard.js # Individual product card
│           └── contact/
│               ├── ContactForm.js # Ant Design contact form
│               └── ShopInfoCard.js # Address, phone, trading hours card
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
| Hero | `Hero.js` | Full-width gradient banner, headline, CTA buttons, floating badges |
| Featured Products | `FeaturedProducts.js` | 4 products marked `featured: true` from data layer |
| Why Choose Us | `WhyChooseUs.js` | 3 coloured clay tiles (Halal, Fresh, Family) |
| About Snippet | `AboutSnippet.js` | Shop story, stats (25+ years, 100% halal, 500+ regulars) |

---

### Products — `/products`

**File:** `src/app/products/page.js`

- Client component (`'use client'`) — manages active filter state
- Page banner with clay gradient header
- `FilterBar` — category filter buttons: **All, Beef, Lamb, Chicken, Smallgoods, Jerky & Cured**
- Responsive product grid (auto-fill, min 240px columns)
- Shows product count ("Showing X products in Y")
- Empty state card when no products match the selected filter
- Each product card links to `/contact` for enquiries

---

### Contact — `/contact`

**File:** `src/app/contact/page.js`

- Page banner with clay gradient header
- Two-column layout (3:2 ratio, stacks on mobile):
  - **Left:** Contact form — Name, Email, Phone, Message fields + submit button
  - **Right:** Shop info card — address, phone, email, trading hours
- Form built with Ant Design `Form` component
- On submit: shows Ant Design `message.success` notification, resets fields
- Phone and email are clickable (`tel:` / `mailto:`)

---

## Data Layer

All dummy data is stored in `src/lib/` and imported by components as needed.

### `src/lib/products.js`

Exports:
- `products` — array of 12 product objects
- `categories` — array of category strings used by the filter bar

**Product object shape:**

```js
{
  id: 1,
  name: 'Beef Sausages',
  category: 'Beef',        // one of: Beef, Lamb, Chicken, Smallgoods, Jerky & Cured
  description: '...',
  price: '$12.99 / kg',
  emoji: '🌭',             // used as placeholder image
  featured: true,          // if true, shown on Home page featured section
}
```

**Products included:**

| # | Name | Category | Featured |
|---|------|----------|----------|
| 1 | Beef Sausages | Beef | Yes |
| 2 | Lamb Chops | Lamb | Yes |
| 3 | Chicken Wings | Chicken | Yes |
| 4 | Beef Jerky | Jerky & Cured | Yes |
| 5 | Lamb Mince | Lamb | No |
| 6 | Chicken Breast Fillets | Chicken | No |
| 7 | Beef Salami | Smallgoods | No |
| 8 | Beef Mince | Beef | No |
| 9 | Lamb Shank | Lamb | No |
| 10 | Chicken Thigh Fillets | Chicken | No |
| 11 | Beef Pastrami | Jerky & Cured | No |
| 12 | Lamb Sausages | Smallgoods | No |

---

### `src/lib/shopInfo.js`

Exports a single `shopInfo` object:

```js
{
  name: 'Salam Small Goods',
  tagline: 'Premium Quality Meats & Smallgoods',
  description: '...',
  address: '42 Mercer Street, Broadmeadows VIC 3047',
  phone: '(03) 9305 4812',
  email: 'hello@salamsmallgoods.com.au',
  hours: [
    { day: 'Monday – Friday', time: '7:00 AM – 6:00 PM' },
    { day: 'Saturday', time: '7:00 AM – 5:00 PM' },
    { day: 'Sunday', time: '8:00 AM – 2:00 PM' },
  ],
  social: {
    facebook: '...',
    instagram: '...',
  },
}
```

> **Note:** All data in `src/lib/` is dummy/placeholder. Replace with real content before going live.

---

## Components

### `Navbar.js`
- `'use client'` — uses `usePathname` for active link highlighting and `useState` for drawer
- Desktop: horizontal pill nav links, active link styled with red clay button
- Mobile: hamburger button opens Ant Design `Drawer` from the right
- Breakpoint: `640px`

### `Footer.js`
- Server component
- 4-column grid: Brand, Quick Links, Contact, Trading Hours
- Dark warm brown background
- Pulls data from `shopInfo`

### `Hero.js`
- Server component
- Uses `.hero-grid` responsive class
- Floating clay badges, headline, two CTA links

### `FeaturedProducts.js`
- Server component
- Filters `products` where `featured === true`
- "View All Products →" links to `/products`

### `WhyChooseUs.js`
- Server component
- 3 uniquely coloured clay tiles (pink, green, yellow)

### `AboutSnippet.js`
- Server component
- Uses `.about-grid` responsive class
- Hardcoded stats (replace with real data if needed)

### `FilterBar.js`
- `'use client'` — calls `onChange` prop on button click
- Reads categories from `src/lib/products.js`
- Applies `.clay-filter-btn-active` to the active category

### `ProductCard.js`
- Server component (stateless display)
- Accepts a single `product` prop
- "Enquire" button links to `/contact`

### `ContactForm.js`
- `'use client'` — uses Ant Design `Form`, `Input`, `message`
- Fields: Name (required), Email (required + email validation), Phone (optional), Message (required)
- Simulates form submission with 800ms delay (replace with real API call)

### `ShopInfoCard.js`
- Server component
- Pulls data from `shopInfo`
- Clickable phone and email links

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
