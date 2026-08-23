import type { Service, Specialist, Appointment, TriageCapacity } from '$lib/types';

export const DEFAULT_SERVICES: Service[] = [
	{
		id: 'srv_prev_01',
		slug: 'comprehensive-wellness-exam',
		title: 'Comprehensive Clinical Wellness Exam',
		description: 'Full physical biometric examination, vitals profiling, baseline ocular/dental check, and customized preventative protocol.',
		price_cents: 12500,
		category: 'preventive',
		duration_minutes: 45,
		badge: 'Standard Care',
		features: [
			'Full 12-point biometric scan',
			'Cardiovascular auscultation',
			'Nutritional metabolic assessment',
			'Edge EHR real-time sync'
		],
		sla_turnaround: 'Immediate Summary'
	},
	{
		id: 'srv_prev_02',
		slug: 'advanced-immunology-panel',
		title: 'Advanced Edge Immunology & Biologics',
		description: 'Targeted core immunization series, titer assay analysis, pathogen screening, and personalized vaccine schedule.',
		price_cents: 18000,
		category: 'preventive',
		duration_minutes: 30,
		badge: 'Preventive',
		features: [
			'Core titer assay validation',
			'Species-specific pathogen panel',
			'Parasite antigen screening',
			'Digital vaccination passport'
		],
		sla_turnaround: '24h Titer Lab'
	},
	{
		id: 'srv_diag_01',
		slug: 'highfield-mri-neuro',
		title: '3.0T High-Field Neuro & Soft Tissue MRI',
		description: 'Sub-millimeter multi-sequence magnetic resonance imaging for neurological, spinal, musculoskeletal, and oncological evaluation.',
		price_cents: 145000,
		category: 'diagnostics',
		duration_minutes: 90,
		badge: 'Advanced Imaging',
		features: [
			'3.0 Tesla ultra-high resolution',
			'Real-time contrast enhancement',
			'DICOM cloud PACS push',
			'Board-certified radiologist read'
		],
		sla_turnaround: '< 2 Hours Radiologist Read'
	},
	{
		id: 'srv_diag_02',
		slug: 'ultrafast-64ct',
		title: '64-Slice Dynamic Volumetric CT',
		description: 'High-speed diagnostic computed tomography with 3D anatomical reconstruction and vascular angiography.',
		price_cents: 98000,
		category: 'diagnostics',
		duration_minutes: 60,
		badge: 'Precision Diag',
		features: [
			'0.35s gantry rotation speed',
			'3D orthopedic vascular rendering',
			'Sedation safety monitoring',
			'Instant R2 DICOM sync'
		],
		sla_turnaround: '< 1 Hour Direct Report'
	},
	{
		id: 'srv_diag_03',
		slug: 'digital-direct-radiography',
		title: 'High-Definition Digital Radiography (X-Ray)',
		description: 'Zero-latency digital direct radiology with AI-assisted pulmonary and skeletal artifact detection.',
		price_cents: 32000,
		category: 'diagnostics',
		duration_minutes: 25,
		badge: 'Zero Latency',
		features: [
			'Sub-second exposure capture',
			'Dual-view orthogonal imaging',
			'Instant edge PACS availability',
			'Cloud client access'
		],
		sla_turnaround: 'Instant Edge Push'
	},
	{
		id: 'srv_surg_01',
		slug: 'laparoscopic-minimally-invasive',
		title: 'Minimally Invasive Laparoscopic Surgery',
		description: 'Precision HD endoscopy and laparoscopic surgical suite offering ultra-fast recovery times, minimal pain, and smaller incisions.',
		price_cents: 220000,
		category: 'surgery',
		duration_minutes: 120,
		badge: 'Surgical Suite',
		features: [
			'4K Ultra-HD endoscopic optics',
			'Advanced bipolar vessel sealing',
			'Continuous multivariable capnography',
			'Dedicated post-op recovery suite'
		],
		sla_turnaround: 'Same-day Discharge Option'
	},
	{
		id: 'srv_surg_02',
		slug: 'orthopedic-tplo-reconstruction',
		title: 'Complex Orthopedic & TPLO Reconstruction',
		description: 'Specialized cruciate ligament stabilization, arthroscopy, and robotic-assisted corrective osteotomy.',
		price_cents: 360000,
		category: 'surgery',
		duration_minutes: 180,
		badge: 'Specialty Suite',
		features: [
			'Pre-op 3D CT surgical template',
			'Titanium locking plate hardware',
			'Intraoperative fluoroscopy verification',
			'Structured rehab recovery protocol'
		],
		sla_turnaround: 'Overnight Monitored Care'
	},
	{
		id: 'srv_tele_01',
		slug: '247-instant-teletriage',
		title: '24/7 Priority Emergency Tele-Triage',
		description: 'Instant live encrypted video and telemetry consult with a licensed emergency veterinary specialist within 3 minutes.',
		price_cents: 7500,
		category: 'teletriage',
		duration_minutes: 20,
		badge: 'Active 24/7',
		features: [
			'< 3 minute connect SLA',
			'Direct R2 image/video attachment review',
			'Prescription edge routing',
			'Immediate ER bay pre-activation'
		],
		sla_turnaround: '< 3 Mins Connect'
	},
	{
		id: 'srv_tele_02',
		slug: 'asynchronous-specialist-review',
		title: 'Asynchronous Specialist Second Opinion',
		description: 'Comprehensive digital audit of prior medical histories, laboratory workups, and DICOM images by a board-certified specialist.',
		price_cents: 16000,
		category: 'teletriage',
		duration_minutes: 40,
		badge: 'Deep Review',
		features: [
			'Full multi-clinic record consolidation',
			'DICOM imaging re-analysis',
			'Formal written prognosis document',
			'Prescription adjustments'
		],
		sla_turnaround: '< 12 Hours Turnaround'
	}
];

export const DEFAULT_SPECIALISTS: Specialist[] = [
	{
		id: 'spec_01',
		name: 'Dr. Elena Rostova',
		title: 'Chief of Veterinary Surgery & Orthopedics',
		specialty: 'Orthopedic & Soft Tissue Surgery',
		credentials: 'DVM, DACVS-SA, PhD',
		bio: 'Pioneer in minimally invasive canine arthroscopy and 3D-guided osteotomy with over 14 years of tertiary clinical experience.',
		board_cert: 'Diplomate, American College of Veterinary Surgeons',
		status: 'On Duty',
		avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
	},
	{
		id: 'spec_02',
		name: 'Dr. Marcus Vance',
		title: 'Director of Diagnostic Imaging & Radiology',
		specialty: 'Diagnostic Radiology & High-Field MRI',
		credentials: 'DVM, DACVR, MS',
		bio: 'Specialized in high-field neuro-imaging and pediatric thoracic ultrasound. Former academic clinical lead at Cornell University.',
		board_cert: 'Diplomate, American College of Veterinary Radiology',
		status: 'On Duty',
		avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
	},
	{
		id: 'spec_03',
		name: 'Dr. Ananya Chen',
		title: 'Lead Critical Care & Emergency Triage Specialist',
		specialty: 'Emergency & Critical Care Medicine',
		credentials: 'DVM, DACVECC',
		bio: 'Expert in acute trauma resuscitation, continuous cardiovascular life support, and rapid telemetry-assisted triage protocols.',
		board_cert: 'Diplomate, American College of Veterinary Emergency & Critical Care',
		status: 'On Duty',
		avatar_url: 'https://images.unsplash.com/photo-1594824813580-b8c736f86a99?auto=format&fit=crop&q=80&w=400'
	},
	{
		id: 'spec_04',
		name: 'Dr. Julian Thorne',
		title: 'Internal Medicine & Precision Oncology Clinician',
		specialty: 'Small Animal Internal Medicine & Oncology',
		credentials: 'BVSc, DACVIM (SAIM)',
		bio: 'Focuses on complex endocrine disorders, non-invasive targeted therapies, and precision oncology protocols.',
		board_cert: 'Diplomate, American College of Veterinary Internal Medicine',
		status: 'In Consult',
		avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400'
	}
];

export const SAMPLE_INITIAL_APPOINTMENTS: Appointment[] = [
	{
		id: 'apt_demo_01',
		reference_code: 'MKN-7821-CF',
		client_name: 'Sarah Jenkins',
		email: 's.jenkins@example.com',
		phone: '+1 (555) 234-5678',
		pet_name: 'Zeus',
		species: 'Canine',
		breed: 'German Shepherd',
		age_years: 4.5,
		weight_kg: 34.2,
		service_type: 'highfield-mri-neuro',
		urgency_level: 'priority',
		symptoms: 'Acute hindlimb ataxia and spinal reflex asymmetry over past 48h.',
		scheduled_at: '2026-08-24',
		time_slot: '09:00 AM',
		status: 'confirmed',
		clinician_assigned: 'Dr. Marcus Vance',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		attachments: [
			{
				id: 'att_01',
				appointment_id: 'apt_demo_01',
				r2_object_key: 'records/apt_demo_01/prior-lumbar-radiograph.pdf',
				file_name: 'prior-lumbar-radiograph.pdf',
				mime_type: 'application/pdf',
				size_bytes: 2450000,
				created_at: new Date().toISOString()
			}
		]
	},
	{
		id: 'apt_demo_02',
		reference_code: 'MKN-9412-CF',
		client_name: 'David Miller',
		email: 'd.miller@example.com',
		phone: '+1 (555) 876-5432',
		pet_name: 'Cleo',
		species: 'Feline',
		breed: 'Ragdoll',
		age_years: 3.0,
		weight_kg: 4.8,
		service_type: 'comprehensive-wellness-exam',
		urgency_level: 'routine',
		symptoms: 'Annual preventative health check and routine blood chemistry workup.',
		scheduled_at: '2026-08-24',
		time_slot: '11:30 AM',
		status: 'confirmed',
		clinician_assigned: 'Dr. Julian Thorne',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'apt_demo_03',
		reference_code: 'MKN-3109-CF',
		client_name: 'Amara Patel',
		email: 'amara.patel@example.com',
		phone: '+1 (555) 912-3456',
		pet_name: 'Apollo',
		species: 'Canine',
		breed: 'Golden Retriever',
		age_years: 2.0,
		weight_kg: 29.5,
		service_type: 'laparoscopic-minimally-invasive',
		urgency_level: 'routine',
		symptoms: 'Preventive prophylactic laparoscopic gastropexy and baseline ultrasound.',
		scheduled_at: '2026-08-25',
		time_slot: '02:00 PM',
		status: 'confirmed',
		clinician_assigned: 'Dr. Elena Rostova',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

export const DEFAULT_TRIAGE_CAPACITY: TriageCapacity = {
	status: 'Optimal',
	activeSpecialists: 7,
	erBedCapacityPercent: 84,
	avgTriageLatencySeconds: 134,
	edgeNode: 'IAD-01',
	triageQueueCount: 2
};

export const CLINICAL_TECH_SPECS = [
	{
		name: 'Siemens Magnetom 3.0T High-Field MRI',
		category: 'Advanced Neuro & Soft Tissue',
		specs: ['Sub-millimeter resolution', 'Zero-boiloff cryogen', 'Edge DICOM streaming', 'Pediatric coils'],
		status: 'Operational (Calibration Validated)'
	},
	{
		name: 'Canon Aquilion 64-Slice Spectral CT',
		category: 'Volumetric Tomography',
		specs: ['0.35s full rotation', 'Ultra-low radiation dose', '3D Bone & Angio render', 'Direct R2 PACS storage'],
		status: 'Operational (Active Bay 2)'
	},
	{
		name: 'Olympus 4K Laparoscopic Tower',
		category: 'Minimally Invasive Suites',
		specs: ['Dual-wavelength visualization', 'Integrated harmonic scalpel', 'Zero-spill insufflation', 'HD archival'],
		status: 'Sterilized & Ready (Suite A)'
	},
	{
		name: 'IDEXX Catalyst One & ProCyte Dx Suite',
		category: 'In-House Edge Pathology',
		specs: ['8-minute full chemistry', '27-parameter CBC laser flow', 'Coagulation assays', 'Automated D1 logging'],
		status: 'Continuous Self-Calibrating'
	}
];

export const PRICING_WELLNESS_PLANS = [
	{
		id: 'plan_essential',
		name: 'Essential Edge Care',
		tagline: 'Foundational preventative wellness for young, active companions.',
		monthly_price_dollars: 49,
		annual_price_dollars: 529,
		popular: false,
		features: [
			'Unlimited routine clinical triage & exams',
			'Annual core vaccination series & titers',
			'Comprehensive fecal & heartworm antigen screening',
			'10% off all in-house diagnostics & imaging',
			'Direct Cloudflare R2 EHR portal access'
		],
		cta: 'Enroll in Essential'
	},
	{
		id: 'plan_comprehensive',
		name: 'Clinical Comprehensive',
		tagline: 'Complete preventative & diagnostic umbrella for adult pets.',
		monthly_price_dollars: 89,
		annual_price_dollars: 960,
		popular: true,
		badge: 'Most Popular',
		features: [
			'Everything in Essential Edge Care',
			'Semi-annual senior/adult 28-point blood panel',
			'Annual full-body digital direct radiography (X-Ray)',
			'Full ultrasonic dental scale, polish & charting',
			'24/7 Priority Emergency Tele-Triage access (Zero wait)',
			'15% off advanced surgical & MRI procedures'
		],
		cta: 'Enroll in Comprehensive'
	},
	{
		id: 'plan_platinum',
		name: 'Platinum Surgical & Diagnostics',
		tagline: 'Tertiary-grade coverage with immediate specialist surgical access.',
		monthly_price_dollars: 149,
		annual_price_dollars: 1599,
		popular: false,
		features: [
			'Everything in Clinical Comprehensive',
			'Annual 64-Slice CT or 3.0T MRI diagnostic credit',
			'Priority guaranteed ER surgical suite allocation',
			'Direct cell hotline to board-certified attending specialists',
			'Continuous biometric vital telemetry monitoring kit',
			'20% off all inpatient hospitalizations'
		],
		cta: 'Enroll in Platinum'
	}
];
