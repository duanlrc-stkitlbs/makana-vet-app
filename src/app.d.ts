// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				DB?: D1Database;
				RECORDS_BUCKET?: R2Bucket;
				CLINIC_NAME?: string;
				CLINIC_EDGELOCATION?: string;
				EMERGENCY_HOTLINE?: string;
				MAX_UPLOAD_SIZE_BYTES?: string;
			};
			context?: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches?: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}
	}
}

export {};
