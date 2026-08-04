# Conversion Journey Flow

This document describes the complete conversion tracking implementation completed in **Phase 4**, including Google Tag Manager integration, dataLayer event architecture, GA4 event delivery, event parameter validation, and production verification.

Phase 4 extends the Phase 3 conversion journey by introducing a complete analytics delivery pipeline from the application layer through Google Tag Manager and Google Analytics 4.

---

# Purpose

Phase 4 focuses on making the conversion journey measurable across the complete marketing analytics stack.

The objective is to ensure every valid conversion can be traced through:

- Application event creation
- Browser dataLayer
- Google Tag Manager
- Google Analytics 4
- Future Google Ads conversion workflows

The final pipeline connects:

```text
User Interaction
        │
        ▼
Next.js Application
        │
        ▼
window.dataLayer
        │
        ▼
Google Tag Manager
        │
        ▼
GA4 Event Tag
        │
        ▼
Google Analytics 4

Phase 4 Goals

Phase 4 introduces:

Centralized analytics event helpers
Strongly typed analytics parameters
Explicit conversion event payloads
GTM custom event triggers
GA4 event tags
Data Layer Variables
Production tracking validation
Conversion Flow
User lands on page
        │
        ▼
captureAttribution()
(sessionStorage)
        │
        ▼
captureFirstTouchAttribution()
(localStorage)
        │
        ▼
User clicks "Get Started"
        │
        ▼
ensureConversion()
        │
        ▼
Create conversion object
(sessionStorage)
        │
        ▼
Track hero_cta_click
        │
        ▼
window.dataLayer.push()
        │
        ▼
Google Tag Manager
        │
        ▼
GA4 Event
(hero_cta_click)
        │
        ▼
Open Lead Modal
        │
        ▼
User submits form
        │
        ▼
POST /api/leads
        │
        ▼
Lead saved successfully
        │
        ▼
completeConversion()
        │
        ▼
Redirect /thank-you
        │
        ▼
Validate conversion state
        │
        ▼
trackGenerateLead()
        │
        ▼
window.dataLayer.push()
        │
        ▼
Google Tag Manager
        │
        ▼
GA4 Event
(generate_lead)

Architecture
Landing Page
      │
      ▼
Attribution Capture
(sessionStorage)
      │
      ▼
Conversion Journey
(sessionStorage)
      │
      ▼
Lead Form
      │
      ▼
API Route
      │
      ▼
Neon PostgreSQL
      │
      ▼
completeConversion()
      │
      ▼
Analytics Layer
      │
      ▼
dataLayer
      │
      ▼
Google Tag Manager
      │
      ▼
Google Analytics 4

Analytics Layer

Phase 4 introduces a dedicated analytics abstraction layer.

Application components no longer push events directly.

Instead:

Component
    │
    ▼
analytics.ts
    │
    ▼
dataLayer.ts
    │
    ▼
window.dataLayer.push()


This keeps tracking logic separated from UI logic.

Analytics Events

The application currently sends two analytics events.

hero_cta_click

Purpose:

Measure user intent before conversion.

Triggered when:

User clicks "Get Started"


Payload:

{
  event: "hero_cta_click",
  button_name: "Get Started"
}

generate_lead

Purpose:

Measure completed lead conversions.

Triggered only after:

Lead successfully saved


Payload:

{
  event: "generate_lead",
  lead_source: "landing_page",
  event_id: "conversion-uuid"
}

Event Parameters
hero_cta_click

Parameters:

button_name


Example:

{
 button_name:"Get Started"
}

generate_lead

Parameters:

lead_source
event_id


Example:

{
 lead_source:"landing_page",
 event_id:"d4dfe2de-da17-4210-844c-cc9958030bbc"
}

Data Layer Structure

The browser dataLayer receives events in GTM-compatible format.

Example:

window.dataLayer.push({
  event:"generate_lead",
  lead_source:"landing_page",
  event_id:"conversion-id"
});


Google Tag Manager listens for these events using Custom Event triggers.

Google Tag Manager Configuration

Phase 4 GTM configuration:

Google Tag

Configuration:

Google Tag


Measurement ID:

G-1ZCMGK2M6Y


Trigger:

Initialization - All Pages


Purpose:

Loads the GA4 configuration globally.

Custom Event Triggers
CE - hero_cta_click

Trigger type:

Custom Event


Event name:

hero_cta_click


Fires on:

All Custom Events

CE - generate_lead

Trigger type:

Custom Event


Event name:

generate_lead


Fires on:

All Custom Events

GA4 Event Tags
GA4 Event - hero_cta_click

Event name:

hero_cta_click


Parameters:

button_name


Data Layer Variable:

DLV - button_name

GA4 Event - generate_lead

Event name:

generate_lead


Parameters:

lead_source
event_id


Data Layer Variables:

DLV - lead_source

DLV - event_id

GA4 Validation

Phase 4 verified the following:

GA4 DebugView

Confirmed:

generate_lead


received successfully.

Parameters:

event_id
lead_source
ga_session_id
page_location
debug_mode

GA4 Realtime

Confirmed:

hero_cta_click

generate_lead


appear in realtime event stream.

Production Validation

The complete tracking pipeline was tested on the deployed Vercel application.

Verified:

User Action
      │
      ▼
Next.js
      │
      ▼
dataLayer.push()
      │
      ▼
Google Tag Manager
      │
      ▼
GA4 Event Tag
      │
      ▼
GA4 Realtime


All stages successfully received events.

Debugging Process

Phase 4 introduced a structured debugging workflow.

Browser Validation

Check:

window.google_tag_manager


Expected:

GTM container loaded


Check:

window.dataLayer


Expected:

{
 event:"generate_lead",
 lead_source:"landing_page",
 event_id:"uuid"
}

GTM Preview Validation

Confirmed:

generate_lead
        │
        ▼
GA4 Event - generate_lead
        │
        ▼
Tag Fired

GA4 Validation

Confirmed:

generate_lead


received with parameters.

Conversion Lifecycle

The conversion lifecycle remains controlled by Phase 3 conversion state management.

Before Lead Submission
started = true

completed = false

fired = false

After Successful Lead Creation
started = true

completed = true

fired = false

After GA4 Event Dispatch
started = true

completed = true

fired = true

Database Relationship

Phase 4 keeps the Phase 3 database model unchanged.

Each lead remains connected through:

conversionEventId


Example:

Frontend:

event_id:"abc123"


Database:

event_id = abc123


GA4:

event_id = abc123


This creates a complete trace:

Marketing Source
        │
        ▼
Conversion Journey
        │
        ▼
Database Lead
        │
        ▼
GA4 Conversion Event

User Scenarios
Successful Conversion
Landing Page
        │
Capture Attribution
        │
CTA Click
        │
hero_cta_click
        │
Lead Submission
        │
Database Insert
        │
completeConversion()
        │
generate_lead
        │
GA4

Invalid Submission
Submit Form
        │
Validation Failure
        │
400 Response
        │
No Database Insert
        │
No generate_lead

Direct Thank You Visit
Open /thank-you
        │
No Conversion
        │
Redirect Home

Refresh After Conversion
generate_lead Sent
        │
Refresh
        │
Conversion Already Fired
        │
No Duplicate Event

Summary

Phase 4 completes the analytics delivery pipeline.

Implemented:

Centralized analytics event tracking
Typed event parameters
Explicit conversion payloads
GTM dataLayer integration
GTM custom event triggers
GA4 event tags
GA4 parameter tracking
Production validation

The final conversion pipeline is:

User
 |
 |
Next.js Application
 |
 |
Conversion State
 |
 |
Lead Database
 |
 |
dataLayer
 |
 |
Google Tag Manager
 |
 |
Google Analytics 4


Phase 4 establishes the foundation required for future:

Google Ads conversion imports
Enhanced conversions
Offline conversion tracking
Server-side tracking
Marketing attribution optimization

This keeps Phase 3 as the **conversion engine** and Phase 4 as the **measurement/analytics layer**, which is the correct separation.
```
