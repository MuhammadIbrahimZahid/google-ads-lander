# Google Ads Lander

A production-oriented lead generation and conversion measurement system built with:

- Next.js
- TypeScript
- React
- Google Tag Manager
- Google Analytics 4
- Google Ads Conversion Tracking
- Enhanced Conversions for Leads
- Neon PostgreSQL

The project demonstrates a complete advertising conversion pipeline:

```

Google Ads

↓

Landing Page

↓

Attribution Capture

↓

Conversion Journey

↓

Lead Submission

↓

Database Persistence

↓

Google Tag Manager

↓

GA4 + Google Ads Conversion Tracking

```

---

# Project Overview

Google Ads Lander is a learning-focused production architecture for understanding how modern marketing platforms measure, attribute, and optimize lead generation campaigns.

The system separates:

Application Logic

from

Marketing Measurement Infrastructure

The application is responsible for:

- Creating conversion journeys
- Capturing attribution data
- Validating leads
- Persisting customer information
- Publishing business events

Google Tag Manager is responsible for:

- Receiving Data Layer events
- Routing analytics events
- Sending conversion signals to external platforms

---

# Features

## Lead Generation

Implemented:

- Lead capture modal
- Client-side validation
- Server-side validation
- API route handling
- Neon PostgreSQL persistence
- Lead service architecture

---

## Attribution Tracking

The system captures:

- Landing page
- Referrer
- GCLID
- UTM source
- UTM medium
- UTM campaign
- UTM term
- UTM content
- Device information

Storage:

```

sessionStorage

↓
Conversion Journey

localStorage

↓
First Touch Attribution

```

---

## Conversion Journey Management

Each conversion receives a unique identifier.

Example:

```

event_id:
8fdb4fe5-6ec5-49fb-a332-ef52f515b23b

```

The same identifier connects:

```

Browser

↓

Database Lead

↓

GA4 Event

↓

Google Ads Conversion

```

This enables:

- Debugging
- Deduplication
- Offline conversion workflows
- Attribution analysis

---

# Analytics Architecture

The measurement pipeline:

```

Next.js Application

↓

window.dataLayer

↓

Google Tag Manager

↓

GA4 Event Tags

↓

Google Analytics 4

↓

Google Ads

```

The application never directly communicates with marketing platforms.

It publishes business events only.

---

# Google Tag Manager Configuration

Configured tags:

## Google Tag

Purpose:

Loads Google Analytics configuration.

Trigger:

```

Initialization - All Pages

```

---

## GA4 Event Tags

### hero_cta_click

Tracks:

```

User clicks "Get Started"

```

Parameters:

```

button_name

```

---

### generate_lead

Tracks:

```

Completed lead submission

```

Parameters:

```

lead_source

event_id

```

---

## Google Ads Conversion Tracking

Configured:

```

Google Ads Conversion Tag

```

Conversion:

```

Lead Submitted - Website

```

Trigger:

```

CE - generate_lead

```

---

## Enhanced Conversions

Implemented through:

```

Google Ads User-provided Data Event

```

Data source:

```

user_data

```

The system sends hashed customer information for improved conversion matching.

---

# Local Development

## Requirements

Recommended:

- Node.js 20+
- npm
- PostgreSQL database

---

## Installation

Clone the repository:

```bash
git clone <repository-url>

cd google-ads-lander
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create:

```
.env.local
```

Add:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXXX

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

DATABASE_URL=your_neon_database_connection
```

Next.js loads environment variables from `.env*` files. Public browser variables must use the `NEXT_PUBLIC_` prefix. ([Next.js][1])

---

# Running the Application

Start development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

Next.js development servers are started using the `next dev` workflow. ([Next.js][2])

---

# Production Build

Create production build:

```bash
npm run build
```

Start production server:

```bash
npm start
```

A Next.js production deployment uses the build/start workflow. ([Next.js][3])

---

# Testing

The implementation has been validated through:

## Application

✅ Conversion journey creation
✅ Attribution capture
✅ Lead submission
✅ Database persistence
✅ Event ID persistence

---

## Google Tag Manager

Verified:

✅ Container loading
✅ Data Layer events
✅ Custom Event triggers
✅ GA4 tags firing
✅ Google Ads conversion tags firing
✅ Enhanced conversion tag firing

---

## Google Analytics 4

Verified:

✅ hero_cta_click event
✅ generate_lead event
✅ Event parameters
✅ DebugView delivery
✅ Realtime reporting

---

## Google Ads

Verified:

✅ Conversion action created

✅ Conversion ID configured

✅ Conversion label configured

✅ Google Ads conversion tag firing

✅ Enhanced conversions configured through GTM

---

# Project Structure

```
src/

├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.ts
│   │
│   ├── thank-you/
│   │   └── page.tsx
│   │
│   └── page.tsx
│
├── components/
│   ├── LeadForm.tsx
│   └── LeadModal.tsx
│
├── lib/
│   ├── analytics.ts
│   ├── attribution.ts
│   ├── dataLayer.ts
│   ├── firstTouchAttribution.ts
│   ├── session.ts
│   └── tracking.ts
│
├── services/
│   └── leads.ts
│
└── types/
```

---

# Documentation

Detailed phase documentation:

```
docs/

├── Phase-1

├── Phase-2

├── Phase-3

├── Phase-4
│   └── V1.md

└── Phase-5
    └── V1.md
```

---

# Current Status

Completed:

✅ Lead generation system
✅ Attribution tracking
✅ Conversion journey management
✅ GA4 integration
✅ Google Tag Manager integration
✅ Google Ads conversion tracking
✅ Enhanced conversions setup
✅ Production validation

---

# Future Roadmap

Planned:

- Offline conversion imports
- CRM synchronization
- Qualified lead tracking
- Revenue attribution
- Server-side GTM
- Consent Mode
- Advanced attribution reporting

---

# Purpose

This project is built as a complete learning implementation of a modern Google Ads lead measurement architecture.

The goal is to understand the complete path:

```
User

↓

Advertisement

↓

Website

↓

Conversion

↓

Database

↓

Analytics

↓

Advertising Platform
```
