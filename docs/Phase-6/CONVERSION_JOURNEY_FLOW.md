# Lead Lifecycle Analytics Flow

This document describes the complete **Phase 6 Lead Lifecycle Analytics implementation**, including application lifecycle events, Google Tag Manager event routing, GA4 lifecycle measurement, data layer expansion, and end-to-end validation.

Phase 6 extends the Phase 5 advertising measurement pipeline by introducing post-conversion lead lifecycle tracking.

The objective is to measure what happens **after a lead is generated**:

- Lead contacted
- Lead qualified
- Lead disqualified

The final system connects CRM-style lead progression events with GA4 analytics measurement while preserving the existing conversion architecture.

---

# Purpose

Phase 6 focuses on extending measurement beyond the initial lead submission.

Phase 5 answered:

```
Did a user become a lead?
```

Phase 6 answers:

```
What happened to that lead after submission?
```

The objective is to connect:

- Lead status changes
- Application events
- Browser dataLayer
- Google Tag Manager
- GA4 lifecycle events

The final pipeline:

```
Lead Created
      |
      v
Database Status Change
      |
      v
Application Lifecycle Event
      |
      v
window.dataLayer
      |
      v
Google Tag Manager
      |
      v
GA4 Lifecycle Event
```

---

# Phase 6 Goals

Phase 6 introduces:

- Lead lifecycle event architecture
- Status change tracking
- GTM custom event routing
- Dynamic GA4 lifecycle events
- Lifecycle event parameters
- Funnel measurement after conversion

The final system supports:

- Lead quality analysis
- Sales pipeline visibility
- Conversion funnel optimization
- CRM-style reporting
- Future offline attribution workflows

---

# Lifecycle Journey

Before Phase 6:

```
User
 |
 v
Lead Form
 |
 v
generate_lead
 |
 v
Google Ads Conversion
 |
 v
Lead Stored
```

After Phase 6:

```
User
 |
 v
Lead Form
 |
 v
generate_lead
 |
 v
Lead Stored
 |
 v
Status Changes
 |
 +----------------+
 |                |
 v                v
contacted      qualified
 |
 v
disqualified
 |
 v
GA4 Lifecycle Analytics
```

---

# Lead Lifecycle Events

Phase 6 introduces three lifecycle events.

---

## lead_contacted

Triggered when:

```
Lead Status:

new
 ↓
contacted
```

Example:

```javascript
window.dataLayer.push({
  event: "lead_contacted",
  event_id: "uuid",
  lead_id: "90",
  previous_status: "new",
  new_status: "contacted",
});
```

---

## lead_qualified

Triggered when:

```
Lead Status:

contacted
 ↓
qualified
```

Example:

```javascript
window.dataLayer.push({
  event: "lead_qualified",
  event_id: "uuid",
  lead_id: "90",
  previous_status: "contacted",
  new_status: "qualified",
});
```

---

## lead_disqualified

Triggered when:

```
Lead Status:

qualified
 ↓
disqualified
```

Example:

```javascript
window.dataLayer.push({
  event: "lead_disqualified",
  event_id: "uuid",
  lead_id: "90",
  previous_status: "qualified",
  new_status: "disqualified",
});
```

---

# Architecture

Phase 6 extends the existing Phase 5 architecture.

```
Admin Dashboard
        |
        v
Lead Status Update
        |
        v
API Route
        |
        v
Database Update
        |
        v
Lifecycle Event Creation
        |
        v
window.dataLayer
        |
        v
Google Tag Manager
        |
        v
GA4 Event
```

---

# Application Implementation

Phase 6 adds lifecycle tracking after lead creation.

The status update flow:

```
Admin User
    |
    v
Change Lead Status
    |
    v
PATCH /api/leads/[id]/status
    |
    v
Update Database
    |
    v
Determine Previous Status
    |
    v
Determine New Status
    |
    v
Push Lifecycle Event
```

---

# Data Layer Structure

Phase 6 extends the existing dataLayer implementation.

Example:

```javascript
window.dataLayer.push({
  event: "lead_qualified",

  event_id: "02d82d51-29ea-409d-9966-2b33ea858e9f",

  lead_id: "90",

  previous_status: "contacted",

  new_status: "qualified",
});
```

---

# Google Tag Manager Configuration

Phase 6 GTM configuration:

---

# Data Layer Variables

The following variables were created.

---

## DLV - event_id

Type:

```
Data Layer Variable
```

Data Layer Variable Name:

```
event_id
```

Purpose:

Maintains lifecycle event identity.

---

## DLV - lead_id

Type:

```
Data Layer Variable
```

Data Layer Variable Name:

```
lead_id
```

Purpose:

Identifies the affected lead.

---

## DLV - previous_status

Type:

```
Data Layer Variable
```

Data Layer Variable Name:

```
previous_status
```

Purpose:

Tracks the previous lead state.

---

## DLV - new_status

Type:

```
Data Layer Variable
```

Data Layer Variable Name:

```
new_status
```

Purpose:

Tracks the new lead state.

---

# Custom Event Trigger

Trigger:

```
CE - Lead Lifecycle
```

Configuration:

```
Trigger Type:

Custom Event


Event Name:

lead_.*
```

Regex matching:

```
Enabled
```

Purpose:

One trigger handles all lifecycle events:

```
lead_contacted

lead_qualified

lead_disqualified
```

---

# GA4 Lifecycle Event Tag

Tag:

```
GA4 Event - Lead Lifecycle
```

Configuration:

```
Tag Type:

Google Analytics: GA4 Event


Measurement ID:

G-1ZCMGK2M6Y
```

---

## Event Name

Dynamic event naming:

```
{{Event}}
```

Purpose:

Allows GTM to automatically forward:

```
lead_contacted

lead_qualified

lead_disqualified
```

without creating separate tags.

---

## Event Parameters

Configured parameters:

| Parameter       | Value                     |
| --------------- | ------------------------- |
| event_id        | {{DLV - event_id}}        |
| lead_id         | {{DLV - lead_id}}         |
| previous_status | {{DLV - previous_status}} |
| new_status      | {{DLV - new_status}}      |

---

# Validation

Phase 6 validation confirmed:

---

# Application Validation

Confirmed:

```
Lead Status Updated

        |

Lifecycle Event Created

        |

dataLayer.push()

```

---

# GTM Preview Validation

Confirmed:

Example:

```
lead_qualified
```

Received:

```json
{
  "event": "lead_qualified",
  "event_id": "02d82d51-29ea-409d-9966-2b33ea858e9f",
  "lead_id": "90",
  "previous_status": "contacted",
  "new_status": "qualified"
}
```

---

# GTM Tag Validation

Confirmed:

```
Tags Fired

GA4 Event - Lead Lifecycle
```

For:

```
lead_contacted

lead_qualified

lead_disqualified
```

---

# GA4 DebugView Validation

Confirmed lifecycle events appear:

Example:

```
lead_qualified
```

Parameters:

```
event_id

lead_id

previous_status

new_status
```

---

# Realtime Validation

Confirmed:

GA4 Realtime reports lifecycle events:

```
Event Name

lead_contacted

lead_qualified

lead_disqualified
```

---

# Complete Funnel

After Phase 6:

```
hero_cta_click
        |
        v
generate_lead
        |
        v
lead_contacted
        |
        v
lead_qualified
        |
        v
lead_disqualified
```

This provides visibility from:

```
Initial user intent

        ↓

Lead creation

        ↓

Sales follow-up

        ↓

Lead quality outcome
```

---

# Final Architecture

The complete measurement system:

```
User

 |

Next.js Application

 |

Conversion Engine

 |

Lead Database

 |

Google Tag Manager

 |

+----------------------+

| GA4                  |

|                      |

| generate_lead        |

| lead_contacted       |

| lead_qualified       |

| lead_disqualified    |

+----------------------+

 |

Google Ads

 |

Enhanced Conversions
```

---

# Summary

Phase 6 completes the lead lifecycle analytics layer.

Implemented:

- Lead status lifecycle tracking
- Custom lifecycle dataLayer events
- GTM custom event routing
- Dynamic GA4 lifecycle event tag
- Lifecycle event parameters
- GTM Preview validation
- GA4 DebugView validation
- Realtime event validation

The final separation:

```
Phase 3

Conversion Engine


Phase 4

Analytics Layer


Phase 5

Advertising Measurement Layer


Phase 6

Lead Lifecycle Analytics Layer
```

This architecture provides the foundation for future:

- CRM synchronization
- Sales pipeline analytics
- Lead scoring
- Revenue attribution
- Offline conversion imports
- Closed-loop advertising optimization

```

```
