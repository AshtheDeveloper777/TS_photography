# TS PHOTOGRAPHY — Official Studio Website

A premium editorial website for **TS Photography**, designed with timeless ivory-and-charcoal aesthetics, dynamic media discovery from Supabase Storage (TS_photography), and a production-ready booking enquiry engine.

---

## Features

- **Editorial Ivory & Charcoal Aesthetic**: Warm ivory (#F7F5F0), charcoal (#20201E), muted stone, and restrained champagne accents.
- **Dynamic Media Discovery**: Automatically discovers photographs and cinematic video assets from the Supabase Storage bucket TS_photography.
- **Responsive Fullscreen Lightbox**: Touch-friendly with keyboard navigation (arrow keys, ESC).
- **Responsive Video Section**: Custom audio/playback controls for cinematic motion footage.
- **Configurable Services**: 8 photography categories with customized descriptions and direct booking links.
- **About the Studio**: Narrative introducing founder **Tholkappiyan A** and student collaborators with verified signature sunset photography.
- **End-to-End Booking System**: Client + Server-side validation with Zod, honeypot spam protection, and Row Level Security (RLS) persistence to Supabase.
- **Quick Contact Shortcuts**: Immediate WhatsApp (+91 6369911759), direct Email (	holkappiyana07@gmail.com), and Instagram (@ts_photo_graphy_56).

---

## Environment Variables

Configure the following variables in .env.local for local development or in **Vercel Project Settings → Environment Variables**:

| Variable | Description |
| :--- | :--- |
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL (https://xyz.supabase.co) |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase publishable anonymous key |
| SUPABASE_SERVICE_ROLE_KEY | (Optional) Required only if TS_photography bucket is private to generate server-side signed URLs |
| NEXT_PUBLIC_STUDIO_PHONE | (Optional) Studio phone number |
| NEXT_PUBLIC_STUDIO_WHATSAPP | (Optional) WhatsApp direct URL |
| NEXT_PUBLIC_STUDIO_EMAIL | (Optional) Studio email address |
| NEXT_PUBLIC_STUDIO_INSTAGRAM | (Optional) Instagram handle |

---

## Supabase Database Setup

Run the SQL migration in supabase/migrations/20261018_ts_photography_schema.sql in your Supabase SQL Editor to:
1. Create the ooking_enquiries table with constraints and indexes.
2. Enable Row Level Security (RLS) allowing anonymous visitors to submit enquiries while keeping enquiries private from unauthorized reads.
3. Configure the TS_photography storage bucket and public read policy.

---

## How to Deploy to Vercel

1. Push this repository to GitHub: https://github.com/AshtheDeveloper777/TS_photography.
2. Go to [vercel.com/new](https://vercel.com/new) and import the **TS_photography** repository.
3. Framework Preset: **Next.js**.
4. Root Directory: ./ (leave default).
5. In **Environment Variables**, add:
   - NEXT_PUBLIC_SUPABASE_URL = https://hdoejjtkbxyjloezpqhn.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = <your-supabase-anon-key>
6. Click **Deploy**. Vercel will build and launch the site live within 1–2 minutes!

---

## Local Development

`ash
# Install dependencies
pnpm install # or npm install

# Run the development server
pnpm dev # or npm run dev
`

Open [http://localhost:3000](http://localhost:3000) with your browser.
