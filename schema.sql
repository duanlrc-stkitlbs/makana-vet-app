-- Makana Veterinary Medicine: D1 SQLite Edge Schema

-- 1. Services Table
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    category TEXT NOT NULL, -- 'preventive', 'diagnostics', 'surgery', 'teletriage'
    duration_minutes INTEGER NOT NULL,
    badge TEXT,
    features TEXT NOT NULL, -- JSON array of string features
    sla_turnaround TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 2. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    reference_code TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    pet_name TEXT NOT NULL,
    species TEXT NOT NULL, -- 'Canine', 'Feline', 'Exotic', 'Avian', 'Equine'
    breed TEXT,
    age_years REAL,
    weight_kg REAL,
    service_type TEXT NOT NULL,
    urgency_level TEXT DEFAULT 'routine', -- 'routine', 'priority', 'critical'
    symptoms TEXT,
    scheduled_at TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'in_triage', 'completed', 'cancelled'
    clinician_assigned TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 3. Medical Record Attachments (Linked to Cloudflare R2 Keys)
CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY,
    appointment_id TEXT NOT NULL,
    r2_object_key TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- 4. Clinicians / Specialists Table
CREATE TABLE IF NOT EXISTS specialists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialty TEXT NOT NULL,
    credentials TEXT NOT NULL,
    bio TEXT NOT NULL,
    board_cert TEXT,
    status TEXT DEFAULT 'On Duty', -- 'On Duty', 'In Surgery', 'In Consult'
    avatar_url TEXT
);

-- Indexes for lightning fast edge lookups
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments(reference_code);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_attachments_appointment ON attachments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Seed Data: Core Clinical Services
INSERT OR REPLACE INTO services (id, slug, title, description, price_cents, category, duration_minutes, badge, features, sla_turnaround) VALUES
('srv_prev_01', 'comprehensive-wellness-exam', 'Comprehensive Clinical Wellness Exam', 'Full physical biometric examination, vitals profiling, baseline ocular/dental check, and customized preventative protocol.', 12500, 'preventive', 45, 'Standard Care', '["Full 12-point biometric scan","Cardiovascular auscultation","Nutritional metabolic assessment","Edge EHR real-time sync"]', 'Immediate Summary'),
('srv_prev_02', 'advanced-immunology-panel', 'Advanced Edge Immunology & Biologics', 'Targeted core immunization series, titer assay analysis, pathogen screening, and personalized vaccine schedule.', 18000, 'preventive', 30, 'Preventive', '["Core titer assay validation","Species-specific pathogen panel","Parasite antigen screening","Digital vaccination passport"]', '24h Titer Lab'),
('srv_diag_01', 'highfield-mri-neuro', '3.0T High-Field Neuro & Soft Tissue MRI', 'Sub-millimeter multi-sequence magnetic resonance imaging for neurological, spinal, musculoskeletal, and oncological evaluation.', 145000, 'diagnostics', 90, 'Advanced Imaging', '["3.0 Tesla ultra-high resolution","Real-time contrast enhancement","DICOM cloud PACS push","Board-certified radiologist read"]', '< 2 Hours Radiologist Read'),
('srv_diag_02', 'ultrafast-64ct', '64-Slice Dynamic Volumetric CT', 'High-speed diagnostic computed tomography with 3D anatomical reconstruction and vascular angiography.', 98000, 'diagnostics', 60, 'Precision Diag', '["0.35s gantry rotation speed","3D orthopedic vascular rendering","Sedation safety monitoring","Instant R2 DICOM sync"]', '< 1 Hour Direct Report'),
('srv_diag_03', 'digital-direct-radiography', 'High-Definition Digital Radiography (X-Ray)', 'Zero-latency digital direct radiology with AI-assisted pulmonary and skeletal artifact detection.', 32000, 'diagnostics', 25, 'Zero Latency', '["Sub-second exposure capture","Dual-view orthogonal imaging","Instant edge PACS availability","Cloud client access"]', 'Instant Edge Push'),
('srv_surg_01', 'laparoscopic-minimally-invasive', 'Minimally Invasive Laparoscopic Surgery', 'Precision HD endoscopy and lap surgical suite offering ultra-fast recovery times, minimal pain, and smaller incisions.', 220000, 'surgery', 120, 'Surgical Suite', '["4K Ultra-HD endoscopic optics","Advanced bipolar vessel sealing","Continuous multivariable capnography","Dedicated post-op recovery suite"]', 'Same-day Discharge Option'),
('srv_surg_02', 'orthopedic-tplo-reconstruction', 'Complex Orthopedic & TPLO Reconstruction', 'Specialized cruciate ligament stabilization, arthroscopy, and robotic-assisted corrective osteotomy.', 360000, 'surgery', 180, 'Specialty Suite', '["Pre-op 3D CT surgical template","Titanium locking plate hardware","Intraoperative fluoroscopy verification","Structured rehab recovery protocol"]', 'Overnight Monitored Care'),
('srv_tele_01', '247-instant-teletriage', '24/7 Priority Emergency Tele-Triage', 'Instant live encrypted video and telemetry consult with a licensed emergency veterinary specialist within 3 minutes.', 7500, 'teletriage', 20, 'Active 24/7', '["< 3 minute connect SLA","Direct R2 image/video attachment review","Prescription edge routing","Immediate ER bay pre-activation"]', '< 3 Mins Connect'),
('srv_tele_02', 'asynchronous-specialist-review', 'Asynchronous Specialist Second Opinion', 'Comprehensive digital audit of prior medical histories, laboratory workups, and DICOM images by a board-certified specialist.', 16000, 'teletriage', 40, 'Deep Review', '["Full multi-clinic record consolidation","DICOM imaging re-analysis","Formal written prognosis document","Prescription adjustments"]', '< 12 Hours Turnaround');

-- Seed Data: Board-Certified Specialists
INSERT OR REPLACE INTO specialists (id, name, title, specialty, credentials, bio, board_cert, status, avatar_url) VALUES
('spec_01', 'Dr. Elena Rostova', 'Chief of Veterinary Surgery & Orthopedics', 'Orthopedic & Soft Tissue Surgery', 'DVM, DACVS-SA, PhD', 'Pioneer in minimally invasive canine arthroscopy and 3D-guided osteotomy with over 14 years of tertiary clinical experience.', 'Diplomate, American College of Veterinary Surgeons', 'On Duty', '/avatars/rostova.webp'),
('spec_02', 'Dr. Marcus Vance', 'Director of Diagnostic Imaging & Radiology', 'Diagnostic Radiology & MRI', 'DVM, DACVR, MS', 'Specialized in high-field neuro-imaging and pediatric thoracic ultrasound. Former academic clinical lead at Cornell University.', 'Diplomate, American College of Veterinary Radiology', 'On Duty', '/avatars/vance.webp'),
('spec_03', 'Dr. Ananya Chen', 'Lead Critical Care & Emergency Triage Specialist', 'Emergency & Critical Care Medicine', 'DVM, DACVECC', 'Expert in acute trauma management, continuous cardiovascular life support, and rapid telemetry-assisted triage protocols.', 'Diplomate, American College of Veterinary Emergency and Critical Care', 'On Duty', '/avatars/chen.webp'),
('spec_04', 'Dr. Julian Thorne', 'Internal Medicine & Oncology Clinician', 'Small Animal Internal Medicine & Oncology', 'BVSc, DACVIM (SAIM)', 'Focuses on complex endocrine disorders, non-invasive targeted therapies, and precision oncology protocols.', 'Diplomate, American College of Veterinary Internal Medicine', 'In Consult', '/avatars/thorne.webp');

-- Seed Data: Sample Initial Confirmed Appointments for demonstration
INSERT OR REPLACE INTO appointments (id, reference_code, client_name, email, phone, pet_name, species, breed, age_years, weight_kg, service_type, urgency_level, symptoms, scheduled_at, time_slot, status, clinician_assigned) VALUES
('apt_demo_01', 'MKN-7821-CF', 'Sarah Jenkins', 's.jenkins@example.com', '+1 (555) 234-5678', 'Zeus', 'Canine', 'German Shepherd', 4.5, 34.2, 'highfield-mri-neuro', 'priority', 'Acute hindlimb ataxia and spinal reflex asymmetry over past 48h.', '2026-08-24', '09:00 AM', 'confirmed', 'Dr. Marcus Vance'),
('apt_demo_02', 'MKN-9412-CF', 'David Miller', 'd.miller@example.com', '+1 (555) 876-5432', 'Cleo', 'Feline', 'Ragdoll', 3.0, 4.8, 'comprehensive-wellness-exam', 'routine', 'Annual preventative health check and routine blood chemistry workup.', '2026-08-24', '11:30 AM', 'confirmed', 'Dr. Julian Thorne'),
('apt_demo_03', 'MKN-3109-CF', 'Amara Patel', 'amara.patel@example.com', '+1 (555) 912-3456', 'Apollo', 'Canine', 'Golden Retriever', 2.0, 29.5, 'laparoscopic-minimally-invasive', 'routine', 'Preventive prophylactic laparoscopic gastropexy and baseline ultrasound.', '2026-08-25', '02:00 PM', 'confirmed', 'Dr. Elena Rostova');
