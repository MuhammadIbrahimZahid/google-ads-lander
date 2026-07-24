# Google Ads Lander — Phase 3

A production-oriented lead generation and attribution system built with **Next.js**, **TypeScript**, **Google Analytics 4**, **Google Ads**, and **Neon PostgreSQL**.

Phase 3 extends the lead capture platform by introducing automatic attribution capture and persistent conversion context. Marketing attribution is collected when a visitor lands on the site, attached to the conversion journey, stored with each lead, and reused throughout the entire conversion lifecycle.

---

# Conversion Journey

```text
Google Ad
        │
        ▼
Landing Page
        │
        ▼
Capture Attribution
(sessionStorage)
        │
        ▼
Hero CTA Click
        │
        ▼
Conversion Journey Created
(event_id + attribution)
        │
        ▼
Lead Modal
        │
        ▼
Lead Form Submission
        │
        ▼
POST /api/leads
        │
        ▼
Server Validation
        │
        ▼
Neon PostgreSQL
        │
        ▼
completeConversion()
        │
        ▼
Thank You Page
        │
        ▼
generate_lead
(event_id)
        │
        ▼
Google Analytics 4
        │
        ▼
Google Ads
```

Phase 3 ensures that marketing attribution is captured immediately when a visitor lands on the page and remains available throughout the complete lead generation journey.

---

# Features

Implemented:

- Next.js App Router
- TypeScript
- React Client Components
- Google Analytics 4 integration
- Google Ads conversion workflow
- Custom analytics events
- Session-based conversion management
- Conversion expiry handling
- Duplicate conversion prevention
- Hero CTA tracking
- Automatic attribution capture
- First-touch attribution support
- Lead capture modal
- API Route handling
- Server-side validation
- Input normalization
- Neon PostgreSQL integration
- Service layer architecture
- Device tracking
- Conversion Event ID persistence
- Landing page attribution
- UTM parameter tracking
- GCLID capture
- Thank-you page conversion validation

---

# Architecture

```text
Browser
        │
        ▼
Attribution Capture
        │
        ▼
Conversion Journey
        │
        ▼
React Components
        │
        ▼
Route Handler (/api/leads)
        │
        ▼
Lead Service
        │
        ▼
Neon PostgreSQL
        │
        ▼
Google Analytics 4
```

Each layer has a single responsibility:

- Attribution collection
- Conversion management
- User interface
- API validation
- Database persistence
- Analytics

---

# Attribution Flow

Marketing attribution is captured automatically on the landing page.

```text
Landing Page

↓

captureAttribution()

↓

sessionStorage

↓

ensureConversion()

↓

Conversion Object

↓

Lead Submission

↓

Database
```

The visitor does not need to submit the form immediately. Attribution is preserved for the active conversion journey.

---

# Conversion Journey

The conversion object now contains both conversion state and attribution.

Example:

```json
{
  "eventId": "921d8c5e-c124-4d2d-9587-427cb7d49bb6",
  "started": true,
  "completed": false,
  "fired": false,
  "createdAt": 1750000000,
  "attribution": {
    "gclid": "test123",
    "utmSource": "google",
    "utmMedium": "cpc",
    "utmCampaign": "summer_sale",
    "landingPage": "/",
    "device": "Mozilla/5.0..."
  }
}
```

This makes the conversion journey the single source of truth for attribution data.

---

# Browser Storage

## sessionStorage

Stores:

- Active conversion journey
- Attribution
- Conversion state
- Event ID
- Conversion expiry

Example:

```text
conversion
attribution
```

Conversion journeys automatically expire after **30 minutes**.

---

## localStorage

Stores browser-level information that should survive browser sessions.

Current usage:

```text
hero_click_fired
first_touch_attribution
```

The first-touch attribution record is only written once and is never overwritten.

---

# Lead Pipeline

```text
Landing Page

↓

Capture Attribution

↓

CTA Click

↓

Conversion Created

↓

Lead Form

↓

POST /api/leads

↓

Validation

↓

Lead Service

↓

Neon PostgreSQL

↓

completeConversion()

↓

Thank You Page

↓

generate_lead
```

Lead submission no longer reads browser APIs directly. Instead, attribution is retrieved from the active conversion journey.

---

# Attribution Fields

Each lead stores marketing context including:

```text
landing_page

referrer

gclid

utm_source

utm_medium

utm_campaign

utm_term

utm_content

device

event_id
```

These fields connect every lead to its originating marketing campaign.

---

# Conversion Events

## hero_cta_click

Represents visitor engagement.

Tracked once per browser using `localStorage`.

Example:

```ts
trackHeroCTAClick({
  button_name: "Get Started",
});
```

---

## generate_lead

Represents a completed conversion.

Triggered only after:

```text
Attribution Captured

↓

Conversion Created

↓

Lead Stored

↓

completeConversion()

↓

Thank You Page

↓

generate_lead(event_id)
```

Example:

```ts
trackGenerateLead({
  lead_source: "landing_page",
  event_id: conversion.eventId,
});
```

The `event_id` links analytics events with the stored lead.

---

# API

Endpoint:

```text
POST /api/leads
```

Responsibilities:

- Parse request body
- Validate required fields
- Normalize input
- Persist attribution
- Persist conversion event ID
- Call service layer
- Return structured responses

The API is implemented using Next.js App Router Route Handlers, which provide custom HTTP endpoints inside the `app` directory. :contentReference[oaicite:0]{index=0}

---

# Validation

The API validates:

- Required name
- Required email
- Email format
- Maximum field lengths
- Phone normalization

Invalid requests:

- Return **400 Bad Request**
- Do not insert a lead
- Do not complete the conversion
- Do not fire `generate_lead`

---

# Database

Each stored lead contains:

```text
Customer

name
email
phone

Marketing Attribution

landing_page
referrer
gclid
utm_source
utm_medium
utm_campaign
utm_term
utm_content

Conversion

device
event_id

Development

debug_source
debug_campaign
debug_click_id
```

This schema supports campaign analysis, attribution reporting, and future offline conversion workflows.

---

# Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.ts
│   │
│   ├── thank-you/
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── LeadForm.tsx
│   └── LeadModal.tsx
│
├── lib/
│   ├── analytics.ts
│   ├── attribution.ts
│   ├── firstTouchAttribution.ts
│   ├── db.ts
│   ├── gtag.ts
│   ├── session.ts
│   └── tracking.ts
│
├── services/
│   └── leads.ts
│
└── types/
    ├── analytics.ts
    ├── attribution.ts
    ├── lead.ts
    └── session.ts
```

---

# Environment Variables

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
DATABASE_URL=your_neon_connection_string
```

---

# Installation

```bash
npm install
```

---

# Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Production

```bash
npm run build
npm start
```

---

# Testing

Verified:

### Attribution

- ✅ Automatic landing-page attribution capture
- ✅ UTM persistence
- ✅ GCLID capture
- ✅ Device capture
- ✅ First-touch attribution
- ✅ Attribution attached to conversion journey

### Lead Processing

- ✅ Browser submission
- ✅ API validation
- ✅ Database persistence
- ✅ Event ID persistence
- ✅ Attribution persistence

### Conversion Tracking

- ✅ Conversion journey creation
- ✅ Single `generate_lead`
- ✅ Duplicate conversion prevention
- ✅ Conversion expiry
- ✅ Event ID consistency between analytics and database

---

# Google Ads Integration

```text
Google Analytics 4

↓

generate_lead

↓

Google Ads Import

↓

Conversion Action
```

Recommended configuration:

```text
Event:
generate_lead

Count:
One

Source:
Google Analytics 4
```

Only validated leads successfully stored in the database become Google Ads conversions.

---

# Future Roadmap

Upcoming phases include:

- Google Tag Manager integration
- Enhanced Conversions for Leads
- Offline conversion imports
- CRM synchronization
- Qualified lead tracking
- Revenue attribution
- Server-side tracking
- Consent management
- Marketing intelligence dashboards

See **future.md** for the complete roadmap.

---

# Phase 3 Completion

Phase 3 introduces a complete attribution-aware conversion pipeline.

Implemented:

- ✅ Automatic attribution capture
- ✅ First-touch attribution storage
- ✅ Attribution attached to conversion journeys
- ✅ Session-based attribution persistence
- ✅ Device tracking
- ✅ Event ID persistence
- ✅ Database attribution storage
- ✅ Lead validation
- ✅ Service layer architecture
- ✅ Google Analytics 4 integration
- ✅ Google Ads conversion workflow
- ✅ End-to-end attribution-aware lead generation

Phase 3 transforms the project into an attribution-ready marketing platform where every validated lead is connected to the campaign, landing page, device, and conversion journey that generated it.
