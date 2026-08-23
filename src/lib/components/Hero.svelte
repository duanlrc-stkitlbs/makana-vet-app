<script lang="ts">
	import TriageCapacityBadge from '$lib/components/TriageCapacityBadge.svelte';
	import type { TriageCapacity } from '$lib/types';

	interface Props {
		triageCapacity?: TriageCapacity;
		onBookClick?: () => void;
	}

	let { triageCapacity, onBookClick }: Props = $props();

	// Interactive Micro-Preview State
	let activeTab = $state<'schedule' | 'diagnostics' | 'portal'>('schedule');

	const recentAppointments = [
		{
			id: 'VISIT-4091',
			patient: 'Milo (Golden Retriever, 2y)',
			type: 'Routine Wellness & Core Vaccines',
			doctor: 'Dr. Maya Lin',
			time: '09:00 AM',
			status: 'Completed / Records Synced',
			statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
		},
		{
			id: 'VISIT-4098',
			patient: 'Luna (Domestic Shorthair, 4y)',
			type: 'Dental Cleaning & Ultrasonic Polish',
			doctor: 'Dr. Marcus Vance',
			time: '11:30 AM',
			status: 'In Care / Resting',
			statusColor: 'text-teal-700 bg-teal-50 border-teal-200'
		},
		{
			id: 'VISIT-4102',
			patient: 'Buster (Beagle, 5y)',
			type: 'Same-Day Sick Visit (Ear Check)',
			doctor: 'Dr. Sarah Jenkins',
			time: '02:00 PM',
			status: 'Confirmed for Today',
			statusColor: 'text-sky-700 bg-sky-50 border-sky-200'
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
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 mb-6 shadow-clinical-sm font-semibold">
				<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
				<span>Your Neighborhood Companion Animal Clinic • Cloud-Powered Records</span>
			</div>

			<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
				Friendly, Modern Care
				<span class="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 bg-clip-text text-transparent block mt-1">
					For The Pets You Love.
				</span>
			</h1>

			<p class="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
				Makana is a compassionate family veterinary clinic offering gentle wellness exams, core vaccinations, dental cleanings, routine surgeries, and 15-minute in-house lab results.
			</p>

			<!-- Dual CTA Row -->
			<div class="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
				<button
					onclick={() => {
						if (onBookClick) onBookClick();
						else scrollTo('intake');
					}}
					type="button"
					class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] transition-all shadow-md shadow-emerald-900/15 border border-emerald-800 group"
				>
					<span>Book an Appointment</span>
					<svg class="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
					<span>Meet Our Care Team</span>
				</button>

				<a
					href="tel:+27215558389"
					class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all font-mono text-sm"
				>
					<svg class="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
					</svg>
					<span>Call: +27 (0) 21 555 8389</span>
				</a>
			</div>
		</div>

		<!-- Interactive Micro-Preview Card -->
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
						<span class="text-xs font-mono text-slate-500 ml-2 font-medium">makana.clinic.portal/live-stream</span>
					</div>

					<!-- Preview Navigation Tabs -->
					<div class="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-mono">
						<button
							onclick={() => (activeTab = 'schedule')}
							class="px-2.5 py-1 rounded-md transition-all {activeTab === 'schedule'
								? 'bg-white text-slate-900 font-semibold shadow-sm'
								: 'text-slate-600 hover:text-slate-900'}"
						>
							Today's Visits
						</button>
						<button
							onclick={() => (activeTab = 'diagnostics')}
							class="px-2.5 py-1 rounded-md transition-all {activeTab === 'diagnostics'
								? 'bg-white text-slate-900 font-semibold shadow-sm'
								: 'text-slate-600 hover:text-slate-900'}"
						>
							In-House Lab &amp; X-Ray
						</button>
						<button
							onclick={() => (activeTab = 'portal')}
							class="px-2.5 py-1 rounded-md transition-all {activeTab === 'portal'
								? 'bg-white text-slate-900 font-semibold shadow-sm'
								: 'text-slate-600 hover:text-slate-900'}"
						>
							Pet EHR Records
						</button>
					</div>
				</div>

				<!-- Card Body based on Active Tab -->
				<div class="p-4 sm:p-6 font-sans">
					{#if activeTab === 'schedule'}
						<div>
							<div class="flex items-center justify-between mb-3 text-xs font-mono text-slate-500">
								<span>Daily Appointments &amp; Walk-In Flow</span>
								<span class="text-emerald-700 font-medium">Synced: D1 Cloud Database</span>
							</div>

							<div class="space-y-2.5">
								{#each recentAppointments as item}
									<div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors gap-2">
										<div class="flex items-center gap-3">
											<span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-sm">
												{item.id}
											</span>
											<div>
												<h4 class="text-xs sm:text-sm font-semibold text-slate-900">{item.patient}</h4>
												<p class="text-[11px] text-slate-500 font-mono">{item.type} • Attending: <span class="text-slate-700 font-medium">{item.doctor}</span></p>
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
									<span class="text-slate-500">Digital X-Ray Snapshot</span>
									<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Sound HD</span>
								</div>
								<div class="h-28 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 font-mono text-xs relative overflow-hidden group">
									<div class="absolute inset-0 bg-grid-pattern opacity-20"></div>
									<div class="text-center z-10">
										<svg class="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-pulse-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
											<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
											<circle cx="9" cy="9" r="2"/>
											<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
										</svg>
										<span class="text-emerald-300 font-mono text-[11px]">Canine Thoracic &amp; Abdominal Digital Radiography</span>
									</div>
								</div>
								<div class="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500">
									<span>2 Views • Sub-Second Capture</span>
									<span class="text-slate-700 font-medium">Dr. Marcus Vance (Normal)</span>
								</div>
							</div>

							<div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
								<div>
									<div class="flex items-center justify-between text-xs font-mono mb-2">
										<span class="text-slate-500">IDEXX In-House Blood Chemistry</span>
										<span class="text-emerald-700 font-semibold">15-Min Turnaround: OK</span>
									</div>
									<div class="space-y-1.5 text-xs font-mono">
										<div class="flex justify-between py-1 border-b border-slate-200/60">
											<span class="text-slate-500">Kidney (BUN / Creatinine):</span>
											<span class="font-semibold text-slate-800">19 mg/dL / 1.0 mg/dL (Normal)</span>
										</div>
										<div class="flex justify-between py-1 border-b border-slate-200/60">
											<span class="text-slate-500">Liver (ALT / ALKP):</span>
											<span class="font-semibold text-slate-800">48 U/L / 55 U/L (Healthy)</span>
										</div>
										<div class="flex justify-between py-1">
											<span class="text-slate-500">Complete Blood Count (CBC):</span>
											<span class="font-semibold text-emerald-700">WBC / Platelets (Optimal)</span>
										</div>
									</div>
								</div>
								<div class="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-400">
									<span>Client Portal Sync</span>
									<span class="text-emerald-600">Saved to Cloudflare R2</span>
								</div>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
							<div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
								<div class="text-slate-500 mb-1">Instant Appointment Lookups</div>
								<div class="text-2xl font-bold text-slate-900">&lt; 5 ms</div>
								<div class="text-[11px] text-emerald-700 mt-1">● D1 SQLite fast queries</div>
							</div>
							<div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
								<div class="text-slate-500 mb-1">Medical Record Downloads</div>
								<div class="text-2xl font-bold text-slate-900">R0.00</div>
								<div class="text-[11px] text-emerald-700 mt-1">● R2 zero egress fees</div>
							</div>
							<div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
								<div class="text-slate-500 mb-1">Clinic Reliability</div>
								<div class="text-2xl font-bold text-slate-900">99.99%</div>
								<div class="text-[11px] text-slate-600 mt-1">Global edge availability</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Card Footer Bar -->
				<div class="px-4 py-2.5 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500">
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
						<span>Online Booking System Active</span>
					</div>
					<button
						onclick={() => scrollTo('intake')}
						class="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 group"
					>
						<span>Schedule Your Pet's Visit</span>
						<span class="group-hover:translate-x-0.5 transition-transform">→</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

