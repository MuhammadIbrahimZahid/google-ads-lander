# Google Ads Lander

A production-oriented lead generation and marketing measurement system built with **Next.js**, **TypeScript**, **Google Tag Manager**, **Google Analytics 4**, **Google Ads**, and **Neon PostgreSQL**.

The project demonstrates how a modern lead generation application can capture marketing attribution, persist leads, measure conversions, manage a CRM-style lead lifecycle, and prepare data for future advertising optimization.

---

# Overview

Google Ads Lander is a learning-focused implementation of a complete marketing measurement architecture.

Rather than embedding analytics and advertising logic throughout the application, the project separates:

- Application logic
- Business events
- Marketing measurement

The application publishes business events through the Data Layer, while Google Tag Manager decides how those events are routed to analytics and advertising platforms.

---

# Architecture

```text
Google Ads Click
        │
        ▼
Landing Page
        │
        ▼
Attribution Capture
        │
        ▼
Conversion Journey
        │
        ▼
Lead Submission
        │
        ▼
Neon PostgreSQL
        │
        ▼
CRM Lead Lifecycle
(new → contacted → qualified → disqualified)
        │
        ▼
window.dataLayer
        │
        ▼
Google Tag Manager
        │
        ├───────────────┐
        ▼               ▼
Google Analytics 4   Google Ads
```

---

# Features

## Lead Management

- Lead capture modal
- Client-side validation
- Server-side validation
- REST API
- Neon PostgreSQL persistence
- CRM-style lead management
- Lead status updates
- Event ID generation

---

## Marketing Attribution

Automatically captures:

- Landing page
- Referrer
- GCLID
- UTM Source
- UTM Medium
- UTM Campaign
- UTM Term
- UTM Content
- Device information

Supports both:

- Session attribution
- First-touch attribution

---

## Conversion Journey

Every conversion receives a unique `event_id`.

Example:

```text
event_id

↓

Browser

↓

Database

↓

GA4

↓

Google Ads
```

This identifier enables:

- Event correlation
- Debugging
- Deduplication
- Future offline conversion imports

---

## Analytics

Implemented through Google Tag Manager.

Tracked events:

- `hero_cta_click`
- `generate_lead`
- `lead_contacted`
- `lead_qualified`
- `lead_disqualified`

Lead lifecycle events are automatically generated whenever a lead status changes within the CRM.

---

## Google Ads Integration

Implemented:

- Google Ads Conversion Tracking
- Conversion Linker
- Enhanced Conversions for Leads
- User-Provided Data Event
- SHA-256 identity hashing
- Conversion action integration

---

# Event Flow

```text
hero_cta_click
        │
        ▼
generate_lead
        │
        ▼
lead_contacted
        │
        ▼
lead_qualified
        │
        ▼
lead_disqualified
```

This event model mirrors the progression of a lead through the sales process.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript

## Backend

- Next.js Route Handlers
- Neon PostgreSQL

## Marketing Stack

- Google Tag Manager
- Google Analytics 4
- Google Ads
- Enhanced Conversions

---

# Local Development

## Requirements

- Node.js 20+
- npm
- Neon PostgreSQL (or PostgreSQL-compatible database)

---

## Installation

```bash
git clone <repository-url>

cd google-ads-lander

npm install
```

---

## Environment Variables

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXXX

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

DATABASE_URL=your_database_connection
```

---

## Run

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

---

# Testing

The project has been validated end-to-end.

## Application

- ✅ Lead submission
- ✅ Database persistence
- ✅ Attribution capture
- ✅ Event ID generation
- ✅ CRM status updates

## Google Tag Manager

Verified:

- ✅ Data Layer events
- ✅ Custom Event triggers
- ✅ GA4 Event tags
- ✅ Google Ads Conversion tag
- ✅ Enhanced Conversion tag
- ✅ Lead lifecycle trigger

## Google Analytics 4

Verified:

- ✅ hero_cta_click
- ✅ generate_lead
- ✅ lead_contacted
- ✅ lead_qualified
- ✅ lead_disqualified
- ✅ DebugView
- ✅ Realtime reporting
- ✅ Custom event parameters

## Google Ads

Verified:

- ✅ Conversion Action
- ✅ Conversion Tracking
- ✅ Enhanced Conversions
- ✅ User-Provided Data Event
- ✅ GTM integration

---

# Project Structure

```text
src/

├── app/
│   ├── api/
│   ├── admin/
│   ├── thank-you/
│   └── page.tsx
│
├── components/
│
├── lib/
│
├── services/
│
├── types/
│
└── utils/
```

---

# Documentation

Detailed implementation notes are available for each development phase.

```text
docs/

├── Phase-1/
├── Phase-2/
├── Phase-3/
├── Phase-4/
├── Phase-5/
└── Phase-6/
```

Each phase documents:

- Architecture
- Design decisions
- Implementation details
- Testing workflow
- Validation
- Diagrams

---

# Current Status

Completed:

- ✅ Conversion journey management
- ✅ Attribution tracking
- ✅ Lead capture
- ✅ Lead persistence
- ✅ Google Tag Manager integration
- ✅ Google Analytics 4 integration
- ✅ Google Ads conversion tracking
- ✅ Enhanced Conversions
- ✅ CRM lead management
- ✅ Lead lifecycle tracking
- ✅ Lifecycle analytics events

---

# Roadmap

Planned future phases:

- Offline Conversion Tracking
- Revenue Attribution
- Value-Based Optimization
- Consent Mode v2
- Server-Side Tracking
- CRM Integrations
- Marketing Intelligence & Data Warehouse

---

# Purpose

The goal of this project is to understand how modern marketing measurement systems are designed and implemented.

The project evolves through multiple phases:

```text
Browser Tracking

↓

Lead Capture

↓

Marketing Attribution

↓

Google Tag Manager

↓

Google Analytics 4

↓

Google Ads

↓

CRM Lead Lifecycle

↓

Offline Conversions

↓

Revenue Attribution

↓

Marketing Intelligence
```

Each phase builds on the previous one, gradually transforming a simple landing page into a production-style marketing measurement platform that reflects how modern advertising and analytics systems operate.
