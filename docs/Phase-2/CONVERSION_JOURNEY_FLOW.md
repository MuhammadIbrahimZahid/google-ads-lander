# Conversion Journey Flow

This document explains the complete conversion journey implemented in **Phase 2** of the project, including lead capture, API validation, database persistence, and conversion tracking behavior.

---

# Purpose

Phase 1 focused on creating and validating a browser-based conversion journey.

Phase 2 extends this system by adding:

- Real lead collection
- Server-side API handling
- Request validation
- Input sanitization
- Database persistence
- Neon PostgreSQL integration

The goal:

> Allow only valid users to create leads in the database while keeping conversion tracking accurate and preventing invalid conversions.

The system now has three connected layers:

1. **Conversion Journey Tracking**

Uses:

```

sessionStorage

```

Responsible for:

- Creating conversion sessions
- Validating conversion attempts
- Preventing duplicate `generate_lead` events

2. **Lead Capture System**

Uses:

```

LeadForm.tsx
/api/leads
Neon PostgreSQL

```

Responsible for:

- Collecting user information
- Validating input
- Saving valid leads

3. **Analytics Conversion Tracking**

Uses:

```

Google Analytics 4

```

Responsible for:

- Measuring completed conversions
- Sending `generate_lead`

---

# High-Level Flow

```text
User visits landing page

        │

        ▼

Landing page renders

        │

        ▼

User starts conversion journey

        │

        ▼

ensureConversion()

        │

        ▼

Create conversion record

(sessionStorage)

        │

        ▼

Track hero_cta_click

(localStorage)

        │

        ▼

User enters lead information

        │

        ▼

LeadForm.tsx

        │

        ▼

POST /api/leads

        │

        ▼

Validate request

        │

        ├── Invalid

        │       │

        │       ▼

        │   Return 400

        │   No database row

        │   No conversion completion


        │

        └── Valid

                │

                ▼

        Sanitize input

                │

                ▼

        Create lead

                │

                ▼

        Neon PostgreSQL

                │

                ▼

        Redirect /thank-you

                │

                ▼

        Validate conversion

                │

                ▼

        Send generate_lead

                │

                ▼

        consumeConversion()

                │

                ▼

        Conversion completed
```

---

# Phase 2 Architecture

The application now has a frontend and backend flow.

```text
Browser

↓

React Component

↓

API Request

↓

Next.js Route Handler

↓

Service Layer

↓

Database

↓

Response

↓

Conversion Tracking
```

The API layer uses a Next.js App Router Route Handler:

```
src/app/api/leads/route.ts
```

Route Handlers are implemented using `route.ts` files inside the App Router and support request methods such as `POST`. ([Next.js][1])

---

# Project Responsibilities

## LeadForm.tsx

File:

```
src/components/LeadForm.tsx
```

Responsible for:

- Managing form state
- Collecting user input
- Sending API request
- Handling errors
- Redirecting after success

It does not:

- Validate database rules
- Insert data directly
- Manage database connections

---

# Lead Form Flow

When the user submits the form:

```text
Submit button clicked

        │

        ▼

handleSubmit()

        │

        ▼

ensureConversion()

        │

        ▼

Prepare lead payload

        │

        ▼

POST /api/leads

        │

        ▼

Wait for API response
```

The payload:

```json
{
  "name": "John Smith",
  "email": "john@test.com",
  "phone": "03000000000",
  "landingPage": "/",
  "referrer": ""
}
```

---

# API Endpoint

File:

```
src/app/api/leads/route.ts
```

Purpose:

Receive lead submissions from the browser.

The endpoint:

```
POST /api/leads
```

handles:

- Reading request body
- Validating data
- Calling lead service
- Returning response

---

# POST Request Lifecycle

The API flow:

```text
Request received

        │

        ▼

Parse JSON body

        │

        ▼

Validate required fields

        │

        ▼

Trim input values

        │

        ▼

Create database record

        │

        ▼

Return success response
```

---

# Request Validation

The API validates:

## Name

Required:

```text
name cannot be empty
```

Invalid:

```json
{
  "name": "   "
}
```

Result:

```
400 Bad Request
```

---

## Email

Required:

```text
email must exist
```

Invalid:

```json
{
  "email": ""
}
```

Result:

```
400 Bad Request
```

---

Invalid format:

```json
{
  "email": "abc"
}
```

Result:

```
400 Bad Request
```

---

# Input Sanitization

Before saving:

```text
User Input

↓

Trim whitespace

↓

Store clean data
```

Example:

Input:

```json
{
  "name": "   John Smith   ",
  "phone": " 03000000000 "
}
```

Stored:

```json
{
  "name": "John Smith",
  "phone": "03000000000"
}
```

This prevents unnecessary whitespace from entering the database.

---

# Invalid Request Handling

Invalid requests stop immediately.

Flow:

```text
Invalid payload

↓

Validation fails

↓

Return 400

↓

No database insert

↓

No redirect

↓

No generate_lead
```

Examples:

- Empty name
- Missing email
- Invalid email format

---

# Lead Service Layer

File:

```
src/services/leads.ts
```

Purpose:

Separate database operations from API logic.

The API should not directly manage database queries.

Architecture:

```text
route.ts

↓

services/leads.ts

↓

Database
```

Benefits:

- Cleaner API routes
- Reusable database functions
- Easier future changes

---

# Lead Types

File:

```
src/types/lead.ts
```

Defines the shape of lead data.

Example:

```ts
export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  landingPage?: string;
  referrer?: string;
}
```

Purpose:

Maintain consistency between:

- React components
- API requests
- Database operations

---

# Neon Database Flow

Successful leads are stored in Neon PostgreSQL.

Flow:

```text
Valid Lead

↓

Lead Service

↓

Database Insert

↓

Neon PostgreSQL

↓

Return Created Lead
```

Stored information includes:

```text
id

name

email

phone

landing_page

referrer

tracking fields
```

---

# Relationship Between Lead Creation and Conversion

Lead creation and conversion tracking are separate systems.

Lead creation answers:

> Did the user provide valid information?

Conversion tracking answers:

> Did the user complete a valid conversion journey?

The complete flow:

```text
User submits form

        │

        ▼

Lead saved

        │

        ▼

Redirect /thank-you

        │

        ▼

Conversion validated

        │

        ▼

generate_lead sent
```

A database row alone does not create a conversion.

The thank-you page remains responsible for conversion completion.

---

# Thank You Page Flow

The thank-you page checks:

1. Does conversion exist?
2. Is conversion valid?
3. Has it already fired?

Flow:

```text
Load /thank-you

        │

        ▼

canConvert()

        │

        ├── false

        │

        ▼

Redirect home


        │

        └── true

                │

                ▼

        Check fired status

                │

                ▼

        Track generate_lead

                │

                ▼

        consumeConversion()
```

---

# Complete Phase 2 Conversion Pipeline

```text
User

↓

Landing Page

↓

Click CTA

↓

ensureConversion()

↓

sessionStorage created

↓

hero_cta_click tracked

↓

Lead Form

↓

Submit user information

↓

POST /api/leads

↓

Validate request

↓

Save Neon row

↓

Redirect /thank-you

↓

Validate conversion

↓

generate_lead

↓

Google Analytics

↓

consumeConversion()

↓

Conversion completed
```

---

# User Scenarios

## Scenario 1 — Empty Name

Request:

```json
{
  "name": "   ",
  "email": "test@test.com"
}
```

Result:

```
400 Bad Request
```

Database:

```
No row created
```

Conversion:

```
Not completed
```

---

# Scenario 2 — Missing Email

Request:

```json
{
  "name": "Test User"
}
```

Result:

```
400 Bad Request
```

Database:

```
No row created
```

---

# Scenario 3 — Invalid Email

Request:

```json
{
  "name": "Test User",
  "email": "abc"
}
```

Result:

```
400 Bad Request
```

Database:

```
No row created
```

---

# Scenario 4 — Whitespace Trimming

Request:

```json
{
  "name": "   John Smith   ",
  "email": "trim@test.com"
}
```

Database:

```text
name:

John Smith
```

Result:

```
Successful lead creation
```

---

# Scenario 5 — Successful Submission

Flow:

```text
User fills form

↓

POST /api/leads

↓

Validation passes

↓

Neon row created

↓

Redirect /thank-you

↓

generate_lead fires
```

Result:

```
Lead stored successfully

Conversion recorded
```

---

# Scenario 6 — Refresh Thank You Page

First visit:

```text
generate_lead sent
```

Then:

```json
{
  "fired": true
}
```

Refresh:

```
No duplicate conversion
```

---

# Scenario 7 — Direct Thank You Visit

User opens:

```
/thank-you
```

without submitting a form.

Storage:

```
sessionStorage empty
```

Result:

```
Redirect home
```

Reason:

No valid conversion journey exists.

---

# Design Principles

## Separation of Responsibilities

The system separates:

### Frontend

Responsible for:

- User interaction
- Form collection
- Navigation

### API Layer

Responsible for:

- Validation
- Request handling
- Response formatting

### Service Layer

Responsible for:

- Database operations

### Analytics Layer

Responsible for:

- Sending conversion events

---

# Final Mental Model

Phase 1 created a conversion ticket.

Phase 2 adds a lead record.

The complete system:

```text
User

↓

Start journey

↓

Receive conversion ticket

↓

Submit information

↓

Create lead record

↓

Present conversion ticket

↓

Ticket accepted

↓

generate_lead

↓

Google Analytics
```

The database proves:

```
A user provided valid information
```

The conversion system proves:

```
The user completed a valid marketing journey
```

Together they create a realistic lead generation tracking system.

Summary:

- `LeadForm.tsx` collects user data.
- `/api/leads` validates incoming requests.
- `services/leads.ts` handles persistence logic.
- Neon PostgreSQL stores valid leads.
- Invalid requests never create database records.
- `/thank-you` remains the conversion checkpoint.
- `generate_lead` only fires after a valid conversion journey.

Phase 2 transforms the project from a tracking demonstration into a complete lead capture and conversion tracking system.
