import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDatabase } from '$lib/server/db';

export const GET: RequestHandler = async ({ params, platform }) => {
	const ref = params.ref;
	if (!ref) {
		throw error(400, 'Reference identifier required');
	}

	const db = getDatabase(platform);
	const appointment = await db.getAppointmentByRef(ref);

	if (!appointment) {
		return json({ success: false, error: 'No consultation record found matching this identifier.' }, { status: 404 });
	}

	return json({
		success: true,
		appointment
	});
};
