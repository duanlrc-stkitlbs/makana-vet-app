# Makana Family Veterinary Clinic (Edge Web App)

> **Modern, Compassionate Single-Page General Practice Veterinary Web Application**  
> Built with **SvelteKit (Svelte 5 Runes)**, deployed to **Cloudflare Pages**, backed by **Cloudflare D1 (SQLite at the Edge)** and **Cloudflare R2 (Zero-Egress Object Storage)**.

---

## 🐾 System Overview & Aesthetics

- **Visual Style:** Modern, warm, and approachable clinic aesthetic. Clean, high-contrast, spacious, and stress-free for pet parents.
- **Palette & Typography:** Crisp off-whites, cool slate borders (`border-slate-200/80`), deep charcoal text, and soothing emerald/forest accents (`emerald-700`, `emerald-600`). Monospace typography (`JetBrains Mono`) for technical metadata, timestamps, reference IDs, and edge telemetries.
- **Architecture:** Zero-egress Cloudflare Edge stack. Sub-5ms D1 queries, sub-second R2 medical record streaming, and resilient edge fallback for instant local and offline development.

---

## ⚡ Core Features & Single-Page Flow

1. **Sticky Command Bar / Header:**
   - Approachable clinic status pill (**Clinic Status: Open & Welcoming | Same-Day Slots Available**).
   - Global **Pet Portal Lookup (REF#)** trigger (`⌘K` shortcut support).
   - High-contrast **Book Visit** action.
2. **High-Impact Hero Section:**
   - Friendly headline: *"Friendly, Modern Care For The Pets You Love."*
   - Dual CTA (*Book an Appointment* vs *Meet Our Vets*).
   - Real-time **Clinic Availability Badge** (on-site doctors, open schedule capacity %, check-in wait time, edge node identifier).
   - **Interactive Micro-Preview Card** with live daily schedule queue, in-house lab telemetry, and instant Pet EHR record portal.
3. **Interactive Service Matrix (Bento Grid):**
   - Filter tabs: *All Services*, *Wellness & Vaccines*, *Dental Care*, *Routine Surgeries*, *In-House Lab & X-Ray*, *Sick Pet & Urgent*.
   - Bento cards with fixed fees (R480 – R3,200), turnaround times, and 1-click booking triggers.
4. **Online Intake & Booking Engine:**
   - **Species Selector:** Canine (Dog), Feline (Cat), Small Mammal (Rabbit/Guinea Pig), Avian (Bird), Exotic Pet.
   - **Reason for Visit / Urgency:** *Routine Wellness & Vaccines*, *Sick Pet Visit*, *Same-Day Urgent Visit*.
   - **Cloudflare R2 Dropzone:** Drag-and-drop file ingestion for previous vaccine records, adoption certificates, and vet notes (Server-side validation: PDF/JPEG/PNG/WEBP, max 10 MB per file).
   - **Time Slot Selector:** Dynamic appointment calendar window synchronized with D1 edge reservations.
   - **Real-Time Booking Confirmation:** Generates unique tracking tokens (e.g. `MKN-7821-CF`), summary printouts, and immediate D1/R2 sync.
5. **Transparency & Wellness Plans:**
   - SaaS-style toggle between **Monthly Wellness Plans** (*Puppy & Kitten Starter* R380/mo, *Adult Companion Complete* R550/mo, *Senior Golden Years* R750/mo) and the **Standard Procedure Fee Schedule**.
6. **In-House Diagnostic & Surgical Facilities:**
   - Specifications for *Sound HD Digital Radiography*, *IDEXX Catalyst & ProCyte Lab Suite*, *Midmark Ultrasonic Dental Suite*, and *Dedicated Soft-Tissue Surgical Suite*.
7. **Compassionate Veterinary Care Team:**
   - Team profiles for Dr. Maya Lin (Lead Vet & Founder), Dr. Marcus Vance (Associate Vet), Dr. Sarah Jenkins (Senior Pet & Acupuncture), and Jessica Rodriguez (Head Veterinary Nurse & Care Lead).
8. **Pet EHR Record & Attachment Lookup Drawer:**
   - Search by reference code (or test with sample tokens: `MKN-7821-CF`, `MKN-9412-CF`, `MKN-3109-CF`) to view visit status and download attached R2 records.
9. **Footer & Urgent Care Guidance:**
   - Daytime urgent care and direct-dial hotline (`+27 (0) 21 555 8389`).
   - Clinic hours: Mon–Fri 8:00 AM – 6:00 PM, Sat 8:30 AM – 2:00 PM (Emergency partner referral for nights).
   - Live Edge latency & node health ping component (`/api/health`).
   - Schema.org structured `VeterinaryCare` JSON-LD metadata for local SEO.

---

## 📁 Repository Structure

```text
makana-vet-app/
├── schema.sql                         # Cloudflare D1 SQLite schema + general clinic seed data
├── wrangler.toml                      # Cloudflare Pages, D1 Database, and R2 Bucket bindings
├── svelte.config.js                   # @sveltejs/adapter-cloudflare configuration
├── vite.config.ts                     # Vite + SvelteKit configuration
├── tailwind.config.js                 # Clinical color palette, typography & shadows
├── src/
│   ├── app.d.ts                       # Cloudflare Platform types (DB, RECORDS_BUCKET, cf)
│   ├── app.html                       # HTML shell, fonts (Inter, JetBrains Mono), meta
│   ├── app.css                        # Tailwind layers, grid patterns, glass styles
│   ├── lib/
│   │   ├── types/                     # TypeScript models (Service, Appointment, Attachment, etc.)
│   │   ├── data/                      # Mock & initial clinic datasets
│   │   ├── server/
│   │   │   ├── db.ts                  # D1 SQLite Edge client with local fallback
│   │   │   └── r2.ts                  # R2 Object storage client, mime/size validator & streaming
│   │   └── components/
│   │       ├── Header.svelte          # Sticky command bar & clinic status badge
│   │       ├── Hero.svelte            # Hero headline & live interactive preview card
│   │       ├── TriageCapacityBadge.svelte # Edge capacity & doctor availability telemetry badge
│   │       ├── ServiceMatrix.svelte   # Bento grid service catalogue with filter tabs
│   │       ├── IntakeBookingEngine.svelte # Form intake, species selector & D1/R2 submit
│   │       ├── FileDropzone.svelte    # Drag-and-drop R2 attachment uploader
│   │       ├── TimeSlotSelector.svelte# Date & time slot picker
│   │       ├── PricingTiers.svelte    # Wellness membership plans vs procedure schedule
│   │       ├── TechStackDiagnostics.svelte # In-house lab, X-Ray, dental & Edge architecture
│   │       ├── SpecialistsSection.svelte # Friendly veterinary care team cards
│   │       ├── AppointmentLookupModal.svelte # Record & R2 file download modal
│   │       └── Footer.svelte          # Urgent care hotline, hours & live health check
│   └── routes/
│       ├── +layout.svelte             # Root layout
│       ├── +page.server.ts            # Server-side load fetching D1 services & staff
│       ├── +page.svelte               # Single-page flow
│       └── api/
│           ├── appointments/
│           │   ├── +server.ts         # GET (search) & POST (create appointment + R2 upload)
│           │   └── [ref]/+server.ts   # GET appointment by reference code / phone
│           ├── attachments/[...key]/+server.ts # GET streams medical files from R2
│           └── health/+server.ts      # GET edge latency, D1 status, R2 status
└── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The app runs seamlessly with an in-memory edge fallback if Cloudflare D1/R2 credentials are not yet configured locally.

### 3. Initialize Cloudflare D1 Database (Local or Remote)
To create and seed your local or remote Cloudflare D1 database:

```bash
# Create local D1 database tables and populate seed data
npx wrangler d1 execute makana-vet-d1 --local --file=./schema.sql

# For production deployment
npx wrangler d1 execute makana-vet-d1 --remote --file=./schema.sql
```

### 4. Create Cloudflare R2 Bucket
```bash
npx wrangler r2 bucket create makana-vet-records
```

### 5. Run with Local Cloudflare Pages & D1/R2 Emulation
```bash
npm run build
npx wrangler pages dev .svelte-kit/cloudflare --d1=DB=makana-vet-d1 --r2=RECORDS_BUCKET=makana-vet-records
```

---

## 🔒 Security & Server-Side Validation

1. **File Upload Security:**
   - Strict MIME type verification: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`.
   - File size capped at 10 MB per attachment (`10485760` bytes).
   - Sanitized object keys scoped to `records/${appointmentId}/${timestamp}-${sanitizedName}`.
2. **Edge Database Queries:**
   - Parameterized SQLite bindings (`db.prepare('...').bind(...)`) prevent SQL injection attacks.
3. **Data Integrity:**
   - Cascading foreign keys between `appointments` and `attachments`.

---

## 📄 License
MIT License. Crafted for high-performance edge veterinary healthcare.

