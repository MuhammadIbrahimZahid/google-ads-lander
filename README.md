# Google Ads Lander

A landing page built with **Next.js**, **TypeScript**, and **Google Analytics 4**.

---

## Prerequisites

Install:

* Node.js 20+ (recommended)
* npm (comes with Node.js)

---

## Clone the repository

```bash
git clone <repository-url>
cd google-ads-lander
```

---

## Install dependencies

```bash
npm install
```

---

## Configure environment variables

Create a file named:

```text
.env.local
```

Add your Google Analytics Measurement ID:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace the value with your own GA4 Measurement ID.

---

## Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Build for production

```bash
npm run build
```

---

## Start the production server

```bash
npm start
```

---

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── thank-you/
│       └── page.tsx
├── components/
├── lib/
└── styles/

public/

docs/
```

---

## Google Analytics

Google Analytics is initialized in:

```
src/app/layout.tsx
```

The application reads the Measurement ID from:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID
```

This keeps the code independent of a hardcoded GA4 ID and makes it easier to configure different environments.

---

## Available Scripts

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production build:

```bash
npm start
```

Run linting:

```bash
npm run lint
```
