<script lang="ts">
	import TriageCapacityBadge from '$lib/components/TriageCapacityBadge.svelte';
	import type { TriageCapacity } from '$lib/types';

	interface Props {
		triageCapacity?: TriageCapacity;
		onBookClick?: () => void;
	}

	let { triageCapacity, onBookClick }: Props = $props();

	// Interactive Micro-Preview State
	let activeTab = $state<'triage' | 'diagnostics' | 'telemetry'>('triage');
	let isSimulating = $state(false);

	const recentTelemetries = [
		{
			id: 'CASE-9021',
			patient: 'Atlas (Canine, 3y)',
			triage: 'Priority - Spinal Neuro',
			doctor: 'Dr. Rostova',
			time: 'Just now',
			status: 'In MRI Suite',
			statusColor: 'text-amber-700 bg-amber-50 border-amber-200'
		},
		{
			id: 'CASE-8994',
			patient: 'Luna (Feline, 2y)',
			triage: 'Routine - Wellness + Vax',
			doctor: 'Dr. Thorne',
			time: '3m ago',
			status: 'Discharged / D1 Logged',
			statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
		},
		{
			id: 'CASE-8987',
			patient: 'Kona (Canine, 5y)',
			triage: 'Critical - Acute Trauma',
			doctor: 'Dr. Chen',
			time: '8m ago',
			status: 'ICU Stabilized',
			statusColor: 'text-teal-700 bg-teal-50 border-teal-200'
		}
	];

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -80;
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}
</script>

<section id="hero" class="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-surface-50 to-white">
	<!-- Background subtle grid -->
	<div class="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
	
	<!-- Subtle ambient glow -->
	<div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"></div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Capacity Badge Bar -->
		<div class="flex justify-center mb-8">
			<TriageCapacityBadge capacity={triageCapacity} />
		</div>

		<!-- Main Hero Headline & Subtitle -->
		<div class="text-center max-w-4xl mx-auto">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 mb-6 shadow-clinical-sm">
				<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
				<span>Cloudflare D1 Edge SQLite &amp; R2 Object Storage Infrastructure</span>
			</div>

			<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
				Clinical Precision.
				<span class="bg-gradient-to-r from-emerald-700 via-teal-600 to-slate-900 bg-clip-text text-transparent block mt-1">
					Zero Latency Animal Healthcare.
				</span>
			</h1>

			<p class="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
				Makana is a modern tertiary veterinary hospital integrating high-field diagnostic imaging, minimally invasive surgical suites, and an instant edge intake pipeline.
			</p>

			<!-- Dual CTA Row -->
			<div class="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
				<button
					onclick={() => {
						if (onBookClick) onBookClick();
						else scrollTo('intake');
					}}
					type="button"
					class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-slate-950 hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md shadow-slate-950/15 border border-slate-800 group"
				>
					<span>Instant Edge Intake</span>
					<svg class="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M5 12h14"></path>
						<path d="m12 5 7 7-7 7"></path>
					</svg>
				</button>

				<button
					onclick={() => scrollTo('specialists')}
					type="button"
					class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90 shadow-clinical-sm transition-all active:scale-[0.98]"
				>
					<svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
						<path d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
					<span>Specialist Directory</span>
				</button>

				<a
					href="tel:+18005558389"
					class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-red-700 bg-red-50/80 hover:bg-red-100/80 border border-red-200 transition-all font-mono text-sm"
				>
					<svg class="w-4 h-4 text-red-600 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
					</svg>
					<span>24/7 ER Hotline</span>
				</a>
			</div>
		</div>

		<!-- Interactive Micro-Preview Card (Linear/Vercel Clinical Telemetry Style) -->
		<div class="mt-14 max-w-4xl mx-auto">
			<div class="rounded-2xl border border-slate-200/90 bg-white/95 shadow-clinical-lg overflow-hidden backdrop-blur-md">
				<!-- Window Header Bar -->
				<div class="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
					<div class="flex items-center gap-2">
						<div class="flex items-center gap-1.5">
							<div class="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
							<div class="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
							<div class="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
						</div>
						<span class="text-xs font-mono text-slate-500 ml-2 font-medium">makana.edge.triage/telemetry-v1</span>
					</div>

					<!-- Preview Navigation Tabs -->
					<div class="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-mono">
						<button
							onclick={() => (activeTab = 'triage')}
							class="px-2.5 py-1 rounded-md transition-all {activeTab === 'triage'
								? 'bg-white text-slate-900 font-semibold shadow-sm'
								: 'text-slate-600 hover:text-slate-900'}"
						>
							Live Queue
						</button>
						<button
							onclick={() => (activeTab = 'diagnostics')}
							class="px-2.5 py-1 rounded-md transition-all {activeTab === 'diagnostics'
								? 'bg-white text-slate-900 font-semibold shadow-sm'
								: 'text-slate-600 hover:text-slate-900'}"
						>
							PACS Stream
						</button>
						<button
							onclick={() => (activeTab = 'telemetry')}
							class="px-2.5 py-1 rounded-md transition-all {activeTab === 'telemetry'
								? 'bg-white text-slate-900 font-semibold shadow-sm'
								: 'text-slate-600 hover:text-slate-900'}"
						>
							Edge Health
						</button>
					</div>
				</div>

				<!-- Card Body based on Active Tab -->
				<div class="p-4 sm:p-6 font-sans">
					{#if activeTab === 'triage'}
						<div>
							<div class="flex items-center justify-between mb-3 text-xs font-mono text-slate-500">
								<span>Active Emergency &amp; Scheduled Ingestion Pipeline</span>
								<span class="text-emerald-700 font-medium">Auto-sync: D1 Active (3.4ms)</span>
							</div>

							<div class="space-y-2.5">
								{#each recentTelemetries as item}
									<div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors gap-2">
										<div class="flex items-center gap-3">
											<span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-sm">
												{item.id}
											</span>
											<div>
												<h4 class="text-xs sm:text-sm font-semibold text-slate-900">{item.patient}</h4>
												<p class="text-[11px] text-slate-500 font-mono">{item.triage} • Assigned: <span class="text-slate-700 font-medium">{item.doctor}</span></p>
											</div>
										</div>

										<div class="flex items-center justify-between sm:justify-end gap-3">
											<span class="text-[11px] font-mono text-slate-400">{item.time}</span>
											<span class="text-[11px] font-mono px-2.5 py-1 rounded-full font-medium border {item.statusColor}">
												{item.status}
											</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{:else if activeTab === 'diagnostics'}
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
								<div class="flex items-center justify-between text-xs font-mono mb-2">
									<span class="text-slate-500">R2 Object PACS #DICOM-449</span>
									<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Encrypted</span>
								</div>
								<div class="h-28 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 font-mono text-xs relative overflow-hidden group">
									<div class="absolute inset-0 bg-grid-pattern opacity-20"></div>
									<div class="text-center z-10">
										<svg class="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-pulse-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
											<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
											<circle cx="9" cy="9" r="2"/>
											<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
										</svg>
										<span class="text-emerald-300 font-mono text-[11px]">3.0T MRI Multiplanar Reconstruction</span>
									</div>
								</div>
								<div class="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500">
									<span>184 Slices • 42.8 MB</span>
									<span class="text-slate-700 font-medium">Dr. Marcus Vance (Reviewing)</span>
								</div>
							</div>

							<div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
								<div>
									<div class="flex items-center justify-between text-xs font-mono mb-2">
										<span class="text-slate-500">Biometric Blood Chemistry</span>
										<span class="text-emerald-700 font-semibold">IDEXX Sync: OK</span>
									</div>
									<div class="space-y-1.5 text-xs font-mono">
										<div class="flex justify-between py-1 border-b border-slate-200/60">
											<span class="text-slate-500">BUN / Creatinine:</span>
											<span class="font-semibold text-slate-800">18 mg/dL / 1.1 mg/dL (Normal)</span>
										</div>
										<div class="flex justify-between py-1 border-b border-slate-200/60">
											<span class="text-slate-500">ALKP / ALT:</span>
											<span class="font-semibold text-slate-800">62 U/L / 45 U/L (Normal)</span>
										</div>
										<div class="flex justify-between py-1">
											<span class="text-slate-500">Lactate Assay:</span>
											<span class="font-semibold text-emerald-700">1.2 mmol/L (Optimal)</span>
										</div>
									</div>
								</div>
								<div class="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-400">
									<span>EHR Schema Version: 2.4</span>
									<span class="text-emerald-600">D1 Synchronized</span>
								</div>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
							<div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
								<div class="text-slate-500 mb-1">D1 Query Latency</div>
								<div class="text-2xl font-bold text-slate-900">3.8 ms</div>
								<div class="text-[11px] text-emerald-700 mt-1">● Read replication active</div>
							</div>
							<div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
								<div class="text-slate-500 mb-1">R2 Object Write SLA</div>
								<div class="text-2xl font-bold text-slate-900">18.2 ms</div>
								<div class="text-[11px] text-emerald-700 mt-1">● Zero egress cost tier</div>
							</div>
							<div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
								<div class="text-slate-500 mb-1">Edge Availability</div>
								<div class="text-2xl font-bold text-slate-900">99.99%</div>
								<div class="text-[11px] text-slate-600 mt-1">310+ Global PoPs</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Card Footer Bar -->
				<div class="px-4 py-2.5 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500">
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
						<span>Edge Triage Gateway Connected</span>
					</div>
					<button
						onclick={() => scrollTo('intake')}
						class="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 group"
					>
						<span>Initiate Patient Intake</span>
						<span class="group-hover:translate-x-0.5 transition-transform">→</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</section>
