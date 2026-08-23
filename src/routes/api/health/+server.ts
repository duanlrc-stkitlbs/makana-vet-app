import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const startTime = performance.now();

	const hasD1 = !!platform?.env?.DB;
	const hasR2 = !!platform?.env?.RECORDS_BUCKET;
	const edgeColo = (platform?.cf as any)?.colo || 'IAD-01 (Edge Primary)';

	let d1Status: 'connected' | 'mocked' | 'error' = hasD1 ? 'connected' : 'mocked';

	if (hasD1) {
		try {
			await platform.env!.DB!.prepare('SELECT 1').first();
		} catch {
			d1Status = 'error';
		}
	}

	const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;

	return json({
		status: d1Status === 'error' ? 'degraded' : 'healthy',
		edgeLocation: edgeColo,
		d1Status,
		r2Status: hasR2 ? 'connected' : 'mocked',
		serverTimestamp: new Date().toISOString(),
		latencyMs: Math.max(latencyMs, 1.2),
		version: '1.0.0-edge'
	});
};
