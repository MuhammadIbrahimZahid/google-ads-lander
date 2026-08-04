# Conversion Journey Flow

This document describes the complete conversion journey implemented in **Phase 2**, including lead capture, server-side validation, database persistence, and Google Analytics 4 conversion tracking.

---

# Purpose

Phase 2 extends the browser-based conversion journey by introducing:

- Lead capture through a modal form
- Server-side validation
- Input sanitization
- Neon PostgreSQL persistence
- Accurate GA4 conversion tracking

The objective is to ensure that only valid lead submissions are stored and counted as conversions.

---

# Conversion Flow

```text
User visits landing page
        │
        ▼
Clicks "Get Started"
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
(localStorage)
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
Browser
   │
React Components
   │
Route Handler (/api/leads)
   │
Service Layer
   │
Neon PostgreSQL
   │
Google Analytics 4
```

The backend uses a Next.js App Router Route Handler to process lead submissions. Route Handlers expose HTTP endpoints through `route.ts` files inside the `app` directory. :contentReference[oaicite:0]{index=0}

---

# Responsibilities

## LeadModal

Responsible for:

- Displaying the lead form
- Opening after CTA click
- Allowing users to close the modal

## LeadForm

Responsible for:

- Managing form state
- Sending the API request
- Handling validation errors
- Completing the conversion after a successful insert
- Redirecting to `/thank-you`

## API Route

Responsible for:

- Validating incoming requests
- Sanitizing input
- Calling the service layer
- Returning success or validation errors

## Lead Service

Responsible for:

- Database operations only
- Keeping SQL separate from API logic

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

The conversion stored in `sessionStorage` moves through three states.

### After CTA click

```text
started = true
completed = false
fired = false
```

### After successful lead creation

```text
started = true
completed = true
fired = false
```

### After generate_lead

```text
started = true
completed = true
fired = true
```

---

# Thank You Page

The thank-you page verifies that:

- A conversion exists
- It has been completed
- It has not already fired

If any check fails, the user is redirected back to the homepage.

Otherwise:

```text
Track generate_lead
        │
        ▼
consumeConversion()
```

This guarantees a single `generate_lead` event per completed conversion.

---

# User Scenarios

### Successful Conversion

```text
Click Get Started
        │
Open modal
        │
Submit valid form
        │
Lead stored
        │
Redirect /thank-you
        │
generate_lead
```

### Invalid Submission

```text
Submit invalid form
        │
Validation fails
        │
400 response
        │
No database row
        │
No generate_lead
```

### Close Modal

```text
Click Get Started
        │
Conversion starts
        │
Close modal
        │
No lead created
        │
Conversion expires after 30 minutes
```

### Refresh Thank You Page

```text
First visit
        │
generate_lead sent
        │
Refresh
        │
Redirect home
        │
No duplicate conversion
```

### Direct Visit to /thank-you

```text
No active conversion
        │
Redirect home
```

---

# Summary

Phase 2 introduces a complete lead generation pipeline:

- CTA click starts a conversion journey.
- A modal collects lead information.
- `/api/leads` validates every request.
- `services/leads.ts` persists valid leads in Neon PostgreSQL.
- `completeConversion()` is called only after a successful database insert.
- `/thank-you` is the conversion checkpoint.
- `generate_lead` fires exactly once for each completed conversion.
- Duplicate conversions are prevented through session-based state management.
