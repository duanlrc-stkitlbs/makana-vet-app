import type { PageServerLoad } from './$types';
import { getDatabase } from '$lib/server/db';
import { DEFAULT_TRIAGE_CAPACITY } from '$lib/data/mock-data';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDatabase(platform);

	try {
		// Attempt to fetch services & specialists from D1 database
		const [services, specialists] = await Promise.all([
			db.getServices(),
			db.getSpecialists()
		]);

		return {
			services,
			specialists,
			triageCapacity: DEFAULT_TRIAGE_CAPACITY
		};
	} catch (err) {
		console.error('Error in +page.server.ts load function:', err);
		return {
			services: [],
			specialists: [],
			triageCapacity: DEFAULT_TRIAGE_CAPACITY
		};
	}
};
