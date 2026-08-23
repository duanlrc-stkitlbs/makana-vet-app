import type { Service, Appointment, Specialist, Attachment } from '$lib/types';
import { DEFAULT_SERVICES, DEFAULT_SPECIALISTS, SAMPLE_INITIAL_APPOINTMENTS } from '$lib/data/mock-data';

// In-memory fallback stores for local development without D1 bindings
let localServices: Service[] = [...DEFAULT_SERVICES];
let localSpecialists: Specialist[] = [...DEFAULT_SPECIALISTS];
let localAppointments: Appointment[] = [...SAMPLE_INITIAL_APPOINTMENTS];
let localAttachments: Attachment[] = [
	{
		id: 'att_01',
		appointment_id: 'apt_demo_01',
		r2_object_key: 'records/apt_demo_01/prior-lumbar-radiograph.pdf',
		file_name: 'prior-lumbar-radiograph.pdf',
		mime_type: 'application/pdf',
		size_bytes: 2450000,
		created_at: new Date().toISOString()
	}
];

export interface DatabaseClient {
	getServices(category?: string): Promise<Service[]>;
	getServiceBySlug(slug: string): Promise<Service | null>;
	getSpecialists(): Promise<Specialist[]>;
	getAppointments(limit?: number): Promise<Appointment[]>;
	getAppointmentByRef(ref: string): Promise<Appointment | null>;
	createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment>;
	addAttachment(attachment: Omit<Attachment, 'id' | 'created_at'>): Promise<Attachment>;
	getAttachmentsForAppointment(appointmentId: string): Promise<Attachment[]>;
	seedDatabaseIfEmpty(): Promise<boolean>;
}

export function getDatabase(platform?: App.Platform): DatabaseClient {
	const db = platform?.env?.DB;

	if (db) {
		return {
			async getServices(category?: string): Promise<Service[]> {
				try {
					let query = 'SELECT * FROM services';
					let stmt;
					if (category && category !== 'all') {
						query += ' WHERE category = ? ORDER BY price_cents ASC';
						stmt = db.prepare(query).bind(category);
					} else {
						query += ' ORDER BY category ASC, price_cents ASC';
						stmt = db.prepare(query);
					}
					const { results } = await stmt.all();
					if (!results || results.length === 0) {
						// Auto-seed if empty
						await this.seedDatabaseIfEmpty();
						return DEFAULT_SERVICES.filter((s) => !category || category === 'all' || s.category === category);
					}
					return results.map((row: any) => ({
						id: String(row.id),
						slug: String(row.slug),
						title: String(row.title),
						description: String(row.description),
						price_cents: Number(row.price_cents),
						category: row.category,
						duration_minutes: Number(row.duration_minutes),
						badge: row.badge ? String(row.badge) : undefined,
						features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
						sla_turnaround: row.sla_turnaround ? String(row.sla_turnaround) : undefined
					}));
				} catch (err) {
					console.error('Error fetching services from D1:', err);
					return DEFAULT_SERVICES.filter((s) => !category || category === 'all' || s.category === category);
				}
			},

			async getServiceBySlug(slug: string): Promise<Service | null> {
				try {
					const row: any = await db.prepare('SELECT * FROM services WHERE slug = ?').bind(slug).first();
					if (!row) return null;
					return {
						id: String(row.id),
						slug: String(row.slug),
						title: String(row.title),
						description: String(row.description),
						price_cents: Number(row.price_cents),
						category: row.category,
						duration_minutes: Number(row.duration_minutes),
						badge: row.badge ? String(row.badge) : undefined,
						features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
						sla_turnaround: row.sla_turnaround ? String(row.sla_turnaround) : undefined
					};
				} catch (err) {
					console.error('Error fetching service by slug from D1:', err);
					return DEFAULT_SERVICES.find((s) => s.slug === slug) || null;
				}
			},

			async getSpecialists(): Promise<Specialist[]> {
				try {
					const { results } = await db.prepare('SELECT * FROM specialists ORDER BY id ASC').all();
					if (!results || results.length === 0) {
						return DEFAULT_SPECIALISTS;
					}
					return results.map((row: any) => ({
						id: String(row.id),
						name: String(row.name),
						title: String(row.title),
						specialty: String(row.specialty),
						credentials: String(row.credentials),
						bio: String(row.bio),
						board_cert: String(row.board_cert),
						status: row.status || 'On Duty',
						avatar_url: row.avatar_url ? String(row.avatar_url) : undefined
					}));
				} catch (err) {
					console.error('Error fetching specialists from D1:', err);
					return DEFAULT_SPECIALISTS;
				}
			},

			async getAppointments(limit = 10): Promise<Appointment[]> {
				try {
					const { results } = await db
						.prepare('SELECT * FROM appointments ORDER BY created_at DESC LIMIT ?')
						.bind(limit)
						.all();
					if (!results || results.length === 0) {
						return SAMPLE_INITIAL_APPOINTMENTS;
					}
					return results as Appointment[];
				} catch (err) {
					console.error('Error fetching appointments from D1:', err);
					return localAppointments.slice(0, limit);
				}
			},

			async getAppointmentByRef(ref: string): Promise<Appointment | null> {
				try {
					const row: any = await db
						.prepare('SELECT * FROM appointments WHERE reference_code = ? OR phone = ? OR email = ?')
						.bind(ref.trim(), ref.trim(), ref.trim().toLowerCase())
						.first();
					if (!row) return null;

					const { results: attachmentRows } = await db
						.prepare('SELECT * FROM attachments WHERE appointment_id = ?')
						.bind(row.id)
						.all();

					return {
						...row,
						attachments: (attachmentRows || []) as Attachment[]
					};
				} catch (err) {
					console.error('Error querying appointment by ref in D1:', err);
					const match = localAppointments.find(
						(a) =>
							a.reference_code.toLowerCase() === ref.toLowerCase() ||
							a.phone.replace(/\D/g, '') === ref.replace(/\D/g, '') ||
							a.email.toLowerCase() === ref.toLowerCase()
					);
					if (match) {
						match.attachments = localAttachments.filter((att) => att.appointment_id === match.id);
					}
					return match || null;
				}
			},

			async createAppointment(data): Promise<Appointment> {
				const id = 'apt_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
				const now = new Date().toISOString();
				const refCode = data.reference_code || `MKN-${Math.floor(1000 + Math.random() * 9000)}-CF`;

				await db
					.prepare(`
						INSERT INTO appointments (
							id, reference_code, client_name, email, phone, pet_name,
							species, breed, age_years, weight_kg, service_type,
							urgency_level, symptoms, scheduled_at, time_slot, status,
							clinician_assigned, created_at, updated_at
						) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					`)
					.bind(
						id,
						refCode,
						data.client_name,
						data.email.toLowerCase().trim(),
						data.phone,
						data.pet_name,
						data.species,
						data.breed || '',
						data.age_years || null,
						data.weight_kg || null,
						data.service_type,
						data.urgency_level || 'routine',
						data.symptoms || '',
						data.scheduled_at,
						data.time_slot,
						data.status || 'confirmed',
						data.clinician_assigned || 'Attending Specialist',
						now,
						now
					)
					.run();

				return {
					id,
					reference_code: refCode,
					client_name: data.client_name,
					email: data.email,
					phone: data.phone,
					pet_name: data.pet_name,
					species: data.species,
					breed: data.breed,
					age_years: data.age_years,
					weight_kg: data.weight_kg,
					service_type: data.service_type,
					urgency_level: data.urgency_level,
					symptoms: data.symptoms,
					scheduled_at: data.scheduled_at,
					time_slot: data.time_slot,
					status: data.status || 'confirmed',
					clinician_assigned: data.clinician_assigned || 'Attending Specialist',
					created_at: now,
					updated_at: now,
					attachments: []
				};
			},

			async addAttachment(data): Promise<Attachment> {
				const id = 'att_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
				const now = new Date().toISOString();

				await db
					.prepare(`
						INSERT INTO attachments (id, appointment_id, r2_object_key, file_name, mime_type, size_bytes, created_at)
						VALUES (?, ?, ?, ?, ?, ?, ?)
					`)
					.bind(id, data.appointment_id, data.r2_object_key, data.file_name, data.mime_type, data.size_bytes, now)
					.run();

				return {
					id,
					appointment_id: data.appointment_id,
					r2_object_key: data.r2_object_key,
					file_name: data.file_name,
					mime_type: data.mime_type,
					size_bytes: data.size_bytes,
					created_at: now
				};
			},

			async getAttachmentsForAppointment(appointmentId: string): Promise<Attachment[]> {
				try {
					const { results } = await db
						.prepare('SELECT * FROM attachments WHERE appointment_id = ? ORDER BY created_at DESC')
						.bind(appointmentId)
						.all();
					return (results || []) as Attachment[];
				} catch (err) {
					console.error('Error fetching attachments from D1:', err);
					return localAttachments.filter((a) => a.appointment_id === appointmentId);
				}
			},

			async seedDatabaseIfEmpty(): Promise<boolean> {
				try {
					const countResult: any = await db.prepare('SELECT count(*) as count FROM services').first();
					if (countResult && countResult.count > 0) {
						return false;
					}

					// Seed services
					for (const s of DEFAULT_SERVICES) {
						await db
							.prepare(`
								INSERT OR REPLACE INTO services (id, slug, title, description, price_cents, category, duration_minutes, badge, features, sla_turnaround)
								VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
							`)
							.bind(
								s.id,
								s.slug,
								s.title,
								s.description,
								s.price_cents,
								s.category,
								s.duration_minutes,
								s.badge || null,
								JSON.stringify(s.features),
								s.sla_turnaround || null
							)
							.run();
					}

					// Seed specialists
					for (const spec of DEFAULT_SPECIALISTS) {
						await db
							.prepare(`
								INSERT OR REPLACE INTO specialists (id, name, title, specialty, credentials, bio, board_cert, status, avatar_url)
								VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
							`)
							.bind(
								spec.id,
								spec.name,
								spec.title,
								spec.specialty,
								spec.credentials,
								spec.bio,
								spec.board_cert,
								spec.status,
								spec.avatar_url || null
							)
							.run();
					}

					return true;
				} catch (err) {
					console.error('Error seeding D1 database:', err);
					return false;
				}
			}
		};
	}

	// Fallback in-memory database for development when D1 binding is not loaded
	return {
		async getServices(category?: string): Promise<Service[]> {
			if (!category || category === 'all') return localServices;
			return localServices.filter((s) => s.category === category);
		},

		async getServiceBySlug(slug: string): Promise<Service | null> {
			return localServices.find((s) => s.slug === slug) || null;
		},

		async getSpecialists(): Promise<Specialist[]> {
			return localSpecialists;
		},

		async getAppointments(limit = 10): Promise<Appointment[]> {
			return localAppointments.slice(0, limit);
		},

		async getAppointmentByRef(ref: string): Promise<Appointment | null> {
			const needle = ref.trim().toLowerCase();
			const match = localAppointments.find(
				(a) =>
					a.reference_code.toLowerCase() === needle ||
					a.email.toLowerCase() === needle ||
					a.phone.replace(/\D/g, '') === needle.replace(/\D/g, '')
			);
			if (match) {
				const atts = localAttachments.filter((att) => att.appointment_id === match.id);
				return { ...match, attachments: atts };
			}
			return null;
		},

		async createAppointment(data): Promise<Appointment> {
			const id = 'apt_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
			const now = new Date().toISOString();
			const refCode = data.reference_code || `MKN-${Math.floor(1000 + Math.random() * 9000)}-CF`;

			const newAppointment: Appointment = {
				id,
				reference_code: refCode,
				client_name: data.client_name,
				email: data.email,
				phone: data.phone,
				pet_name: data.pet_name,
				species: data.species,
				breed: data.breed,
				age_years: data.age_years,
				weight_kg: data.weight_kg,
				service_type: data.service_type,
				urgency_level: data.urgency_level,
				symptoms: data.symptoms,
				scheduled_at: data.scheduled_at,
				time_slot: data.time_slot,
				status: data.status || 'confirmed',
				clinician_assigned: data.clinician_assigned || 'Dr. Elena Rostova',
				created_at: now,
				updated_at: now,
				attachments: []
			};

			localAppointments.unshift(newAppointment);
			return newAppointment;
		},

		async addAttachment(data): Promise<Attachment> {
			const id = 'att_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
			const now = new Date().toISOString();
			const newAtt: Attachment = {
				id,
				appointment_id: data.appointment_id,
				r2_object_key: data.r2_object_key,
				file_name: data.file_name,
				mime_type: data.mime_type,
				size_bytes: data.size_bytes,
				created_at: now
			};
			localAttachments.push(newAtt);
			return newAtt;
		},

		async getAttachmentsForAppointment(appointmentId: string): Promise<Attachment[]> {
			return localAttachments.filter((a) => a.appointment_id === appointmentId);
		},

		async seedDatabaseIfEmpty(): Promise<boolean> {
			return true;
		}
	};
}
