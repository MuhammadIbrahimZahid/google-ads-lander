# Conversion Journey Flow

This document describes the complete conversion journey implemented in **Phase 3**, including automatic attribution capture, conversion state management, lead persistence, first-touch attribution storage, and Google Analytics 4 conversion tracking.

---

# Purpose

Phase 3 extends the conversion journey by introducing automatic marketing attribution and a unified conversion object that carries attribution throughout the user's session.

The objective is to ensure that every valid lead submission is permanently associated with:

- Google Ads Click ID (GCLID)
- UTM parameters
- Landing page
- Referrer
- Device information
- Conversion Event ID

This creates a complete attribution pipeline from landing page through database persistence and analytics.

---

# Conversion Flow

```text
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
Attach attribution
to conversion
        │
        ▼
Track hero_cta_click
(localStorage)
        │
        ▼
Open Lead Modal
        │
        ▼
User submits form
        │
        ▼
Read conversion.attribution
        │
        ▼
POST /api/leads
        │
        ├── Invalid
        │       │
        │       ▼
        │   Return 400
        │   Keep modal open
        │   No database row
        │
        └── Valid
                │
                ▼
        Insert lead into Neon
        (with attribution)
                │
                ▼
        completeConversion()
                │
                ▼
        Redirect /thank-you
                │
                ▼
        Validate conversion
                │
                ▼
        Track generate_lead
                │
                ▼
        consumeConversion()
```

---

# Architecture

```text
Landing Page
      │
      ▼
Attribution Capture
(sessionStorage)
      │
      ▼
First-Touch Storage
(localStorage)
      │
      ▼
Conversion Journey
(sessionStorage)
      │
      ▼
LeadForm
      │
      ▼
Route Handler (/api/leads)
      │
      ▼
Service Layer
      │
      ▼
Neon PostgreSQL
      │
      ▼
Google Analytics 4
```

The backend continues to use a Next.js App Router Route Handler (`route.ts`) to process lead submissions while the browser manages conversion state and attribution throughout the user's session. Route Handlers provide HTTP endpoints using the standard Web Request and Response APIs inside the App Router. :contentReference[oaicite:0]{index=0}

---

# Responsibilities

## Attribution

Responsible for:

- Capturing GCLID
- Capturing UTM parameters
- Capturing landing page
- Capturing referrer
- Capturing device information
- Persisting attribution in `sessionStorage`

---

## First Touch Attribution

Responsible for:

- Preserving the original acquisition source
- Writing only once
- Never overwriting existing attribution
- Persisting data in `localStorage`

---

## Conversion Journey

Responsible for:

- Creating a unique conversion event
- Attaching attribution to the conversion
- Managing conversion lifecycle
- Preventing duplicate conversions

---

## LeadForm

Responsible for:

- Managing form state
- Reading attribution from the conversion object
- Sending attribution with the lead
- Completing the conversion after a successful insert
- Redirecting to `/thank-you`

---

## API Route

Responsible for:

- Validating incoming requests
- Sanitizing input
- Passing attribution fields
- Calling the service layer
- Returning success or validation errors

---

## Lead Service

Responsible for:

- Database operations only
- Persisting attribution fields
- Persisting device information
- Persisting conversion event ID

---

# Attribution Fields

Each lead now contains:

```text
landingPage
referrer

gclid

utmSource
utmMedium
utmCampaign
utmTerm
utmContent

device

conversionEventId
```

These values originate from the landing page and remain attached to the conversion journey until the lead is successfully created.

---

# Validation

The API validates:

- Name is required
- Email is required
- Email format
- Maximum field lengths
- Phone normalization

Invalid requests:

- Return **400 Bad Request**
- Do not insert a database row
- Do not complete the conversion

---

# Conversion Lifecycle

The conversion stored in `sessionStorage` progresses through three states.

### After CTA click

```text
started = true
completed = false
fired = false

attribution = {
    ...
}
```

---

### After successful lead creation

```text
started = true
completed = true
fired = false

attribution = {
    ...
}
```

---

### After generate_lead

```text
started = true
completed = true
fired = true

attribution = {
    ...
}
```

---

# Database Persistence

Every successful lead stores:

```text
Customer

Name
Email
Phone

Landing Context

Landing Page
Referrer

Google Attribution

GCLID
UTM Source
UTM Medium
UTM Campaign
UTM Term
UTM Content

Technical Metadata

Device
Event ID
```

This allows every stored lead to be traced back to its acquisition source and conversion journey.

---

# Thank You Page

The thank-you page verifies that:

- A conversion exists
- The conversion has completed
- The conversion has not already fired

If any validation fails:

```text
Redirect Home
```

Otherwise:

```text
Track generate_lead
        │
        ▼
consumeConversion()
```

This guarantees exactly one `generate_lead` event per completed conversion.

---

# User Scenarios

### Successful Conversion

```text
Landing Page
        │
Capture Attribution
        │
Click Get Started
        │
Conversion Created
        │
Open Modal
        │
Submit Valid Form
        │
Lead Stored
        │
Redirect /thank-you
        │
generate_lead
```

---

### Invalid Submission

```text
Submit Invalid Form
        │
Validation Fails
        │
400 Response
        │
No Database Row
        │
No generate_lead
```

---

### Close Modal

```text
Landing Page
        │
Capture Attribution
        │
Click Get Started
        │
Conversion Starts
        │
Close Modal
        │
No Lead Created
        │
Conversion Expires After 30 Minutes
```

---

### Refresh Thank You Page

```text
First Visit
        │
generate_lead Sent
        │
Refresh
        │
Redirect Home
        │
No Duplicate Conversion
```

---

### Direct Visit to /thank-you

```text
No Active Conversion
        │
Redirect Home
```

---

### Return Visit

```text
User Returns Later
        │
First-Touch Attribution
Already Exists
        │
Original Acquisition
Preserved
```

---

# Summary

Phase 3 introduces a complete attribution-aware conversion pipeline:

- Attribution is captured automatically when the landing page loads.
- First-touch attribution is preserved in `localStorage`.
- Clicking the CTA creates a conversion journey containing attribution and a unique event ID.
- The lead form reads attribution directly from the conversion object.
- `/api/leads` validates every request.
- `services/leads.ts` persists attribution, device information, and the conversion event ID in Neon PostgreSQL.
- `completeConversion()` is called only after a successful database insert.
- `/thank-you` remains the conversion checkpoint.
- `generate_lead` fires exactly once for each completed conversion.
- Every stored lead can be traced back to its original acquisition source, marketing campaign, and conversion journey.
