<script lang="ts">
	import type { Appointment } from '$lib/types';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	let searchQuery = $state('MKN-7821-CF');
	let isLoading = $state(false);
	let searchResult = $state<Appointment | null>(null);
	let lookupError = $state<string | null>(null);

	const sampleTokens = ['MKN-7821-CF', 'MKN-9412-CF', 'MKN-3109-CF'];

	async function performLookup(query = searchQuery) {
		if (!query.trim()) {
			lookupError = 'Please enter an appointment reference code, email, or phone number.';
			return;
		}

		isLoading = true;
		lookupError = null;
		searchResult = null;

		try {
			const res = await fetch(`/api/appointments/${encodeURIComponent(query.trim())}`);
			const data = await res.json();

			if (!res.ok || !data.success) {
				lookupError = data.error || 'No appointment found matching this identifier.';
			} else {
				searchResult = data.appointment;
			}
		} catch (err: any) {
			console.error('Lookup error:', err);
			lookupError = 'Network error fetching appointment from Cloudflare edge.';
		} finally {
			isLoading = false;
		}
	}

	function handleSampleClick(token: string) {
		searchQuery = token;
		performLookup(token);
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
	>
		<!-- Backdrop button -->
		<button
			type="button"
			class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm cursor-default"
			onclick={onClose}
			aria-label="Close modal backdrop"
		></button>

		<!-- Modal Container -->
		<div
			class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative text-left z-10"
			role="dialog"
			aria-modal="true"
		>
			<!-- Header -->
			<div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
				<div class="flex items-center gap-2.5">
					<div class="w-8 h-8 rounded-lg bg-slate-950 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
						🔍
					</div>
					<div>
						<h3 class="text-lg font-bold text-slate-900">EHR Appointment &amp; PACS Lookup</h3>
						<p class="text-xs text-slate-500 font-mono">Query real-time records from Cloudflare D1</p>
					</div>
				</div>

				<button
					onclick={onClose}
					class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
					aria-label="Close modal"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Search Form -->
			<form
				onsubmit={(e) => {
					e.preventDefault();
					performLookup();
				}}
				class="space-y-4"
			>
				<div>
					<label for="lookupRef" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
						Reference Code, Email, or Phone
					</label>
					<div class="flex gap-2">
						<input
							id="lookupRef"
							type="text"
							bind:value={searchQuery}
							placeholder="e.g. MKN-7821-CF or client@example.com"
							class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
						/>
						<button
							type="submit"
							disabled={isLoading}
							class="px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 transition-all disabled:opacity-50"
						>
							{isLoading ? 'Querying...' : 'Lookup'}
						</button>
					</div>
				</div>

				<!-- Quick Test Sample Tokens -->
				<div class="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-slate-500">
					<span>Sample tokens:</span>
					{#each sampleTokens as tok}
						<button
							type="button"
							onclick={() => handleSampleClick(tok)}
							class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
						>
							{tok}
						</button>
					{/each}
				</div>
			</form>

			<!-- Result or Error Area -->
			{#if lookupError}
				<div class="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-mono text-red-700 flex items-center gap-2.5">
					<svg class="w-5 h-5 text-red-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<span>{lookupError}</span>
				</div>
			{/if}

			{#if searchResult}
				<div class="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-4">
					<!-- Top Token & Status -->
					<div class="flex items-center justify-between border-b border-slate-200 pb-3">
						<div>
							<span class="text-slate-400 block text-[10px]">RECORD TOKEN</span>
							<span class="text-base font-bold text-slate-950">{searchResult.reference_code}</span>
						</div>
						<div>
							<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
								● {searchResult.status.toUpperCase()}
							</span>
						</div>
					</div>

					<!-- Details Grid -->
					<div class="grid grid-cols-2 gap-3">
						<div>
							<span class="text-slate-400 block">Patient / Species:</span>
							<span class="font-bold text-slate-800">{searchResult.pet_name} ({searchResult.species})</span>
						</div>
						<div>
							<span class="text-slate-400 block">Owner / Client:</span>
							<span class="font-bold text-slate-800">{searchResult.client_name}</span>
						</div>
						<div>
							<span class="text-slate-400 block">Schedule Window:</span>
							<span class="font-bold text-slate-800">{searchResult.scheduled_at} @ {searchResult.time_slot}</span>
						</div>
						<div>
							<span class="text-slate-400 block">Attending Clinician:</span>
							<span class="font-bold text-emerald-800">{searchResult.clinician_assigned || 'Dr. Elena Rostova'}</span>
						</div>
						<div class="col-span-2">
							<span class="text-slate-400 block">Symptoms / Clinical Notes:</span>
							<span class="text-slate-700">{searchResult.symptoms || 'None recorded'}</span>
						</div>
					</div>

					<!-- Attached R2 Files -->
					{#if searchResult.attachments && searchResult.attachments.length > 0}
						<div class="border-t border-slate-200 pt-3">
							<div class="text-[11px] text-slate-500 uppercase font-bold mb-2">
								Linked R2 Medical Attachments ({searchResult.attachments.length})
							</div>
							<div class="space-y-1.5">
								{#each searchResult.attachments as att}
									<a
										href={`/api/attachments/${att.r2_object_key}`}
										target="_blank"
										rel="noopener noreferrer"
										class="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 flex items-center justify-between text-slate-800 hover:text-emerald-800 transition-colors"
									>
										<div class="flex items-center gap-2 overflow-hidden truncate">
											<span class="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
												{att.mime_type.split('/').pop()}
											</span>
											<span class="truncate font-semibold">{att.file_name}</span>
										</div>
										<span class="text-xs text-emerald-700 font-bold flex items-center gap-1 shrink-0 ml-2">
											<span>Download from R2</span>
											<span>↓</span>
										</span>
									</a>
								{/each}
							</div>
						</div>
					{:else}
						<div class="border-t border-slate-200 pt-2 text-slate-400 text-[11px]">
							No external diagnostic attachments uploaded for this record.
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
