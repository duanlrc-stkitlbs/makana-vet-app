import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDatabase } from '$lib/server/db';
import { getR2Storage, validateUploadFile } from '$lib/server/r2';
import type { SpeciesType, UrgencyLevel } from '$lib/types';

export const GET: RequestHandler = async ({ url, platform }) => {
	const db = getDatabase(platform);
	const search = url.searchParams.get('search');
	const limit = parseInt(url.searchParams.get('limit') || '20', 10);

	if (search) {
		const found = await db.getAppointmentByRef(search);
		return json({ appointments: found ? [found] : [] });
	}

	const appointments = await db.getAppointments(limit);
	return json({ appointments });
};

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = getDatabase(platform);
	const r2 = getR2Storage(platform);

	try {
		const contentType = request.headers.get('content-type') || '';
		let clientName = '';
		let email = '';
		let phone = '';
		let petName = '';
		let species: SpeciesType = 'Canine';
		let breed = '';
		let ageYears: number | undefined = undefined;
		let weightKg: number | undefined = undefined;
		let serviceType = '';
		let urgencyLevel: UrgencyLevel = 'routine';
		let symptoms = '';
		let scheduledAt = '';
		let timeSlot = '';
		let clinicianAssigned = 'Attending Specialist';
		const filesToUpload: File[] = [];

		if (contentType.includes('multipart/form-data')) {
			const formData = await request.formData();

			clientName = (formData.get('client_name') as string) || '';
			email = (formData.get('email') as string) || '';
			phone = (formData.get('phone') as string) || '';
			petName = (formData.get('pet_name') as string) || '';
			species = ((formData.get('species') as string) || 'Canine') as SpeciesType;
			breed = (formData.get('breed') as string) || '';
			const ageStr = formData.get('age_years') as string;
			if (ageStr) ageYears = parseFloat(ageStr);
			const weightStr = formData.get('weight_kg') as string;
			if (weightStr) weightKg = parseFloat(weightStr);
			serviceType = (formData.get('service_type') as string) || 'comprehensive-wellness-exam';
			urgencyLevel = ((formData.get('urgency_level') as string) || 'routine') as UrgencyLevel;
			symptoms = (formData.get('symptoms') as string) || '';
			scheduledAt = (formData.get('scheduled_at') as string) || new Date().toISOString().split('T')[0];
			timeSlot = (formData.get('time_slot') as string) || '09:00 AM';
			clinicianAssigned = (formData.get('clinician_assigned') as string) || 'Attending Specialist';

			// Check for files
			const allFiles = formData.getAll('attachments');
			for (const item of allFiles) {
				if (item instanceof File && item.size > 0) {
					const validation = validateUploadFile(item);
					if (!validation.valid) {
						return json({ success: false, error: validation.error }, { status: 400 });
					}
					filesToUpload.push(item);
				}
			}
		} else {
			const body = await request.json();
			clientName = body.client_name;
			email = body.email;
			phone = body.phone;
			petName = body.pet_name;
			species = body.species || 'Canine';
			breed = body.breed;
			ageYears = body.age_years ? parseFloat(body.age_years) : undefined;
			weightKg = body.weight_kg ? parseFloat(body.weight_kg) : undefined;
			serviceType = body.service_type || 'comprehensive-wellness-exam';
			urgencyLevel = body.urgency_level || 'routine';
			symptoms = body.symptoms;
			scheduledAt = body.scheduled_at || new Date().toISOString().split('T')[0];
			timeSlot = body.time_slot || '09:00 AM';
			clinicianAssigned = body.clinician_assigned || 'Attending Specialist';
		}

		// Validation
		if (!clientName.trim()) {
			return json({ success: false, error: 'Client name is required.' }, { status: 400 });
		}
		if (!email.trim() || !email.includes('@')) {
			return json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
		}
		if (!phone.trim()) {
			return json({ success: false, error: 'Contact phone number is required.' }, { status: 400 });
		}
		if (!petName.trim()) {
			return json({ success: false, error: 'Pet / Patient name is required.' }, { status: 400 });
		}
		if (!serviceType.trim()) {
			return json({ success: false, error: 'Service selection is required.' }, { status: 400 });
		}

		// Generate a clean reference code (e.g. MKN-8942-CF)
		const refCode = `MKN-${Math.floor(1000 + Math.random() * 9000)}-CF`;

		// 1. Create Appointment in D1
		const newAppointment = await db.createAppointment({
			reference_code: refCode,
			client_name: clientName.trim(),
			email: email.trim(),
			phone: phone.trim(),
			pet_name: petName.trim(),
			species,
			breed: breed.trim(),
			age_years: ageYears,
			weight_kg: weightKg,
			service_type: serviceType,
			urgency_level: urgencyLevel,
			symptoms: symptoms.trim(),
			scheduled_at: scheduledAt,
			time_slot: timeSlot,
			status: 'confirmed',
			clinician_assigned: clinicianAssigned
		});

		// 2. Upload file attachments to R2 & save references in D1
		const uploadedAttachments = [];
		for (const file of filesToUpload) {
			const uploadResult = await r2.uploadRecord(newAppointment.id, file);
			const attachmentRecord = await db.addAttachment({
				appointment_id: newAppointment.id,
				r2_object_key: uploadResult.key,
				file_name: uploadResult.fileName,
				mime_type: uploadResult.mimeType,
				size_bytes: uploadResult.sizeBytes
			});
			uploadedAttachments.push(attachmentRecord);
		}

		newAppointment.attachments = uploadedAttachments;

		return json({
			success: true,
			appointment: newAppointment,
			reference_code: refCode,
			message: 'Consultation intake confirmed and synchronized to edge D1 & R2.'
		});
	} catch (err: any) {
		console.error('Error creating appointment:', err);
		return json(
			{
				success: false,
				error: err.message || 'Internal edge error during appointment creation.'
			},
			{ status: 500 }
		);
	}
};
