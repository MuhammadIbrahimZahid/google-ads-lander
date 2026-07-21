# Google Ads Lander — Phase 2

A conversion-focused landing page system built with **Next.js**, **TypeScript**, **Google Analytics 4**, **Google Ads conversion tracking**, and **Neon PostgreSQL**.

This project demonstrates a complete lead generation pipeline:

```text
Google Ad
    ↓
Landing Page
    ↓
CTA Interaction
    ↓
Conversion Journey Created
    ↓
Lead Form Submission
    ↓
Lead API Validation
    ↓
Neon PostgreSQL Storage
    ↓
Thank You Page
    ↓
generate_lead Event
    ↓
Google Analytics 4
    ↓
Google Ads Conversion Import
```

The purpose of Phase 2 is to connect measurable marketing conversions with real lead data storage.

---

# Phase 2 Features

Implemented:

- Next.js App Router
- TypeScript
- React Client Components
- Google Analytics 4 integration
- Google Ads conversion workflow
- Custom analytics events
- Conversion state management
- Session-based conversion tracking
- Duplicate conversion prevention
- CTA tracking
- Lead capture form
- API route handling
- Server-side lead processing
- Neon PostgreSQL database integration
- Lead validation
- Input trimming and normalization
- Database persistence

---

# Conversion Events

The application tracks two custom GA4 events.

---

# hero_cta_click

Tracks user interaction with the primary call-to-action.

Triggered when the user clicks:

```text
Get Started
```

Example:

```ts
trackHeroCTAClick({
  button_name: "Get Started",
});
```

Purpose:

- Measure landing page engagement
- Understand CTA performance
- Analyze user interaction

This event is not considered a conversion.

---

# generate_lead

Represents a completed conversion journey.

Triggered after:

```text
Landing Page

↓
CTA Click

↓
Conversion Created

↓
Lead Submitted

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
- Act as a GA4 Key Event
- Support Google Ads conversion imports

---

# Lead Capture Architecture

The lead flow:

```text
LeadForm.tsx

↓

POST /api/leads

↓

route.ts

↓

createLead()

↓

Neon PostgreSQL

↓

Success Response

↓

Thank You Page
```

---

# Lead API

Endpoint:

```text
POST /api/leads
```

Location:

```text
src/app/api/leads/route.ts
```

The API handles:

- Request parsing
- Required field validation
- Lead creation
- Error handling
- Database communication

---

# Lead Data Stored

The system stores:

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

---

# Database

Database:

```text
Neon PostgreSQL
```

Lead storage is handled through:

```text
src/services/leads.ts
```

Responsibilities:

- Insert lead records
- Handle nullable values
- Return created lead data

---

# Input Validation

The application validates:

## Required fields

Required:

```text
name
email
```

Invalid requests return:

```text
400 Bad Request
```

---

## Email Validation

Invalid emails are rejected:

Example:

```text
abc
```

Result:

```text
400 Bad Request
```

---

## Data Normalization

Input values are cleaned before storage.

Example:

Input:

```text
"   John Smith   "
```

Stored:

```text
"John Smith"
```

Phone values are also normalized.

---

# Conversion Tracking Architecture

Analytics responsibilities are separated:

```text
React Component

↓

Analytics Helper

↓

gtag Wrapper

↓

window.gtag()

↓

Google Analytics 4
```

Conversion state is managed separately:

```text
User Click

↓

ensureConversion()

↓

sessionStorage

↓

Lead Submission

↓

Thank You Page

↓

Validation

↓

generate_lead

↓

consumeConversion()
```

---

# Storage Usage

The project uses two browser storage systems.

---

# sessionStorage

Used for active conversion journeys.

Example:

```json
{
  "eventId": "abc123",
  "allowed": true,
  "fired": false,
  "createdAt": 1750000000
}
```

Stores:

- Conversion identifier
- Conversion status
- Creation timestamp

Used for:

- Maintaining conversion state
- Preventing duplicate conversions
- Expiring old conversion attempts

---

# localStorage

Used for browser-level tracking locks.

Example:

```text
hero_click_fired = 1
```

Used for:

- Preventing repeated CTA click events
- Persisting tracking information

---

# Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   └── thank-you/
│       └── page.tsx
│
├── components/
│   └── LeadForm.tsx
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

# Production Build

Create production build:

```bash
npm run build
```

Start:

```bash
npm start
```

---

# Testing Completed

Verified:

## API Validation

✅ Empty name rejected
✅ Missing email rejected
✅ Invalid email rejected

## Data Processing

✅ Name trimming
✅ Phone normalization

## Lead Creation

✅ Browser submission
✅ API success response
✅ Neon database insert

## Conversion Tracking

✅ Thank you page redirect
✅ generate_lead event firing
✅ Duplicate conversion protection

---

# Google Ads Integration

Workflow:

```text
Google Analytics 4

↓

generate_lead Key Event

↓

Google Ads Import

↓

Conversion Action
```

Conversion action configuration:

```text
Event:
generate_lead

Count:
One

Source:
Google Analytics 4
```

Google Ads attribution depends on valid Google Ads traffic and imported conversion data.

---

# Phase 2 Completion Status

The project currently demonstrates:

✅ Landing page conversion tracking
✅ GA4 event tracking
✅ Google Ads conversion workflow
✅ Conversion validation
✅ Duplicate prevention
✅ Lead form capture
✅ API-based lead processing
✅ Neon PostgreSQL storage
✅ Lead validation
✅ Input normalization
✅ End-to-end conversion pipeline
