# Google Ads Lander — Phase 4

A production-oriented lead generation, attribution, and analytics measurement system built with **Next.js**, **TypeScript**, **Google Tag Manager**, **Google Analytics 4**, **Google Ads**, and **Neon PostgreSQL**.

Phase 4 extends the lead capture platform by introducing a complete analytics event pipeline.

The system now captures marketing attribution, manages conversion journeys, stores leads with attribution data, publishes structured business events through the Data Layer, routes events through Google Tag Manager, and delivers conversion data to Google Analytics 4.

---

# Conversion Journey

````text
### Google Ad
    │
    ▼
### Landing Page
    │
    ▼
### Capture Attribution
(sessionStorage)
    │
    ▼
### First Touch Attribution
(localStorage)
    │
    ▼
Hero **CTA** Click
    │
    ▼
### Conversion Journey Created
(event_id + attribution)
    │
    ▼
### Lead Modal
    │
    ▼
### Lead Form Submission
    │
    ▼
**POST** /api/leads
    │
    ▼
### Server Validation
    │
    ▼
Neon PostgreSQL
    │
    ▼
completeConversion()
    │
    ▼
### Thank You Page
    │
    ▼
### Data Layer Event
(generate_lead)
    │
    ▼
### Google Tag Manager
    │
    ▼
**GA4** Event Tag
    │
    ▼
Google Analytics 4
    │
    ▼
### Google Ads

Phase 4 creates a complete measurement pipeline where application events are separated from marketing platforms.

The application publishes business events.

Google Tag Manager controls where those events are sent.

Features

Implemented:

Next.js App Router
TypeScript
### React Client Components
Google Tag Manager integration
Google Analytics 4 integration
Google Ads conversion workflow
Data Layer event architecture
Custom analytics events
**GTM** custom event triggers
**GA4** Event tags
Event parameter mapping
Session-based conversion management
Conversion expiry handling
Duplicate conversion prevention
Hero **CTA** tracking
Automatic attribution capture
First-touch attribution support
Lead capture modal
**API** Route handling
Server-side validation
Input normalization
Neon PostgreSQL integration
Service layer architecture
Device tracking
Conversion Event ID persistence
Landing page attribution
**UTM** parameter tracking
**GCLID** capture
Thank-you page conversion validation
Production **GTM** validation
**GA4** DebugView validation
Architecture
Browser
    │
    ▼
### Attribution Capture
    │
    ▼
### Conversion Journey
    │
    ▼
### React Components
    │
    ▼
Route Handler (/api/leads)
    │
    ▼
### Lead Service
    │
    ▼
Neon PostgreSQL
    │
    ▼
completeConversion()
    │
    ▼
### Data Layer
    │
    ▼
### Google Tag Manager
    │
    ▼
Google Analytics 4

Each layer has a single responsibility:

Attribution collection Conversion management User interface **API** validation Database persistence Event publishing Analytics routing ### Attribution Flow

Marketing attribution is captured automatically when the visitor lands on the website.

### Landing Page

↓

captureAttribution()

↓

sessionStorage

↓

captureFirstTouchAttribution()

↓

localStorage

↓

ensureConversion()

↓

### Conversion Object

↓

### Lead Submission

↓

Database

Captured values:

landing_page

referrer

gclid

utm_source

utm_medium

utm_campaign

utm_term

utm_content

device

### Conversion Journey

The conversion object contains conversion state and attribution context.

Example:

{
    *eventId*: *921d8c5e-c124-4d2d-**9587**-427cb7d49bb6*,
    *started*: true,
    *completed*: true,
    *fired*: false,
    *createdAt*: **1750000000**,
    *attribution*: {
    *gclid*: *test123*,
    *utmSource*: *google*,
    *utmMedium*: *cpc*,
    *utmCampaign*: *summer_sale*,
    *landingPage*: */*,
    *device*: *Mozilla/5.0...*
    }
}

The conversion journey remains the single source of truth throughout the lead lifecycle.

### Browser Storage

sessionStorage

Stores:

Active conversion journey Attribution Conversion state Event ID Conversion expiry

Conversion journeys expire after:

30 minutes

localStorage

Stores:

hero_click_fired

first_touch_attribution

First-touch attribution is written once and never overwritten.

### Lead Pipeline

### Landing Page

↓

### Capture Attribution

↓

**CTA** Click

↓

### Conversion Created

↓

### Lead Form

↓

**POST** /api/leads

↓

Validation

↓

### Lead Service

↓

Neon PostgreSQL

↓

completeConversion()

↓

### Thank You Page

↓

### Data Layer

↓

### Google Tag Manager

↓

generate_lead

### Data Layer

Phase 4 introduces a structured Data Layer communication layer.

The application publishes events:

window.dataLayer.push({
    event: *generate_lead*,
    lead_source: *landing_page*,
    event_id: *uuid*
});

The application does not directly communicate with **GA4**.

Instead:

Next.js

↓

### Data Layer

↓

### Google Tag Manager

↓

### Analytics Platforms

### Analytics Events

hero_cta_click

Represents user engagement.

Triggered when:

User clicks *Get Started*

Payload:

event

button_name

Example:

{
    event:*hero_cta_click*,
    button_name:*Get Started*
}

generate_lead

Represents a completed lead conversion.

Triggered after:

### Lead Stored

↓

completeConversion()

↓

### Thank You Page

↓

generate_lead

Payload:

event

lead_source

event_id

Example:

{
    event:*generate_lead*,
    lead_source:*landing_page*,
    event_id:*uuid*
}

### Google Tag Manager

Phase 4 introduces **GTM** as the analytics routing layer.

Configured events:

CE - hero_cta_click

CE - generate_lead

**GA4** Event Tags

Configured tags:

**GA4** Event - hero_cta_click

Parameters:

button_name

Source:

**DLV** - button_name

**GA4** Event - generate_lead

Parameters:

lead_source

event_id

Sources:

**DLV** - lead_source

**DLV** - event_id

Database

Each stored lead contains:

Customer

name email phone

### Marketing Attribution

landing_page referrer gclid utm_source utm_medium utm_campaign utm_term utm_content

Conversion

device event_id

Development

debug_source debug_campaign debug_click_id

This allows every lead to be connected to its marketing origin and analytics event.

### Project Structure

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
│   ├── dataLayer.ts
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

### Environment Variables

Create:

.env.local

Add:

NEXT_PUBLIC_GTM_ID=**GTM**-**XXXXXXXX** NEXT_PUBLIC_GA_MEASUREMENT_ID=G-**XXXXXXXXXX** DATABASE_URL=your_neon_connection_string

Installation npm install

Development npm run dev

Open:

[http://localhost:**3000**](http://localhost:**3000**)

Production npm run build

npm start

Testing

Verified:

Attribution ✅ Automatic attribution capture ✅ **UTM** persistence ✅ **GCLID** capture ✅ Device capture ✅ First-touch attribution ✅ Attribution attached to conversion journey ### Lead Processing ✅ Browser submission ✅ **API** validation ✅ Database persistence ✅ Event ID persistence ✅ Attribution persistence ### Analytics Pipeline ✅ **GTM** container loading ✅ Data Layer initialization ✅ hero_cta_click event ✅ generate_lead event ✅ **GTM** custom event triggers ✅ **GA4** Event tags firing ✅ **GA4** DebugView events ✅ **GA4** Realtime events ✅ Production Vercel validation ### Google Ads Integration

Current flow:

Google Analytics 4

↓

generate_lead

↓

### Google Ads Conversion Import

↓

### Conversion Action

Recommended configuration:

Event:

generate_lead

Count:

One

Source:

Google Analytics 4

Only completed and validated leads should become advertising conversions.

### Future Roadmap

Upcoming phases:

Enhanced Conversions for Leads Offline conversion imports **CRM** synchronization Qualified lead tracking Revenue attribution Server-side **GTM** Consent management Marketing dashboards Advanced attribution reporting

See future.md for the complete roadmap.

Phase 4 Completion

Phase 4 completes the analytics measurement foundation.

Implemented:

✅ Automatic attribution capture ✅ First-touch attribution storage ✅ Conversion journey management ✅ Lead persistence ✅ Event ID consistency ✅ Data Layer architecture ✅ Google Tag Manager integration ✅ **GA4** Event tag configuration ✅ Custom event triggers ✅ Event parameter mapping ✅ Production tracking validation

Phase 4 transforms the project from an attribution-aware lead system into a complete conversion measurement platform where application events, database records, Google Tag Manager, Google Analytics 4, and Google Ads are connected through a structured tracking architecture. ```
````
