# Makana Veterinary Medicine (Edge SaaS / Clinic Web Application)

> **High-Performance Modern Single-Page Veterinary SaaS & Clinic Web Application**  
> Built with **SvelteKit (Svelte 5 Runes)**, deployed to **Cloudflare Pages**, backed by **Cloudflare D1 (SQLite at the Edge)** and **Cloudflare R2 (Zero-Egress Object Storage)**.

---

## 🔬 System Overview & Aesthetics

- **Visual Style:** Modern, premium B2B SaaS aesthetic (Linear/Vercel style adapted for clinical veterinary medicine). Clean, high-contrast, spacious, and light.
- **Palette & Typography:** Crisp off-whites, cool slate borders (`border-slate-200/80`), deep charcoal text, and clinical emerald/teal accents (`emerald-600`, `teal-600`). Monospace typography (`JetBrains Mono`) for technical metadata, timestamps, reference IDs, and edge telemetries.
- **Architecture:** Zero-egress Cloudflare Edge stack. Sub-5ms D1 queries, sub-second R2 PACS diagnostic streaming, and resilient edge fallback for instant local and offline development.

---

## ⚡ Core Features & Single-Page Flow

1. **Sticky Command Bar / Header:**
   - Minimalist navigation with live **Emergency Triage: Online** indicator badge.
   - Global **Track Intake (REF#)** lookup trigger (`⌘K` shortcut support).
   - High-contrast **Book Consult** action.
2. **High-Impact Hero Section:**
   - Dual CTA (*Instant Edge Intake* vs *Specialist Directory*).
   - Real-time **Triage Capacity Badge** (active specialists, ER bed capacity %, average triage latency SLA, edge node identifier).
   - **Interactive Micro-Preview Card** with live triage queue, PACS DICOM stream, and edge telemetry health tabs.
3. **Interactive Service Matrix (Bento Grid):**
   - Filter tabs: *All Services*, *Preventive Care*, *Diagnostics & Imaging*, *Surgical Suites*, *24/7 Tele-Triage*.
   - Bento cards with fixed all-inclusive prices, turnaround SLAs, biometric checklists, and 1-click booking preset triggers.
4. **Edge Intake & Booking Engine:**
   - **Species Selector:** Canine, Feline, Exotic, Avian, Equine with specialized biometric inputs.
   - **Clinical Urgency Selector:** *Routine Care*, *Priority Diagnostic*, *Critical ER Triage*.
   - **Direct Cloudflare R2 Dropzone:** Drag-and-drop file ingestion for prior radiographs, laboratory PDFs, and referral letters (Server-side validation: PDF/JPEG/PNG/WEBP, max 10 MB per file).
   - **Time Slot Selector:** Dynamic schedule window synchronized with D1 edge reservations.
   - **Real-Time Booking Confirmation:** Generates unique tracking tokens (e.g. `MKN-7821-CF`), summary printouts, and immediate D1/R2 sync.
5. **Transparency & Pricing Tiers:**
   - SaaS-style toggle between **Monthly Wellness Memberships** (*Essential Edge Care*, *Clinical Comprehensive*, *Platinum Surgical*) and the **Direct Standardized Procedure Fee Schedule**.
6. **In-House Clinical Hardware & PACS Diagnostics:**
   - Detailed specifications for *3.0T High-Field MRI*, *64-Slice Spectral CT*, *Olympus 4K Laparoscopic Towers*, and *IDEXX Edge Pathology*.
7. **Board-Certified Specialists & Faculty:**
   - Clinical profiles with diplomate certifications (ACVS, ACVR, ACVECC, ACVIM) and real-time on-duty status indicators.
8. **EHR Record & Attachment Lookup Drawer:**
   - Search by reference code (or test with sample tokens: `MKN-7821-CF`, `MKN-9412-CF`, `MKN-3109-CF`) to view real-time status and download uploaded R2 files.
9. **Footer & 24/7 Emergency Protocol:**
   - Direct-dial emergency hotline anchor (`+1 (800) 555-8389`).
   - Live Edge latency & node health ping component (`/api/health`).
   - Schema.org structured `VeterinaryCare` JSON-LD metadata for SEO.

---

## 📁 Repository Structure

```text
makana-vet-app/
├── schema.sql                         # Cloudflare D1 SQLite schema + clinical seed data
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
│   │   ├── data/                      # Mock & initial clinical datasets
│   │   ├── server/
│   │   │   ├── db.ts                  # D1 SQLite Edge client with local fallback
│   │   │   └── r2.ts                  # R2 Object storage client, mime/size validator & streaming
│   │   └── components/
│   │       ├── Header.svelte          # Sticky command bar & triage badge
│   │       ├── Hero.svelte            # Hero headline & live interactive preview card
│   │       ├── TriageCapacityBadge.svelte # Edge capacity telemetry badge
│   │       ├── ServiceMatrix.svelte   # Bento grid service catalogue with filter tabs
│   │       ├── IntakeBookingEngine.svelte # Form intake, species selector & D1/R2 submit
│   │       ├── FileDropzone.svelte    # Drag-and-drop R2 attachment uploader
│   │       ├── TimeSlotSelector.svelte# Date & time slot picker
│   │       ├── PricingTiers.svelte    # Wellness membership vs procedure schedule
│   │       ├── TechStackDiagnostics.svelte # 3.0T MRI, CT, Laparoscopy & Edge architecture
│   │       ├── SpecialistsSection.svelte # Board-certified clinician cards
│   │       ├── AppointmentLookupModal.svelte # Record & R2 file download modal
│   │       └── Footer.svelte          # 24/7 ER hotline & live health check
│   └── routes/
│       ├── +layout.svelte             # Root layout
│       ├── +page.server.ts            # Server-side load fetching D1 services & specialists
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

## 🛠 Cloudflare Configuration (`wrangler.toml`)

```toml
name = "makana-vet-app"
pages_build_output_dir = ".svelte-kit/cloudflare"
compatibility_date = "2024-11-01"
compatibility_flags = ["nodejs_compat"]

[vars]
CLINIC_NAME = "Makana Clinical Veterinary Medicine"
CLINIC_EDGELOCATION = "Global Edge Network"
EMERGENCY_HOTLINE = "+1 (800) 555-8389"
MAX_UPLOAD_SIZE_BYTES = "10485760"

# Cloudflare D1 Database Binding
[[d1_databases]]
binding = "DB"
database_name = "makana-vet-d1"
database_id = "makana-vet-d1-prod"
migrations_dir = "migrations"

# Cloudflare R2 Bucket Binding
[[r2_buckets]]
binding = "RECORDS_BUCKET"
bucket_name = "makana-vet-records"
preview_bucket_name = "makana-vet-records-preview"
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
