-- Makana Family Veterinary Clinic: D1 SQLite Edge Schema

-- 1. Services Table
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    category TEXT NOT NULL, -- 'preventive', 'dental', 'surgery', 'diagnostics', 'urgent_care'
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
    species TEXT NOT NULL, -- 'Canine', 'Feline', 'Exotic', 'Avian', 'Small Mammal'
    breed TEXT,
    age_years REAL,
    weight_kg REAL,
    service_type TEXT NOT NULL,
    urgency_level TEXT DEFAULT 'routine', -- 'routine', 'sick_visit', 'urgent_day'
    symptoms TEXT,
    scheduled_at TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'in_consultation', 'completed', 'cancelled'
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

-- 4. Clinicians / Veterinary Team Table
CREATE TABLE IF NOT EXISTS specialists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialty TEXT NOT NULL,
    credentials TEXT NOT NULL,
    bio TEXT NOT NULL,
    board_cert TEXT,
    status TEXT DEFAULT 'On Duty', -- 'On Duty', 'In Surgery', 'In Consult', 'On Call'
    avatar_url TEXT
);

-- Indexes for lightning fast edge lookups
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments(reference_code);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_attachments_appointment ON attachments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Seed Data: General Practice Veterinary Services
INSERT OR REPLACE INTO services (id, slug, title, description, price_cents, category, duration_minutes, badge, features, sla_turnaround) VALUES
('srv_prev_01', 'comprehensive-wellness-exam', 'Comprehensive Nose-to-Tail Wellness Exam', 'Full physical examination, vitals check, coat & skin review, ocular & dental grading, and tailored nutritional guidance.', 6500, 'preventive', 30, 'Routine Care', '["Full 10-point physical examination","Cardiovascular auscultation","Weight & nutritional assessment","Digital vaccination record update"]', 'Immediate Summary'),
('srv_prev_02', 'vaccine-microchip-package', 'Core Vaccines & Lifetime Microchip Implantation', 'Age-appropriate core vaccines (Rabies, DHPP / FVRCP) paired with universal microchip registration.', 5500, 'preventive', 20, 'Preventive', '["Core immunization boosters","Universal microchip implantation","Free lifetime pet registry","Vaccination certificate in portal"]', 'Same-Day Certificate'),
('srv_prev_03', 'senior-pet-golden-years', 'Senior Pet Golden Years Consultation', 'Targeted physical and cognitive evaluation tailored for senior companions, including mobility assessment.', 8500, 'preventive', 40, 'Senior Care', '["Mobility & joint arthritis screening","Cognitive & sensory health review","Chronic organ health evaluation","Custom senior wellness plan"]', 'Same-Day Plan'),
('srv_dent_01', 'ultrasonic-dental-cleaning', 'Professional Ultrasonic Dental Cleaning & Polish', 'Subgingival ultrasonic scaling, tooth polishing, oral exam, and dental health charting under safe monitored anesthesia.', 29000, 'dental', 60, 'Dental Health', '["Full-mouth ultrasonic scaling","Enamel polishing & fluoride application","Subgingival probe & periodontal charting","Continuous vital signs monitoring"]', 'Same-Day Discharge'),
('srv_surg_01', 'routine-spay-neuter', 'Routine Spay & Neuter Procedure', 'Safe elective sterilization surgery in our sterile surgical suite with pre-anesthetic blood screening and multimodal pain relief.', 25000, 'surgery', 60, 'Standard Surgery', '["Pre-anesthetic blood screening","Multimodal continuous anesthesia","Sterile dedicated surgical suite","Post-op recovery monitoring & pain kit"]', 'Same-Day Discharge'),
('srv_surg_02', 'minor-soft-tissue-surgery', 'Minor Soft Tissue Surgery & Lump Removal', 'Excision of skin masses, cysts, minor laceration repair, and preparation for diagnostic histopathology.', 34000, 'surgery', 45, 'Outpatient Surgery', '["Local / general sedation protocol","Sterile surgical excision & closure","Biopsy sample prep for pathology","Comprehensive take-home medication"]', 'Same-Day Discharge'),
('srv_diag_01', 'digital-radiography-xray', 'In-House High-Definition Digital X-Rays', 'Rapid, low-stress digital radiography for chest, abdomen, orthopedic, or foreign body evaluation.', 16000, 'diagnostics', 25, 'Same-Day Imaging', '["Dual-view high-definition imaging","Sub-second digital exposure","Immediate veterinarian review","Instant R2 pet portal access"]', 'Instant Doctor Review'),
('srv_diag_02', 'in-clinic-blood-chemistry', 'Same-Day In-Clinic Blood & Chemistry Panel', 'Rapid on-site complete blood count (CBC) and comprehensive organ chemistry profiles with 15-minute turnaround.', 12000, 'diagnostics', 20, '15-Min Results', '["Complete Blood Count (CBC)","Kidney, liver & glucose chemistry","Electrolyte balance profiling","Immediate consult & treatment plan"]', '15-Min In-Clinic'),
('srv_diag_03', 'dermatology-ear-workup', 'Dermatology, Ear & Allergy Workup', 'Microscopic skin scrape, ear cytology, and targeted allergy identification for itchy or uncomfortable pets.', 8500, 'diagnostics', 30, 'Skin & Allergy', '["In-house microscopic cytology","Ear canal otoscopic evaluation","Custom medicated treatment protocol","Dietary elimination guidance"]', 'Same-Day Results'),
('srv_urg_01', 'same-day-urgent-visit', 'Same-Day Sick Pet & Urgent Care Visit', 'Priority daytime appointment for sudden lethargy, vomiting, limping, minor wounds, or sudden eye irritation.', 9500, 'urgent_care', 30, 'Urgent Day Slot', '["Priority check-in upon arrival","Focused sick pet examination","Direct in-house lab & X-ray routing","Immediate supportive care plan"]', 'Immediate Attention');

-- Seed Data: Friendly Clinic Veterinarians & Staff
INSERT OR REPLACE INTO specialists (id, name, title, specialty, credentials, bio, board_cert, status, avatar_url) VALUES
('spec_01', 'Dr. Maya Lin', 'Lead Veterinarian & Clinic Founder', 'General Practice & Preventive Medicine', 'DVM, Fear-Free Certified', 'Passionate about low-stress veterinary visits, wellness protocols, and gentle routine soft-tissue surgeries for dogs and cats.', 'Fear-Free Certified Professional', 'On Duty', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'),
('spec_02', 'Dr. Marcus Vance', 'Associate Veterinarian', 'Internal Health & In-House Diagnostics', 'DVM, CVA', 'Focuses on routine diagnostics, digital radiography, and managing chronic conditions in family pets with clear, friendly guidance.', 'Member, American Veterinary Medical Association (AVMA)', 'On Duty', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'),
('spec_03', 'Dr. Sarah Jenkins', 'Senior Pet & Integrative Care Veterinarian', 'Geriatric Health & Acupuncture', 'DVM, CVA (Chi University)', 'Dedicated to keeping senior pets comfortable and active with gentle mobility therapy, pain management, and nutritional support.', 'Certified Veterinary Acupuncturist (CVA)', 'In Consult', 'https://images.unsplash.com/photo-1594824813580-b8c736f86a99?auto=format&fit=crop&q=80&w=400'),
('spec_04', 'Jessica Rodriguez', 'Head Veterinary Technician & Care Lead', 'Dental Prophylaxis & Patient Comfort', 'RVT, Fear-Free Certified', 'Oversees surgical nursing, dental scale & polishes, and ensures every patient receives warm, loving care during their visit.', 'Registered Veterinary Technician (RVT)', 'On Duty', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400');

-- Seed Data: Sample Initial Confirmed Appointments for demonstration
INSERT OR REPLACE INTO appointments (id, reference_code, client_name, email, phone, pet_name, species, breed, age_years, weight_kg, service_type, urgency_level, symptoms, scheduled_at, time_slot, status, clinician_assigned) VALUES
('apt_demo_01', 'MKN-7821-CF', 'Sarah Jenkins', 's.jenkins@example.com', '+1 (555) 234-5678', 'Milo', 'Canine', 'Golden Retriever', 2.5, 31.0, 'vaccine-microchip-package', 'routine', 'Annual vaccine boosters and routine dental checkup.', '2026-08-24', '09:00 AM', 'confirmed', 'Dr. Maya Lin'),
('apt_demo_02', 'MKN-9412-CF', 'David Miller', 'd.miller@example.com', '+1 (555) 876-5432', 'Luna', 'Feline', 'Domestic Shorthair', 4.0, 4.2, 'comprehensive-wellness-exam', 'routine', 'Routine wellness check, nail trim, and weight check.', '2026-08-24', '11:30 AM', 'confirmed', 'Dr. Marcus Vance'),
('apt_demo_03', 'MKN-3109-CF', 'Amara Patel', 'amara.patel@example.com', '+1 (555) 912-3456', 'Buster', 'Canine', 'Beagle', 5.0, 13.5, 'ultrasonic-dental-cleaning', 'routine', 'Dental cleaning consultation and pre-anesthetic blood work.', '2026-08-25', '02:00 PM', 'confirmed', 'Dr. Sarah Jenkins');
