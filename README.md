# Google Ads Lander — Phase 1

A conversion tracking landing page built with **Next.js**, **TypeScript**, **Google Analytics 4**, and **Google Ads conversion imports**.

This project demonstrates a browser-based conversion tracking pipeline:

```text
Google Ad
    ↓
Landing Page
    ↓
CTA Click
    ↓
Conversion Created
    ↓
Thank You Page
    ↓
generate_lead Event
    ↓
Google Analytics 4
    ↓
Google Ads Conversion Import
```

The purpose of Phase 1 is to understand how a user action becomes a measurable conversion event.

---

# Phase 1 Features

Implemented:

- Next.js App Router
- TypeScript
- Google Analytics 4 integration using `gtag`
- Custom analytics events
- Conversion state management
- Session-based conversion tracking
- CTA tracking
- Conversion validation
- Duplicate conversion prevention
- GA4 Key Event configuration
- Google Ads conversion import workflow

---

# Conversion Events

The application tracks two custom GA4 events.

## hero_cta_click

Tracks user interaction with the primary call-to-action button.

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

This event is an analytics event and is not considered a conversion.

---

## generate_lead

Represents a completed conversion journey.

Triggered after:

```text
Landing Page

↓

CTA Click

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

- Represent successful conversion completion
- Act as a GA4 Key Event
- Provide conversion data for Google Ads import

---

# Conversion Tracking Architecture

The application separates tracking responsibilities:

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

The conversion state is managed separately:

```text
User Click

↓

ensureConversion()

↓

sessionStorage

↓

/thank-you

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

## sessionStorage

Used for the active conversion journey.

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

- Maintaining conversion state between pages
- Preventing duplicate conversions
- Expiring old conversion attempts

---

## localStorage

Used for browser-level tracking locks.

Example:

```text
hero_click_fired = 1
```

Used for:

- Preventing repeated CTA click events
- Persisting tracking information across browser sessions

---

# Project Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── thank-you/
│       └── page.tsx
│
├── constants/
│   └── analytics.ts
│
├── lib/
│   ├── analytics.ts
│   ├── gtag.ts
│   ├── session.ts
│   └── tracking.ts
│
├── types/
│   ├── analytics.ts
│   └── session.ts
│
public/

docs/
```

---

# Prerequisites

Install:

- Node.js 20+ (recommended)
- npm

---

# Clone the Repository

```bash
git clone <repository-url>

cd google-ads-lander
```

---

# Install Dependencies

```bash
npm install
```

---

# Configure Environment Variables

Create:

```text
.env.local
```

Add your Google Analytics Measurement ID:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace the value with your GA4 Measurement ID.

---

# Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Build for Production

```bash
npm run build
```

---

# Start Production Server

```bash
npm start
```

---

# Google Analytics Setup

Google Analytics is initialized in:

```text
src/app/layout.tsx
```

The application reads the Measurement ID from:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID
```

The value is injected at runtime and avoids hardcoding the GA4 property ID inside the application code.

Events are sent using:

```javascript
window.gtag();
```

---

# Google Ads Integration

Phase 1 connects GA4 events with Google Ads conversion tracking.

The workflow:

```text
Google Analytics 4

↓

generate_lead Key Event

↓

Google Ads Import

↓

Conversion Action
```

The conversion action uses:

```text
Event:
generate_lead

Count:
One

Source:
Google Analytics 4
```

Google Analytics can record the event from any visitor.

Google Ads only reports conversions when the event can be attributed to a Google Ads interaction.

---

# Important Behaviors

## Direct Thank You Page Visit

If a user opens:

```text
/thank-you
```

without completing the CTA flow:

Result:

```text
Redirect to homepage
```

---

## Refreshing Thank You Page

If the conversion was already completed:

```json
{
  "fired": true
}
```

Result:

```text
No duplicate generate_lead event
```

---

## Expired Conversion

Conversion records expire after the configured session window.

Expired conversions are ignored and a new conversion journey can begin.

---

# Available Scripts

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Start production server:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

# Phase 1 Completion

The project currently demonstrates:

✅ Landing page conversion tracking
✅ GA4 event tracking
✅ Conversion validation
✅ Duplicate prevention
✅ Key Event configuration
✅ Google Ads conversion import workflow

---
