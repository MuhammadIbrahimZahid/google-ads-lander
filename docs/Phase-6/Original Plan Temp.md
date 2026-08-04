## Phase 6 — CRM Lifecycle Tracking Implementation Plan

Based on the current architecture and the Phase boundaries we agreed on, Phase 6 will **not** become a server-side conversion delivery system.

The objective:

> **Create reliable CRM-originated business events that can later feed Phase 7 offline conversion processing and Phase 11 server-side tracking architecture.**

Your current Google Ads / GA4 / GTM foundation is already in a good state. Phase 6 should extend it without breaking the existing browser tracking flow.

---

# Phase 6 Architecture

## Current State

```
Browser
   |
   |
dataLayer.push()
   |
   |
GTM
   |
   ├── GA4 generate_lead
   |
   ├── Google Ads Conversion
   |
   └── Enhanced Conversion
```

This remains.

---

# Phase 6 Target State

```
User submits form

        |
        v

Next.js API

        |
        v

Database Transaction

        |
        |
        +----------------+
        |                |
        v                v

leads table       lifecycle_events


        |
        v

Admin CRM


        |
        v

Status Change


        |
        v


lead_status_history


        |
        v


Browser Event Delivery
(GA4/GTM Testing)


```

---

# Phase 6 Goals

## 1. Database becomes lifecycle source of truth

The database should know:

- Lead created
- Lead contacted
- Lead qualified
- Lead status changed
- Who changed it
- When it changed
- Why it changed

---

## 2. Every business action creates an event record

Example:

Lead submitted:

```
lifecycle_events

id
event_id
lead_id
event_name
created_at
metadata
```

Record:

```json
{
  "event_name": "lead_created",
  "lead_id": 123,
  "event_id": "077313d2-8c75-481d-9765-d9ec89aedea3"
}
```

---

Later Phase 7:

```
lifecycle_events

        |
        v

Offline Conversion Processor

        |
        v

Google Ads Offline Conversion Import

```

---

# Phase 6 Database Changes

Current:

```
leads
```

Add:

---

# 1. lead_status_history

Purpose:

Track every status movement.

Migration:

```sql
CREATE TABLE public.lead_status_history (

    id BIGSERIAL PRIMARY KEY,

    lead_id BIGINT NOT NULL
        REFERENCES public.leads(id)
        ON DELETE CASCADE,

    previous_status TEXT,

    new_status TEXT NOT NULL,

    changed_by TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);
```

Example:

```
Lead #25


new
 |
 |
Contacted
 |
 |
Qualified


history:


new -> contacted
contacted -> qualified

```

---

# 2. lifecycle_events

Purpose:

Immutable business events.

Migration:

```sql
CREATE TABLE public.lifecycle_events (

    id BIGSERIAL PRIMARY KEY,

    event_id UUID NOT NULL UNIQUE,

    lead_id BIGINT NOT NULL
        REFERENCES public.leads(id)
        ON DELETE CASCADE,


    event_name TEXT NOT NULL,


    metadata JSONB DEFAULT '{}',


    created_at TIMESTAMPTZ DEFAULT NOW()

);
```

Important:

```
event_id UNIQUE
```

prevents duplicate lifecycle events.

---

# Phase 6 Lead Creation Flow

Current:

```
LeadForm

 |
 |
POST /api/leads

 |
 |
createLead()

 |
 |
INSERT leads

```

Change to:

```
POST /api/leads


        |
        v


Database Transaction


        |
        +----------------+
        |                |
        v                v


INSERT leads       INSERT lifecycle_events


```

---

Example:

Lead creation creates:

## leads

```
id:
101

status:
new

event_id:
077313d2...
```

---

## lifecycle_events

```
event_id:
077313d2...

event_name:
lead_created

lead_id:
101

```

---

# Phase 6 Service Layer Changes

Current:

```
services/leads.ts
```

becomes:

```
services/

├── leads.ts

├── leadLifecycle.ts

├── lifecycleEvents.ts

```

---

## New responsibility

### leads.ts

Only:

```
create lead
update lead
get lead

```

---

### leadLifecycle.ts

Handles:

```
changeLeadStatus()

```

Example:

```ts
changeLeadStatus(leadId, "qualified");
```

Internally:

Transaction:

```
BEGIN


get current status


UPDATE leads


INSERT lead_status_history


INSERT lifecycle_event


COMMIT

```

---

# Admin CRM

Phase 6 introduces:

```
/admin/leads
```

---

## First Version

Simple.

No authentication yet.

Purpose:

Testing lifecycle.

---

UI:

```
Lead ID

Name

Email

Status


[New]
[Contacted]
[Qualified]

```

---

Changing status:

Example:

```
new

button:
Mark contacted


```

creates:

lead_status_history:

```
new
 ->
contacted

```

lifecycle_events:

```
lead_contacted

```

---

# Lifecycle Event Naming

Keep naming future-compatible.

Use:

```
lead_created

lead_contacted

lead_qualified

lead_disqualified

lead_reopened

```

Avoid:

```
button_clicked
crm_update
status_change1

```

because Phase 7 needs meaningful business events.

---

# GA4 / GTM Alignment

Important:

Phase 6 does **not** replace your current GTM conversion flow.

Current:

```
generate_lead
        |
        |
GA4 Key Event
        |
        |
Google Ads Primary Conversion

```

Keep unchanged.

---

## Add CRM events separately

Example:

Admin marks:

```
Lead #101

new
 |
qualified

```

Browser sends:

```javascript
dataLayer.push({
  event: "lead_qualified",

  lead_id: 101,

  event_id: uuid,
});
```

---

GTM can later create:

GA4 event:

```
lead_qualified

```

but during Phase 6:

GA4 is mainly for validation/testing.

---

# GTM Changes

Add:

## New GA4 Event Tags

Currently:

```
GA4 Event - generate_lead

GA4 Event - hero_cta_click

```

Add:

```
GA4 Event - lead_created

GA4 Event - lead_contacted

GA4 Event - lead_qualified

```

---

Triggers:

Custom Events:

```
CE - lead_created


CE - lead_contacted


CE - lead_qualified

```

---

Parameters:

Example:

```
lead_id

event_id

previous_status

new_status

```

---

# Google Ads Alignment

Current:

Primary conversion:

```
Lead Submitted - Website

Source:
Website

Managed through GTM

```

Keep.

Do not create:

```
qualified_lead
```

Google Ads conversion yet.

Reason:

Phase 6 only creates the CRM data.

Phase 7 decides:

```
qualified_lead

↓

Offline conversion import

```

---

# Enhanced Conversion Alignment

Current setup:

```
Google Ads User Provided Data Event

+
Lead Submitted - Website

```

Keep.

No change.

Your current flow:

```
lead submission

↓

hashed identity

↓

GTM

↓

Google Ads enhanced conversion

```

is correct.

---

# Duplicate Prevention Strategy

Phase 6 introduces three layers.

## Browser

Existing:

```
conversion.eventId

```

Keep.

---

## Database

Add:

```
lifecycle_events.event_id UNIQUE

```

---

## Status updates

Prevent:

```
qualified
      |
      |
qualified

```

creating duplicate history.

Logic:

```
if oldStatus === newStatus

return

```

---

# Phase 6 File Structure Target

Current:

```
src

├── app
│
├── components
│
├── lib
│
├── services
│
└── types

```

After Phase 6:

```
src

├── app

│   ├── api
│   │
│   │   ├── leads
│   │   │
│   │   └── admin
│   │
│   └── admin
│       └── leads


├── services

│   ├── leads.ts
│   ├── lifecycleEvents.ts
│   └── leadLifecycle.ts


├── types

│   ├── lead.ts
│   ├── lifecycle.ts


```

---

# Phase 6 Implementation Order

## Step 1 — Database Foundation

Create:

- lead_status_history
- lifecycle_events

Verify:

```
INSERT works

foreign keys work

unique event_id works

```

---

## Step 2 — Refactor Lead Creation

Move from:

```
INSERT leads

```

to:

```
transaction:

INSERT lead

INSERT lifecycle_event

```

---

## Step 3 — Build Lifecycle Service

Implement:

```
changeLeadStatus()

```

with:

- transaction
- history creation
- event creation

---

## Step 4 — Build Admin Leads Page

Create:

```
/admin/leads

```

Features:

- list leads
- view status
- change status

---

## Step 5 — Browser Lifecycle Events

Add:

```
pushToDataLayer()

```

for:

```
lead_created

lead_contacted

lead_qualified

```

---

## Step 6 — GTM Validation

Test:

Browser:

```
dataLayer
 |
GTM Preview
 |
GA4 DebugView

```

Confirm:

```
lead_created

lead_qualified

```

arrive.

---

## Step 7 — Google Ads Verification

Confirm existing:

```
generate_lead

↓

Lead Submitted - Website

↓

Primary conversion

```

still works.

No campaign required.

No ad spend required.

---

# Phase 6 Completion Criteria

Phase 6 is complete when:

✅ Every lead creates a lifecycle event
✅ Every status change creates history
✅ Duplicate lifecycle events are blocked
✅ Admin can move leads through lifecycle
✅ GA4/GTM can observe lifecycle events
✅ Existing Google Ads conversion remains unchanged
✅ Database contains future offline conversion data

---

This keeps Phase 6 exactly where it belongs:

**CRM lifecycle foundation now → offline conversion infrastructure later.**
