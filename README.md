# Google Ads Lander — Phase 2

A production-oriented lead generation system built with **Next.js**, **TypeScript**, **Google Analytics 4**, **Google Ads**, and **Neon PostgreSQL**.

Phase 2 extends the browser-based conversion tracking foundation by introducing validated lead capture, server-side processing, and database persistence.

The project demonstrates how a marketing conversion becomes a real business lead.

---

# Conversion Journey

```text
Google Ad
        │
        ▼
Landing Page
        │
        ▼
Hero CTA Click
        │
        ▼
Conversion Journey Created
(sessionStorage)
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
        │
        ▼
Google Analytics 4
        │
        ▼
Google Ads
```

The purpose of Phase 2 is to connect measurable marketing conversions with validated first-party lead data.

---

# Features

Implemented:

- Next.js App Router
- TypeScript
- React Client Components
- Google Analytics 4 integration
- Google Ads conversion workflow
- Custom analytics events
- Browser conversion journey
- Session-based conversion management
- Conversion expiry handling
- Duplicate conversion prevention
- Hero CTA tracking
- Lead capture modal
- API Route handling
- Server-side validation
- Input normalization
- Neon PostgreSQL integration
- Service layer architecture
- Lead persistence
- Thank-you page conversion validation

---

# Architecture

```text
Browser
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

Responsibilities are intentionally separated between presentation, business logic, persistence, and analytics.

---

# Conversion Events

The application tracks two custom GA4 events.

---

## hero_cta_click

Represents user intent.

Triggered when the visitor clicks the primary CTA.

Example:

```ts
trackHeroCTAClick({
  button_name: "Get Started",
});
```

Purpose:

- Measure landing page engagement
- Measure CTA performance
- Understand visitor intent

This event is **not** considered a conversion.

To avoid inflated engagement metrics, it is tracked once per browser using `localStorage`.

---

## generate_lead

Represents a completed lead generation journey.

Triggered only after:

```text
CTA Click

↓

Conversion Journey Created

↓

Lead Submitted

↓

Server Validation

↓

Database Insert

↓

completeConversion()

↓

Thank You Page

↓

Conversion Validation

↓

generate_lead
```

Example:

```ts
trackGenerateLead({
  lead_source: "landing_page",
  event_id: conversion.eventId,
});
```

Purpose:

- Represent successful lead generation
- Serve as a GA4 Key Event
- Support Google Ads conversion imports

The event is fired exactly once for each completed conversion journey.

---

# Lead Capture Pipeline

```text
LeadForm.tsx

↓

POST /api/leads

↓

route.ts

↓

Validation

↓

Lead Service

↓

Neon PostgreSQL

↓

Success Response

↓

completeConversion()

↓

Thank You Page
```

Only successful database inserts complete the conversion journey.

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
- Call service layer
- Return success or validation errors

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

# Lead Service

Location:

```text
src/services/leads.ts
```

Responsibilities:

- Execute SQL queries
- Insert leads
- Keep persistence separate from API logic
- Return the created lead

---

# Lead Data

Each lead stores:

```text
name
email
phone

landing_page
referrer

gclid

utm_source
utm_medium
utm_campaign
utm_term
utm_content

debug_source
debug_campaign
debug_click_id
```

This data forms the foundation for future attribution and marketing analysis.

---

# Conversion Lifecycle

A conversion journey progresses through three states.

## Journey Started

```text
started = true
completed = false
fired = false
```

---

## Lead Created

```text
started = true
completed = true
fired = false
```

---

## Analytics Completed

```text
started = true
completed = true
fired = true
```

---

# Browser Storage

The project intentionally uses two browser storage mechanisms.

---

## sessionStorage

Stores the active conversion journey.

Example:

```json
{
  "eventId": "abc123",
  "started": true,
  "completed": false,
  "fired": false,
  "createdAt": 1750000000
}
```

Used for:

- Conversion state
- Event deduplication
- Thank-you page validation
- Conversion expiry

Conversion journeys automatically expire after **30 minutes**.

---

## localStorage

Stores browser-level tracking information.

Example:

```text
hero_click_fired = 1
```

Used for:

- Preventing repeated `hero_cta_click`
- Persisting CTA tracking across reloads

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
├── constants/
│   └── analytics.ts
│
├── lib/
│   ├── analytics.ts
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

Install dependencies:

```bash
npm install
```

---

# Development

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Production

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

---

# Testing

Verified:

### API Validation

- ✅ Required field validation
- ✅ Email validation
- ✅ Maximum field validation

### Input Processing

- ✅ Name trimming
- ✅ Email normalization
- ✅ Phone normalization

### Lead Processing

- ✅ Browser submission
- ✅ API validation
- ✅ Database persistence
- ✅ Service layer

### Conversion Tracking

- ✅ Conversion journey creation
- ✅ Thank-you page validation
- ✅ Single `generate_lead` event
- ✅ Duplicate conversion prevention
- ✅ Conversion expiry handling

---

# Google Ads Integration

```text
Google Analytics 4

↓

generate_lead Key Event

↓

Google Ads Import

↓

Conversion Action
```

Recommended Google Ads configuration:

```text
Event:
generate_lead

Count:
One

Source:
Google Analytics 4
```

Only validated and successfully stored leads become Google Ads conversions.

---

# Future Roadmap

Phase 2 establishes the foundation for a complete first-party marketing attribution platform.

Future phases introduce:

- Attribution capture
- Google Tag Manager
- Enhanced Conversions for Leads
- Qualified lead tracking
- Offline conversions
- Revenue attribution
- Value-based bidding
- Consent management
- Server-side tracking
- CRM integration
- Marketing intelligence

See **future.md** for the complete roadmap.

---

# Phase 2 Completion

The project currently demonstrates:

- ✅ Browser conversion journey
- ✅ Lead capture
- ✅ Server-side validation
- ✅ API Route handling
- ✅ Neon PostgreSQL persistence
- ✅ Service layer architecture
- ✅ Google Analytics 4 integration
- ✅ Google Ads conversion workflow
- ✅ Session-based conversion management
- ✅ Duplicate conversion prevention
- ✅ End-to-end lead generation pipeline

Phase 2 provides the foundation for future attribution, CRM integration, offline conversion tracking, and revenue measurement.
