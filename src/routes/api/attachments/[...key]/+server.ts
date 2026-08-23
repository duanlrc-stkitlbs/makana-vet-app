import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getR2Storage } from '$lib/server/r2';

export const GET: RequestHandler = async ({ params, platform }) => {
	const key = params.key;
	if (!key) {
		throw error(400, 'Object key is required');
	}

	const r2 = getR2Storage(platform);
	const object = await r2.getObject(key);

	if (!object) {
		throw error(404, 'Medical record attachment not found in R2 storage.');
	}

	const headers = new Headers();
	headers.set('Content-Type', object.mimeType);
	headers.set('Content-Length', String(object.size));
	headers.set('Cache-Control', 'public, max-age=86400, immutable');
	// Inline or attachment disposition
	const filename = key.split('/').pop() || 'attachment';
	headers.set('Content-Disposition', `inline; filename="${filename}"`);

	return new Response(object.data as any, {
		status: 200,
		headers
	});
};
