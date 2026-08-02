# Google Ads Conversion & Enhanced Conversions Flow

This document describes the complete Google Ads conversion tracking implementation completed in **Phase 5**, including Google Ads conversion actions, Google Tag Manager Google Ads tags, Enhanced Conversions implementation, User-Provided Data delivery, identity hashing, and end-to-end conversion validation.

Phase 5 extends the Phase 4 analytics pipeline by introducing an advertising measurement layer.

The objective is to connect completed lead conversions with Google Ads measurement while maintaining the same event architecture used by GA4.

---

# Purpose

Phase 5 focuses on extending the conversion journey from analytics measurement into advertising attribution.

The objective is to ensure every valid lead conversion can be delivered through:

- Application conversion lifecycle
- Customer identity normalization
- SHA-256 hashing
- Browser dataLayer
- Google Tag Manager
- Google Ads Conversion Tracking
- Google Ads User-Provided Data Event
- Enhanced Conversion processing

The final pipeline connects:

```
User Interaction
        │
        ▼
Next.js Application
        │
        ▼
Lead Submission
        │
        ▼
Conversion Event Creation
        │
        ▼
Identity Normalization
        │
        ▼
SHA-256 Hashing
        │
        ▼
window.dataLayer
        │
        ▼
Google Tag Manager
        │
        ├───────────────┐
        │               │
        ▼               ▼
      GA4             Google Ads
   generate_lead   Conversion Tracking
                        │
                        ▼
              Enhanced Conversions
```

---

# Phase 5 Goals

Phase 5 introduces:

- Google Ads conversion action
- Google Ads conversion tracking tag
- Google Ads base tag
- Conversion Linker
- Enhanced Conversion configuration
- User-Provided Data Event tag
- Hashed customer identity delivery
- Google Ads measurement validation

The final system supports:

- Google Ads conversion measurement
- Enhanced conversion matching
- Future offline conversion workflows
- Future CRM attribution workflows

---

# Conversion Journey

```
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
track hero_cta_click
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
Lead saved in Neon PostgreSQL
        │
        ▼
completeConversion()
        │
        ▼
Save lead identity
        │
        ▼
Redirect /thank-you
        │
        ▼
Validate conversion state
        │
        ▼
Build Enhanced Conversion Payload
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
        ├───────────────┐
        │               │
        ▼               ▼
GA4 Event          Google Ads Conversion
generate_lead      Lead Submitted - Website

                        │
                        ▼

              Google Ads User Data Event

```

---

# Architecture

```
Landing Page
      │
      ▼
Attribution Capture
(sessionStorage)
      │
      ▼
Conversion State
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
Lead Identity Storage
      │
      ▼
Enhanced Conversion Builder
      │
      ▼
SHA-256 Hashing
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
      ├───────────────┐
      │               │
      ▼               ▼
GA4              Google Ads
                 Conversion Tracking
                       │
                       ▼
              Enhanced Conversions

```

---

# Enhanced Conversion Architecture

Phase 5 introduces customer identity processing.

The flow:

```
Raw Lead Data

(email)
(phone)
(first name)
(last name)
(country)
(postal code)

        │

        ▼

Normalization

normalizeEmail()
normalizePhone()
normalizePersonName()

        │

        ▼

SHA-256 Hashing

hashSHA256()

        │

        ▼

Enhanced Conversion Payload

        │

        ▼

GTM User-Provided Data

        │

        ▼

Google Ads
```

Google Enhanced Conversions uses hashed first-party customer data to improve conversion measurement and matching. :contentReference[oaicite:1]{index=1}

---

# Enhanced Conversion Payload

Example:

```json
{
  "sha256_email_address": "hashed_email",
  "sha256_phone_number": "hashed_phone",
  "address": {
    "sha256_first_name": "hashed_first_name",
    "sha256_last_name": "hashed_last_name",
    "country": "PK",
    "postal_code": "76000"
  }
}
```

---

# Application Files Added / Updated

Phase 5 extends the existing Phase 4 structure.

## Enhanced Conversion Builder

File:

```
src/lib/enhancedConversions.ts
```

Responsibilities:

- Normalize customer data
- Hash identity fields
- Create GTM-compatible payload

---

## Identity Storage

File:

```
src/lib/leadIdentity.ts
```

Responsibilities:

- Temporarily store lead identity
- Provide data for Enhanced Conversion generation
- Remove identity after conversion tracking

---

## Lead Form

File:

```
src/components/LeadForm.tsx
```

Responsibilities:

After successful lead creation:

```
saveLeadIdentity()
        │
        ▼
completeConversion()
        │
        ▼
redirect /thank-you
```

---

## Thank You Page

File:

```
src/app/thank-you/page.tsx
```

Responsibilities:

```
Validate conversion state

        │

Build Enhanced Conversion payload

        │

Send generate_lead event

        │

Push user_data into dataLayer

        │

Cleanup identity storage

```

---

# Google Tag Manager Configuration

Phase 5 GTM configuration:

---

# Google Tags

## Google Tag - GA4

Configuration:

```
Tag Type:

Google Tag


Tag ID:

G-1ZCMGK2M6Y


Trigger:

Initialization - All Pages

```

Purpose:

Loads GA4 globally.

---

## Google Tag - Google Ads

Configuration:

```
Tag Type:

Google Tag


Tag ID:

AW-18206350368


Trigger:

Initialization - All Pages

```

Purpose:

Loads Google Ads measurement.

---

# Conversion Linker

Configuration:

```
Tag Type:

Conversion Linker


Trigger:

All Pages

```

Purpose:

Stores Google Ads click identifiers.

---

# Google Ads Conversion Tag

Tag:

```
Lead Submitted - Website
```

Configuration:

```
Tag Type:

Google Ads Conversion Tracking


Conversion ID:

18206350368


Conversion Label:

Z0T8CK3Y6docEKC4u-lD


Trigger:

CE - generate_lead

```

Purpose:

Sends completed lead conversions to Google Ads.

---

# Google Ads User-Provided Data Event

Tag:

```
Google Ads - User Data
```

Configuration:

```
Tag Type:

Google Ads User-Provided Data Event


Conversion ID:

18206350368


User Provided Data:

{{UPD - Lead Data}}


Trigger:

CE - generate_lead

```

Purpose:

Sends enhanced conversion identity signals.

Google recommends connecting the User-Provided Data Event tag with the same conversion ID and conversion flow used for the conversion action. :contentReference[oaicite:2]{index=2}

---

# Data Layer Structure

Phase 5 extends the Phase 4 dataLayer payload.

Example:

```javascript
window.dataLayer.push({
  event: "generate_lead",

  lead_source: "landing_page",

  event_id: "conversion-id",

  user_data: {
    sha256_email_address: "hash",
    sha256_phone_number: "hash",

    address: {
      sha256_first_name: "hash",
      sha256_last_name: "hash",
      country: "PK",
      postal_code: "76000",
    },
  },
});
```

---

# GTM Variables

## DLV - lead_source

Purpose:

GA4 parameter delivery.

---

## DLV - event_id

Purpose:

Maintains conversion identity across:

```
Frontend
Database
GA4
Google Ads
```

---

## DLV - user_data

Purpose:

Provides Enhanced Conversion payload.

---

## UPD - Lead Data

Type:

```
User-Provided Data
```

Source:

```
DLV - user_data
```

Purpose:

Maps customer identity data into Google Ads.

---

# Validation

Phase 5 validation confirmed:

## Application

Confirmed:

```
Lead submitted successfully

        │

Lead saved in database

        │

event_id generated

```

---

## Neon Database

Confirmed stored:

```
first_name
last_name
email
phone
country
postal_code
event_id
device
landing_page
```

---

## GTM Preview

Confirmed:

```
generate_lead

        │

        ├── GA4 Event - generate_lead

        ├── Google Ads User Data

        └── Lead Submitted - Website

```

All tags fired successfully.

---

# GA4 Validation

Confirmed:

```
Event:

generate_lead


Parameters:

event_id
lead_source
debug_mode

```

---

# Google Ads Validation

Confirmed:

Google Ads conversion tag:

```
Lead Submitted - Website

Conversion ID:

18206350368


Conversion Label:

Z0T8CK3Y6docEKC4u-lD

```

Tag firing confirmed through GTM Preview.

---

# Important Attribution Note

Google Ads conversion reporting requires an eligible advertising interaction for attribution.

A development test without a real Google Ads click may successfully fire the conversion tag but will not necessarily appear as an attributed Google Ads conversion.

Example:

Development Test:

```
Website
   │
   ▼
generate_lead
   │
   ▼
Google Ads Tag

```

Production Attribution:

```
Google Ads Click

        │

        ▼

gclid

        │

        ▼

Website

        │

        ▼

Lead Submission

        │

        ▼

Google Ads Conversion

```

---

# Conversion Lifecycle

Before Lead Submission:

```
started = true

completed = false

fired = false

```

---

After Successful Lead Creation:

```
started = true

completed = true

fired = false

```

---

After Analytics Dispatch:

```
started = true

completed = true

fired = true

```

---

# Final Architecture

The complete Phase 5 measurement system:

```
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

Identity Normalization

 |

 |

SHA256 Hashing

 |

 |

dataLayer

 |

 |

Google Tag Manager

 |

 |

+-----------------------+

| GA4                   |

| generate_lead         |

+-----------------------+

        |

        |

+-----------------------+

| Google Ads            |

| Conversion Tracking   |

+-----------------------+

        |

        |

+-----------------------+

| Enhanced Conversions  |

| User Provided Data    |

+-----------------------+

```

---

# Summary

Phase 5 completes the advertising measurement layer.

Implemented:

- Google Ads conversion action
- Google Ads conversion tracking tag
- Google Ads base tag
- Conversion Linker
- Enhanced Conversion architecture
- User-provided data delivery
- SHA-256 identity hashing
- GTM validation
- GA4 and Google Ads event alignment

Phase 4 established the analytics foundation.

Phase 5 connects that foundation to advertising measurement.

The final separation is:

```
Phase 3
Conversion Engine

Phase 4
Analytics Layer

Phase 5
Advertising Measurement Layer
```

This architecture provides the foundation required for future:

- Offline conversion imports
- CRM attribution
- Server-side tracking
- Revenue attribution
- ROAS optimization
