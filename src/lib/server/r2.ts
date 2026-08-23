export const ALLOWED_MIME_TYPES = [
	'application/pdf',
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp'
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Megabytes

// Local in-memory storage fallback for local development
const localFileStore = new Map<string, { data: Uint8Array; mimeType: string; fileName: string }>();

export interface UploadValidationResult {
	valid: boolean;
	error?: string;
}

export function validateUploadFile(file: File): UploadValidationResult {
	if (!file || !(file instanceof File) || file.size === 0) {
		return { valid: false, error: 'No file provided or file is empty.' };
	}

	if (file.size > MAX_FILE_SIZE_BYTES) {
		return {
			valid: false,
			error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 10 MB.`
		};
	}

	const normalizedMime = file.type.toLowerCase();
	if (!ALLOWED_MIME_TYPES.includes(normalizedMime)) {
		return {
			valid: false,
			error: `Invalid file type "${file.type}". Allowed formats: PDF, JPEG, PNG, WEBP.`
		};
	}

	return { valid: true };
}

export function sanitizeFileName(name: string): string {
	return name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 100);
}

export interface R2Client {
	uploadRecord(
		appointmentId: string,
		file: File
	): Promise<{
		key: string;
		fileName: string;
		mimeType: string;
		sizeBytes: number;
	}>;
	getObject(key: string): Promise<{ data: Uint8Array | ReadableStream; mimeType: string; size: number } | null>;
	deleteObject(key: string): Promise<boolean>;
}

export function getR2Storage(platform?: App.Platform): R2Client {
	const bucket = platform?.env?.RECORDS_BUCKET;

	if (bucket) {
		return {
			async uploadRecord(appointmentId: string, file: File) {
				const sanitized = sanitizeFileName(file.name);
				const timestamp = Date.now();
				const key = `records/${appointmentId}/${timestamp}-${sanitized}`;
				const arrayBuffer = await file.arrayBuffer();

				await bucket.put(key, arrayBuffer, {
					httpMetadata: {
						contentType: file.type || 'application/octet-stream'
					},
					customMetadata: {
						originalName: file.name,
						appointmentId,
						uploadedAt: new Date().toISOString()
					}
				});

				return {
					key,
					fileName: file.name,
					mimeType: file.type,
					sizeBytes: file.size
				};
			},

			async getObject(key: string) {
				try {
					const object = await bucket.get(key);
					if (!object) return null;

					const mimeType = object.httpMetadata?.contentType || 'application/octet-stream';
					const size = object.size;
					return {
						data: object.body,
						mimeType,
						size
					};
				} catch (err) {
					console.error('Error fetching R2 object:', err);
					return null;
				}
			},

			async deleteObject(key: string) {
				try {
					await bucket.delete(key);
					return true;
				} catch (err) {
					console.error('Error deleting R2 object:', err);
					return false;
				}
			}
		};
	}

	// Fallback local memory store for local development
	return {
		async uploadRecord(appointmentId: string, file: File) {
			const sanitized = sanitizeFileName(file.name);
			const timestamp = Date.now();
			const key = `records/${appointmentId}/${timestamp}-${sanitized}`;
			const arrayBuffer = await file.arrayBuffer();
			const buffer = new Uint8Array(arrayBuffer);

			localFileStore.set(key, {
				data: buffer,
				mimeType: file.type,
				fileName: file.name
			});

			return {
				key,
				fileName: file.name,
				mimeType: file.type,
				sizeBytes: file.size
			};
		},

		async getObject(key: string) {
			const record = localFileStore.get(key);
			if (!record) return null;

			return {
				data: record.data,
				mimeType: record.mimeType,
				size: record.data.byteLength
			};
		},

		async deleteObject(key: string) {
			return localFileStore.delete(key);
		}
	};
}
