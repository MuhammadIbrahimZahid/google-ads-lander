# Conversion Journey Flow

This document explains the complete conversion journey implemented in **Phase 1** of the project, including the execution flow, storage behavior, and every important user scenario.

---

# Purpose

The goal of this system is to ensure that:

- Only legitimate conversion journeys generate a `generate_lead` event.
- Duplicate lead conversions are prevented.
- CTA clicks are measured separately from completed conversions.
- Google Analytics receives clean and reliable conversion data.

The tracking system consists of two independent mechanisms:

1. **Conversion Journey Tracking**
   - Uses `sessionStorage`
   - Determines whether a conversion is valid
   - Prevents duplicate `generate_lead` events

2. **CTA Click Tracking**
   - Uses `localStorage`
   - Ensures the hero CTA click is only tracked once per browser

Although both involve tracking, they solve different problems.

---

# High-Level Flow

```text
User visits landing page
        │
        ▼
Landing page renders
        │
        ▼
User clicks "Get Started"
        │
        ▼
ensureConversion()
        │
        ▼
Create or reuse conversion
(sessionStorage)
        │
        ▼
Check hero CTA tracking
(localStorage)
        │
        ▼
Track hero_cta_click (if needed)
        │
        ▼
Navigate to /thank-you
        │
        ▼
Validate conversion
        │
        ▼
Track generate_lead
        │
        ▼
Mark conversion as fired
        │
        ▼
Future duplicate conversions prevented
```

---

# Landing Page Flow

The landing page (`src/app/page.tsx`) is responsible for starting a conversion journey.

When the user clicks the **Get Started** button:

```text
Click
 │
 ▼
handleClick()
```

`handleClick()` performs three steps in order:

```text
1. ensureConversion()

2. Track hero_cta_click (if not already tracked)

3. Navigate to /thank-you
```

---

# Step 1 — ensureConversion()

Purpose:

Ensure a valid conversion exists before leaving the landing page.

The function checks:

```text
Does a conversion already exist?

        │
        ├── Yes
        │      │
        │      ▼
        │  Has it expired?
        │      │
        │      ├── No → Reuse it
        │      │
        │      └── Yes → Create a new conversion
        │
        └── No
               │
               ▼
        Create new conversion
```

A conversion object looks like:

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "allowed": true,
  "fired": false,
  "createdAt": 1750000000
}
```

This object is stored in `sessionStorage`.

---

# Step 2 — Hero CTA Tracking

After ensuring a conversion exists, the application checks:

```text
Has this browser already tracked the hero CTA?
```

This is done using:

```text
localStorage
```

If the key does not exist:

```text
Track hero_cta_click

↓

Save:

hero_click_fired = "1"
```

If the key already exists:

```text
Skip hero_cta_click
```

The CTA click and the conversion are intentionally tracked independently.

---

# Step 3 — Navigate

The browser navigates to:

```text
/thank-you
```

At this point, no lead conversion has been recorded yet.

Only the conversion journey has started.

---

# Thank You Page Flow

The thank-you page determines whether a lead conversion is valid.

Flow:

```text
Load page
      │
      ▼
canConvert()
      │
      ├── false
      │       │
      │       ▼
      │   Redirect home
      │
      └── true
              │
              ▼
getConversion()
              │
              ▼
Already fired?
              │
      ├── Yes
      │       │
      │       ▼
      │   Redirect home
      │
      └── No
              │
              ▼
Track generate_lead
              │
              ▼
consumeConversion()
```

---

# Sending generate_lead

When the conversion is valid, the application sends:

```text
generate_lead
```

Example:

```ts
trackGenerateLead({
  lead_source: "landing_page",
  event_id: conversion.eventId,
});
```

Google Analytics receives:

```text
generate_lead
```

along with:

- lead_source
- event_id

---

# consumeConversion()

Immediately after sending the lead event:

```text
fired = true
```

The conversion object changes from:

```json
{
  "fired": false
}
```

to:

```json
{
  "fired": true
}
```

This prevents another `generate_lead` from being sent for the same conversion.

---

# Why sessionStorage?

The conversion journey belongs to the current browser tab.

It should disappear when that browsing session ends.

`sessionStorage` provides exactly that behavior.

It stores:

```text
eventId
allowed
fired
createdAt
```

This storage controls whether a conversion is valid.

---

# Why localStorage?

The hero CTA click represents browser-level behavior.

We only want to measure that interaction once.

`localStorage` survives:

- refreshes
- browser restarts
- future visits

It stores:

```text
hero_click_fired = "1"
```

This storage controls whether the CTA click has already been tracked.

---

# Relationship Between Both Storages

```text
sessionStorage
──────────────

Tracks:

"Can this browser tab complete
a conversion?"



localStorage
────────────

Tracks:

"Has this browser already
recorded a hero CTA click?"
```

These are separate responsibilities.

---

# Complete Conversion Pipeline

```text
User
 │
 ▼
Landing Page
 │
 ▼
Click Get Started
 │
 ▼
ensureConversion()
 │
 ▼
sessionStorage
 │
 ▼
Track hero_cta_click (once)
 │
 ▼
localStorage updated
 │
 ▼
Navigate
 │
 ▼
/thank-you
 │
 ▼
Validate conversion
 │
 ▼
Track generate_lead
 │
 ▼
Google Analytics
 │
 ▼
consumeConversion()
 │
 ▼
Conversion completed
```

---

# User Scenarios

## Scenario 1 — First Visit

Storage before:

```text
sessionStorage
(empty)

localStorage
(empty)
```

Result:

- New conversion created
- hero_cta_click tracked
- generate_lead tracked
- Conversion marked as fired

---

## Scenario 2 — User Clicks CTA Again

Storage:

```text
sessionStorage
conversion exists

localStorage
hero_click_fired = 1
```

Result:

- Existing conversion reused (if still valid)
- hero_cta_click not tracked again
- User reaches thank-you page
- If the existing conversion has already been fired, no second `generate_lead` is sent

---

## Scenario 3 — Refresh Landing Page

Refreshing recreates the React component.

Storage remains.

Clicking again:

- Existing conversion is reused (if valid)
- hero_cta_click is skipped
- User continues to the thank-you page

---

## Scenario 4 — Refresh Thank You Page

The first visit sends:

```text
generate_lead
```

and marks:

```text
fired = true
```

Refreshing the page:

```text
conversion.fired == true
```

Result:

```text
Redirect home

No second generate_lead
```

---

## Scenario 5 — Direct Visit to /thank-you

Example:

```text
User types:

/thank-you
```

Storage:

```text
sessionStorage
(empty)
```

Result:

```text
canConvert()

↓

false

↓

Redirect home
```

Why?

Without a conversion record, the application has no evidence that the user actually completed the intended journey.

Allowing `generate_lead` here would create false conversions.

---

## Scenario 6 — Conversion Expires

Suppose the user clicks the CTA but never reaches the thank-you page.

Thirty minutes later:

```text
createdAt
```

is older than the configured expiry.

Result:

```text
Conversion removed

↓

User must begin a new conversion journey
```

This prevents stale conversion records from being reused indefinitely.

---

## Scenario 7 — Open a New Tab

A new tab gets its own:

```text
sessionStorage
```

Therefore:

```text
Tab A

eventId = abc



Tab B

eventId = xyz
```

Each tab has its own conversion journey.

However:

```text
localStorage
```

is shared.

Therefore:

```text
hero_cta_click
```

is still tracked only once across both tabs.

---

## Scenario 8 — Google Analytics Unavailable

Events are sent using:

```ts
window.gtag?.(...)
```

Because optional chaining is used:

```text
window.gtag?.()
```

If Google Analytics has not loaded:

- No exception is thrown.
- The application continues functioning normally.

---

# Design Principles

The implementation intentionally separates concerns.

**Landing Page**

Responsible for:

- Starting a conversion journey
- Tracking CTA interaction
- Navigation

---

**session.ts**

Responsible for:

- Creating conversions
- Reading conversions
- Validating conversions
- Expiry handling
- Duplicate prevention

---

**tracking.ts**

Responsible only for browser-level CTA tracking.

---

**analytics.ts**

Responsible only for sending analytics events.

It does not know:

- where events originated
- how conversions are stored
- how duplicate prevention works

---

# Final Mental Model

Think of the conversion object as a temporary ticket.

```text
Landing Page

↓

Issue ticket

↓

Navigate

↓

Present ticket

↓

Ticket accepted?

↓

Yes

↓

generate_lead

↓

Ticket marked as used
```

If someone attempts to reach the thank-you page without first receiving a ticket:

```text
No ticket

↓

No valid conversion

↓

Redirect home
```

This simple flow ensures that only genuine conversion journeys produce a `generate_lead` event while preventing duplicate conversions and keeping analytics data clean.
