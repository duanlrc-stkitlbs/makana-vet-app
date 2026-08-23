# AGENTS.md

> Developer & AI Agent Reference for **Makana Veterinary Medicine** (Cloudflare Edge Clinical SaaS).

---

## 1. System Architecture

```
                                    +-----------------------------------------+
                                    |        Cloudflare Global Anycast        |
                                    +-----------------------------------------+
                                                         |
                                                         v
                                    +-----------------------------------------+
                                    |     Cloudflare Pages / Workers SSR      |
                                    |      (SvelteKit 2 + Svelte 5 Runes)     |
                                    +-----------------------------------------+
                                          |                               |
                   +----------------------+                               +----------------------+
                   |                                                                             |
                   v                                                                             v
+-------------------------------------+                                       +-------------------------------------+
|         Cloudflare D1 (Edge)        |                                       |          Cloudflare R2 (PACS)       |
|    Database: makana-vet-d1          |                                       |      Bucket: makana-vet-records     |
|  - Appointments & Clinical Records  |                                       |  - Diagnostic Imaging (DICOM, X-Ray)|
|  - Services & Pricing Matrix        |                                       |  - Owner Attachments & Lab Workups  |
|  - Specialist Diplomate Directory   |                                       |  - Zero Egress Bandwidth Fees       |
+-------------------------------------+                                       +-------------------------------------+
```

- **Frontend & SSR:** SvelteKit (`@sveltejs/adapter-cloudflare`) leveraging Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`).
- **Styling:** Tailwind CSS + custom clinical palette, monospace data typography (`JetBrains Mono`), and SVG icons.
- **Edge Storage & DB:**
  - **D1 SQLite:** Relational appointments, services, specialists, and attachment metadata.
  - **R2 Storage:** Direct streaming of binary medical records (PDF, PNG, JPEG, WEBP) with server-side validation.
- **Resilience Strategy:** Zero-config in-memory fallback layer in `$lib/server/db.ts` and `$lib/server/r2.ts` for instant `vite dev` testing without active Cloudflare credentials.

---

## 2. Cloudflare Bindings & Production Configuration

### `wrangler.toml` Reference

| Resource | Binding Name | Target Identifier | Type / Notes |
| :--- | :--- | :--- | :--- |
| **D1 Database** | `DB` | `makana-vet-d1`<br>`58752a4f-9ef8-4dd9-97bb-4741ad5d21d7` | Region: `WEUR` (Replicated globally) |
| **R2 Bucket** | `RECORDS_BUCKET` | `makana-vet-records` | Standard storage class (Zero egress) |
| **Pages Project** | — | `makana-vet-app` | Production URL: `https://makana-vet-app.pages.dev` |

### Environment Variables (`[vars]`)
- `CLINIC_NAME`: `"Makana Clinical Veterinary Medicine"`
- `CLINIC_EDGELOCATION`: `"Global Edge Network"`
- `EMERGENCY_HOTLINE`: `"+1 (800) 555-8389"`
- `MAX_UPLOAD_SIZE_BYTES`: `"10485760"` (10 MB upload ceiling)

---

## 3. Project Directory Structure

```text
makana-vet-app/
├── AGENTS.md                                   # Agent & developer architectural documentation
├── README.md                                   # Public repo README & getting started
├── package.json                                # SvelteKit, Tailwind, Lucide, Wrangler dependencies
├── svelte.config.js                            # Adapter Cloudflare configuration
├── vite.config.ts                              # Vite bundler configuration
├── tailwind.config.js                          # Theme colors (clinical-*, surface-*), fonts & shadows
├── wrangler.toml                               # D1 (`DB`) & R2 (`RECORDS_BUCKET`) bindings
├── schema.sql                                  # D1 SQLite DDL schema + initial clinical seed data
├── src/
│   ├── app.d.ts                                # Cloudflare platform binding types (DB, RECORDS_BUCKET, cf)
│   ├── app.html                                # HTML shell, fonts (Inter, JetBrains Mono), meta tags
│   ├── app.css                                 # Tailwind base/components/utilities & grid patterns
│   ├── lib/
│   │   ├── types/
│   │   │   └── index.ts                        # TypeScript interfaces (Service, Appointment, Specialist, etc.)
│   │   ├── data/
│   │   │   └── mock-data.ts                    # Fallback datasets and clinical specifications
│   │   ├── server/
│   │   │   ├── db.ts                           # D1 database client with parameterization & local memory fallback
│   │   │   └── r2.ts                           # R2 client, MIME/size validator & object streaming
│   │   └── components/
│   │       ├── Header.svelte                   # Sticky command bar, triage badge & lookup trigger
│   │       ├── Hero.svelte                     # Hero headline, dual CTA & live micro-preview telemetry
│   │       ├── TriageCapacityBadge.svelte      # Real-time triage telemetry pill
│   │       ├── ServiceMatrix.svelte            # Bento grid service catalogue with category filters
│   │       ├── IntakeBookingEngine.svelte      # 4-step clinical intake form with D1/R2 sync
│   │       ├── FileDropzone.svelte             # R2 file upload dropzone with type & size validation
│   │       ├── TimeSlotSelector.svelte         # Scheduled consultation window selector
│   │       ├── PricingTiers.svelte             # Wellness plans vs procedure schedule toggle
│   │       ├── TechStackDiagnostics.svelte     # 3.0T MRI, CT, Laparoscopic suites & edge specs
│   │       ├── SpecialistsSection.svelte       # Board-certified diplomate profiles
│   │       ├── AppointmentLookupModal.svelte   # Reference code / phone search & R2 download modal
│   │       └── Footer.svelte                   # 24/7 ER hotline & periodic /api/health ping
│   └── routes/
│       ├── +layout.svelte                      # Root layout wrapper
│       ├── +page.server.ts                     # Edge server load querying D1 services & specialists
│       ├── +page.svelte                        # Single-page application orchestration
│       └── api/
│           ├── appointments/
│           │   ├── +server.ts                  # GET (list/filter) & POST (create appointment + R2 upload)
│           │   └── [ref]/+server.ts            # GET single appointment by reference code
│           ├── attachments/
│           │   └── [...key]/+server.ts         # GET streams binary records from R2
│           └── health/
│               └── +server.ts                  # GET edge latency, D1 connection & node colo
```

---

## 4. Completed Milestones

- [x] **Project Initialization:** Configured SvelteKit with Svelte 5, Tailwind CSS, and `@sveltejs/adapter-cloudflare`.
- [x] **Database & Storage Architecture:** Designed `schema.sql` (appointments, attachments, services, specialists) and implemented `$lib/server/db.ts` + `$lib/server/r2.ts`.
- [x] **Server-Side Upload Security:** Whitelisted MIME types (`application/pdf`, `image/jpeg`, `image/png`, `image/webp`) with a 10MB size ceiling.
- [x] **Single-Page Flow Implementation:**
  - Sticky Command Bar with real-time Triage Status.
  - Interactive Micro-Preview card with Live Queue and PACS telemetry tabs.
  - Bento grid Service Matrix with dynamic category filtering.
  - Edge Intake & Booking Engine supporting species selection, clinical notes, and file attachments.
  - Transparent pricing switcher (Monthly Wellness vs Fixed Procedure Schedule).
  - Diagnostic hardware specifications and specialist diplomate directory.
  - Appointment & medical record lookup modal.
  - 24/7 ER emergency protocol with direct-dial anchors and Schema.org JSON-LD.
- [x] **Version Control:** Repository initialized and pushed to `https://github.com/duanlrc-stkitlbs/makana-vet-app`.
- [x] **Cloudflare Edge Provisioning & Deployment:**
  - Created and seeded D1 database: `makana-vet-d1` (`58752a4f-9ef8-4dd9-97bb-4741ad5d21d7`).
  - Created R2 bucket: `makana-vet-records`.
  - Deployed to Cloudflare Pages: `https://makana-vet-app.pages.dev`.
  - Verified live endpoints (`/api/health`, `/api/appointments`, `/api/appointments/:ref`).

---

## 5. Developer Workflows & Commands

### Local Development
```bash
# Start standard Vite dev server (uses resilient mock fallback)
npm run dev

# Run type checks
npm run check
```

### D1 Database Operations
```bash
# Execute local schema migrations
npx wrangler d1 execute makana-vet-d1 --local --file=./schema.sql

# Execute remote (production) schema migrations
npx wrangler d1 execute makana-vet-d1 --remote --file=./schema.sql
```

### Building & Deploying to Cloudflare Pages
```bash
# Compile client and edge worker bundles
npm run build

# Deploy directly via Wrangler
npx wrangler pages deploy .svelte-kit/cloudflare --project-name=makana-vet-app --branch=main --commit-dirty=true
```

---

## 6. Live Telemetry & Verification Endpoints

- **Web App:** [https://makana-vet-app.pages.dev](https://makana-vet-app.pages.dev)
- **Health Check:** `GET https://makana-vet-app.pages.dev/api/health`
- **Sample Record Lookup:** `GET https://makana-vet-app.pages.dev/api/appointments/MKN-7821-CF`
- **GitHub Repository:** [https://github.com/duanlrc-stkitlbs/makana-vet-app](https://github.com/duanlrc-stkitlbs/makana-vet-app)
