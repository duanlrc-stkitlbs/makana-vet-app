import type { Service, Specialist, Appointment, TriageCapacity } from '$lib/types';

export const DEFAULT_SERVICES: Service[] = [
	{
		id: 'srv_prev_01',
		slug: 'comprehensive-wellness-exam',
		title: 'Comprehensive Nose-to-Tail Wellness Exam',
		description: 'Full physical examination, vitals check, coat & skin review, ocular & dental grading, and tailored nutritional guidance.',
		price_cents: 6500,
		category: 'preventive',
		duration_minutes: 30,
		badge: 'Routine Care',
		features: [
			'Full 10-point physical examination',
			'Cardiovascular auscultation',
			'Weight & nutritional assessment',
			'Digital vaccination record update'
		],
		sla_turnaround: 'Immediate Summary'
	},
	{
		id: 'srv_prev_02',
		slug: 'vaccine-microchip-package',
		title: 'Core Vaccines & Lifetime Microchip Implantation',
		description: 'Age-appropriate core vaccines (Rabies, DHPP / FVRCP) paired with universal microchip registration.',
		price_cents: 5500,
		category: 'preventive',
		duration_minutes: 20,
		badge: 'Preventive',
		features: [
			'Core immunization boosters',
			'Universal microchip implantation',
			'Free lifetime pet registry',
			'Vaccination certificate in portal'
		],
		sla_turnaround: 'Same-Day Certificate'
	},
	{
		id: 'srv_prev_03',
		slug: 'senior-pet-golden-years',
		title: 'Senior Pet Golden Years Consultation',
		description: 'Targeted physical and cognitive evaluation tailored for senior companions, including mobility assessment.',
		price_cents: 8500,
		category: 'preventive',
		duration_minutes: 40,
		badge: 'Senior Care',
		features: [
			'Mobility & joint arthritis screening',
			'Cognitive & sensory health review',
			'Chronic organ health evaluation',
			'Custom senior wellness plan'
		],
		sla_turnaround: 'Same-Day Plan'
	},
	{
		id: 'srv_dent_01',
		slug: 'ultrasonic-dental-cleaning',
		title: 'Professional Ultrasonic Dental Cleaning & Polish',
		description: 'Subgingival ultrasonic scaling, tooth polishing, oral exam, and dental health charting under safe monitored anesthesia.',
		price_cents: 29000,
		category: 'dental',
		duration_minutes: 60,
		badge: 'Dental Health',
		features: [
			'Full-mouth ultrasonic scaling',
			'Enamel polishing & fluoride application',
			'Subgingival probe & periodontal charting',
			'Continuous vital signs monitoring'
		],
		sla_turnaround: 'Same-Day Discharge'
	},
	{
		id: 'srv_surg_01',
		slug: 'routine-spay-neuter',
		title: 'Routine Spay & Neuter Procedure',
		description: 'Safe elective sterilization surgery in our sterile surgical suite with pre-anesthetic blood screening and multimodal pain relief.',
		price_cents: 25000,
		category: 'surgery',
		duration_minutes: 60,
		badge: 'Standard Surgery',
		features: [
			'Pre-anesthetic blood screening',
			'Multimodal continuous anesthesia',
			'Sterile dedicated surgical suite',
			'Post-op recovery monitoring & pain kit'
		],
		sla_turnaround: 'Same-Day Discharge'
	},
	{
		id: 'srv_surg_02',
		slug: 'minor-soft-tissue-surgery',
		title: 'Minor Soft Tissue Surgery & Lump Removal',
		description: 'Excision of skin masses, cysts, minor laceration repair, and preparation for diagnostic histopathology.',
		price_cents: 34000,
		category: 'surgery',
		duration_minutes: 45,
		badge: 'Outpatient Surgery',
		features: [
			'Local / general sedation protocol',
			'Sterile surgical excision & closure',
			'Biopsy sample prep for pathology',
			'Comprehensive take-home medication'
		],
		sla_turnaround: 'Same-Day Discharge'
	},
	{
		id: 'srv_diag_01',
		slug: 'digital-radiography-xray',
		title: 'In-House High-Definition Digital X-Rays',
		description: 'Rapid, low-stress digital radiography for chest, abdomen, orthopedic, or foreign body evaluation.',
		price_cents: 16000,
		category: 'diagnostics',
		duration_minutes: 25,
		badge: 'Same-Day Imaging',
		features: [
			'Dual-view high-definition imaging',
			'Sub-second digital exposure',
			'Immediate veterinarian review',
			'Instant R2 pet portal access'
		],
		sla_turnaround: 'Instant Doctor Review'
	},
	{
		id: 'srv_diag_02',
		slug: 'in-clinic-blood-chemistry',
		title: 'Same-Day In-Clinic Blood & Chemistry Panel',
		description: 'Rapid on-site complete blood count (CBC) and comprehensive organ chemistry profiles with 15-minute turnaround.',
		price_cents: 12000,
		category: 'diagnostics',
		duration_minutes: 20,
		badge: '15-Min Results',
		features: [
			'Complete Blood Count (CBC)',
			'Kidney, liver & glucose chemistry',
			'Electrolyte balance profiling',
			'Immediate consult & treatment plan'
		],
		sla_turnaround: '15-Min In-Clinic'
	},
	{
		id: 'srv_diag_03',
		slug: 'dermatology-ear-workup',
		title: 'Dermatology, Ear & Allergy Workup',
		description: 'Microscopic skin scrape, ear cytology, and targeted allergy identification for itchy or uncomfortable pets.',
		price_cents: 8500,
		category: 'diagnostics',
		duration_minutes: 30,
		badge: 'Skin & Allergy',
		features: [
			'In-house microscopic cytology',
			'Ear canal otoscopic evaluation',
			'Custom medicated treatment protocol',
			'Dietary elimination guidance'
		],
		sla_turnaround: 'Same-Day Results'
	},
	{
		id: 'srv_urg_01',
		slug: 'same-day-urgent-visit',
		title: 'Same-Day Sick Pet & Urgent Care Visit',
		description: 'Priority daytime appointment for sudden lethargy, vomiting, limping, minor wounds, or sudden eye irritation.',
		price_cents: 9500,
		category: 'urgent_care',
		duration_minutes: 30,
		badge: 'Urgent Day Slot',
		features: [
			'Priority check-in upon arrival',
			'Focused sick pet examination',
			'Direct in-house lab & X-ray routing',
			'Immediate supportive care plan'
		],
		sla_turnaround: 'Immediate Attention'
	}
];

export const DEFAULT_SPECIALISTS: Specialist[] = [
	{
		id: 'spec_01',
		name: 'Dr. Maya Lin',
		title: 'Lead Veterinarian & Clinic Founder',
		specialty: 'General Practice & Preventive Medicine',
		credentials: 'DVM, Fear-Free Certified',
		bio: 'Passionate about low-stress veterinary visits, wellness protocols, and gentle routine soft-tissue surgeries for dogs and cats.',
		board_cert: 'Fear-Free Certified Professional',
		status: 'On Duty',
		avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
	},
	{
		id: 'spec_02',
		name: 'Dr. Marcus Vance',
		title: 'Associate Veterinarian',
		specialty: 'Internal Health & In-House Diagnostics',
		credentials: 'DVM, CVA',
		bio: 'Focuses on routine diagnostics, digital radiography, and managing chronic conditions in family pets with clear, friendly guidance.',
		board_cert: 'Member, American Veterinary Medical Association (AVMA)',
		status: 'On Duty',
		avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
	},
	{
		id: 'spec_03',
		name: 'Dr. Sarah Jenkins',
		title: 'Senior Pet & Integrative Care Veterinarian',
		specialty: 'Geriatric Health & Acupuncture',
		credentials: 'DVM, CVA (Chi University)',
		bio: 'Dedicated to keeping senior pets comfortable and active with gentle mobility therapy, pain management, and nutritional support.',
		board_cert: 'Certified Veterinary Acupuncturist (CVA)',
		status: 'In Consult',
		avatar_url: 'https://images.unsplash.com/photo-1594824813580-b8c736f86a99?auto=format&fit=crop&q=80&w=400'
	},
	{
		id: 'spec_04',
		name: 'Jessica Rodriguez',
		title: 'Head Veterinary Technician & Care Lead',
		specialty: 'Dental Prophylaxis & Patient Comfort',
		credentials: 'RVT, Fear-Free Certified',
		bio: 'Oversees surgical nursing, dental scale & polishes, and ensures every patient receives warm, loving care during their visit.',
		board_cert: 'Registered Veterinary Technician (RVT)',
		status: 'On Duty',
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
		pet_name: 'Milo',
		species: 'Canine',
		breed: 'Golden Retriever',
		age_years: 2.5,
		weight_kg: 31.0,
		service_type: 'vaccine-microchip-package',
		urgency_level: 'routine',
		symptoms: 'Annual vaccine boosters and routine dental checkup.',
		scheduled_at: '2026-08-24',
		time_slot: '09:00 AM',
		status: 'confirmed',
		clinician_assigned: 'Dr. Maya Lin',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		attachments: [
			{
				id: 'att_01',
				appointment_id: 'apt_demo_01',
				r2_object_key: 'records/apt_demo_01/prior-vaccine-record.pdf',
				file_name: 'prior-vaccine-record.pdf',
				mime_type: 'application/pdf',
				size_bytes: 1450000,
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
		pet_name: 'Luna',
		species: 'Feline',
		breed: 'Domestic Shorthair',
		age_years: 4.0,
		weight_kg: 4.2,
		service_type: 'comprehensive-wellness-exam',
		urgency_level: 'routine',
		symptoms: 'Routine wellness check, nail trim, and weight check.',
		scheduled_at: '2026-08-24',
		time_slot: '11:30 AM',
		status: 'confirmed',
		clinician_assigned: 'Dr. Marcus Vance',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'apt_demo_03',
		reference_code: 'MKN-3109-CF',
		client_name: 'Amara Patel',
		email: 'amara.patel@example.com',
		phone: '+1 (555) 912-3456',
		pet_name: 'Buster',
		species: 'Canine',
		breed: 'Beagle',
		age_years: 5.0,
		weight_kg: 13.5,
		service_type: 'ultrasonic-dental-cleaning',
		urgency_level: 'routine',
		symptoms: 'Dental cleaning consultation and pre-anesthetic blood work.',
		scheduled_at: '2026-08-25',
		time_slot: '02:00 PM',
		status: 'confirmed',
		clinician_assigned: 'Dr. Sarah Jenkins',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

export const DEFAULT_TRIAGE_CAPACITY: TriageCapacity = {
	status: 'Open & Welcoming',
	activeSpecialists: 3,
	erBedCapacityPercent: 45,
	avgTriageLatencySeconds: 8,
	edgeNode: 'IAD-01',
	triageQueueCount: 1
};

export const CLINICAL_TECH_SPECS = [
	{
		name: 'Sound HD High-Definition Digital Radiography (X-Ray)',
		category: 'In-House Imaging',
		specs: ['Sub-second digital exposure capture', 'Ultra-low stress positioning', 'Instant doctor chairside review', 'Zero-wait Cloudflare R2 pet portal sync'],
		status: 'Operational (Ready for Imaging)'
	},
	{
		name: 'IDEXX Catalyst One & ProCyte Dx Laboratory Suite',
		category: 'Point-of-Care Pathology',
		specs: ['15-minute full blood chemistry & CBC', 'Comprehensive organ & electrolyte panels', 'In-house urinalysis & fecal screening', 'Automated Cloudflare D1 record sync'],
		status: 'Self-Calibrating (Same-Day Results)'
	},
	{
		name: 'Midmark Ultrasonic Dental Scaler & High-Speed Polisher',
		category: 'Dental Prophylaxis',
		specs: ['Gentle subgingival plaque scaling', 'High-speed enamel polishing', 'Digital dental probe charting', 'Safe isoflurane anesthetic delivery'],
		status: 'Sterilized & Ready (Suite B)'
	},
	{
		name: 'Dedicated Sterile Surgical Suite with Multi-Parameter Vital Monitoring',
		category: 'Soft-Tissue Surgery',
		specs: ['Continuous ECG, SpO2 & capnography', 'Electrosurgical coagulation unit', 'Heated recovery warming pads', 'Multimodal pain management kit'],
		status: 'Sterilized & Prepared (Suite A)'
	}
];

export const PRICING_WELLNESS_PLANS = [
	{
		id: 'plan_puppy_kitten',
		name: 'Puppy & Kitten Starter Plan',
		tagline: 'Complete foundational protection for your new companion’s critical first year.',
		monthly_price_dollars: 39,
		annual_price_dollars: 420,
		popular: false,
		features: [
			'Unlimited routine wellness exams & checkups',
			'Full puppy/kitten core vaccine series (Rabies, DHPP/FVRCP)',
			'Deworming series & parasite fecal screening',
			'Universal microchip implantation & lifetime registry',
			'10% off elective Spay or Neuter surgery',
			'Direct Cloudflare R2 digital vaccination passport'
		],
		cta: 'Enroll Puppy / Kitten'
	},
	{
		id: 'plan_adult_companion',
		name: 'Adult Companion Complete',
		tagline: 'Year-round preventative care, vaccines, and dental health for adult dogs and cats.',
		monthly_price_dollars: 59,
		annual_price_dollars: 640,
		popular: true,
		badge: 'Most Popular',
		features: [
			'Unlimited routine wellness & preventative exams',
			'Annual core vaccine boosters & heartworm screening',
			'Annual full ultrasonic dental cleaning & polish',
			'Annual baseline blood chemistry & urinalysis panel',
			'10% off all in-house digital X-rays & sick visits',
			'Priority scheduling & digital medical records access'
		],
		cta: 'Enroll Adult Companion'
	},
	{
		id: 'plan_senior_care',
		name: 'Senior Pet Golden Years',
		tagline: 'Proactive comfort, arthritis care, and organ health monitoring for aging companions.',
		monthly_price_dollars: 79,
		annual_price_dollars: 860,
		popular: false,
		features: [
			'Everything in Adult Companion Complete',
			'Semi-annual comprehensive senior blood & organ panels',
			'Annual dual-view digital X-ray (mobility & chest)',
			'Semi-annual arthritis & joint mobility assessments',
			'15% off chronic pain medications & prescription diets',
			'Dedicated senior care advice & care consultations'
		],
		cta: 'Enroll Senior Pet'
	}
];

