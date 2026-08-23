export type ServiceCategory = 'preventive' | 'surgery' | 'diagnostics' | 'urgent_care' | 'dental';

export type UrgencyLevel = 'routine' | 'sick_visit' | 'urgent_day';

export type SpeciesType = 'Canine' | 'Feline' | 'Exotic' | 'Avian' | 'Small Mammal';

export type AppointmentStatus = 'confirmed' | 'in_consultation' | 'completed' | 'cancelled';

export interface Service {
	id: string;
	slug: string;
	title: string;
	description: string;
	price_cents: number;
	category: ServiceCategory;
	duration_minutes: number;
	badge?: string;
	features: string[];
	sla_turnaround?: string;
}

export interface Attachment {
	id: string;
	appointment_id: string;
	r2_object_key: string;
	file_name: string;
	mime_type: string;
	size_bytes: number;
	created_at: string;
}

export interface Appointment {
	id: string;
	reference_code: string;
	client_name: string;
	email: string;
	phone: string;
	pet_name: string;
	species: SpeciesType;
	breed?: string;
	age_years?: number;
	weight_kg?: number;
	service_type: string;
	urgency_level: UrgencyLevel;
	symptoms?: string;
	scheduled_at: string;
	time_slot: string;
	status: AppointmentStatus;
	clinician_assigned?: string;
	created_at: string;
	updated_at: string;
	attachments?: Attachment[];
}

export interface Specialist {
	id: string;
	name: string;
	title: string;
	specialty: string;
	credentials: string;
	bio: string;
	board_cert: string;
	status: 'On Duty' | 'In Surgery' | 'In Consult' | 'On Call';
	avatar_url?: string;
}

export interface TriageCapacity {
	status: 'Open & Welcoming' | 'Busy / Normal Flow' | 'Urgent Slots Available' | 'Optimal' | 'Elevated' | 'Critical ER Priority';
	activeSpecialists: number;
	erBedCapacityPercent: number;
	avgTriageLatencySeconds: number;
	edgeNode: string;
	triageQueueCount: number;
}

export interface WellnessPlan {
	id: string;
	name: string;
	tagline: string;
	monthly_price_rand: number;
	annual_price_rand: number;
	popular: boolean;
	badge?: string;
	features: string[];
	cta: string;
}

export interface EdgeHealthResponse {
	status: 'healthy' | 'degraded';
	edgeLocation: string;
	d1Status: 'connected' | 'mocked' | 'error';
	r2Status: 'connected' | 'mocked' | 'error';
	serverTimestamp: string;
	latencyMs: number;
	version: string;
}


