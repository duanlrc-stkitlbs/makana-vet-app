<script lang="ts">
	import { CLINICAL_TECH_SPECS } from '$lib/data/mock-data';
</script>

<section id="diagnostics" class="py-20 sm:py-28 bg-white border-b border-slate-200/80 relative">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center max-w-3xl mx-auto mb-14">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-bold mb-3">
				<span>MODERN IN-HOUSE CLINIC FACILITIES</span>
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
				Equipped For Gentle, Comprehensive Care
			</h2>
			<p class="mt-3 text-base text-slate-600">
				Our in-house digital radiography, IDEXX laboratory suite, ultrasonic dental station, and sterile surgery suite provide same-day diagnostics and care for your pets.
			</p>
		</div>

		<!-- Diagnostic Hardware Bento Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each CLINICAL_TECH_SPECS as tech}
				<div class="bento-card rounded-3xl p-7 bg-surface-50/50 border border-slate-200 flex flex-col justify-between hover:border-slate-400/80 transition-all">
					<div>
						<div class="flex items-center justify-between gap-2 mb-3">
							<span class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-700 text-white">
								{tech.category}
							</span>
							<span class="text-xs font-mono text-emerald-700 font-medium flex items-center gap-1.5">
								<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
								{tech.status}
							</span>
						</div>

						<h3 class="text-xl font-bold text-slate-950 mt-2">
							{tech.name}
						</h3>

						<div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
							{#each tech.specs as spec}
								<div class="p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs font-mono text-slate-700 flex items-center gap-2 shadow-clinical-sm">
									<span class="text-emerald-600 font-bold">›</span>
									<span>{spec}</span>
								</div>
							{/each}
						</div>
					</div>

					<div class="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
						<span>Pet EHR Integration</span>
						<span class="text-slate-800 font-semibold">Immediate digital sync</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Edge Architecture Callout Banner -->
		<div class="mt-12 p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 relative overflow-hidden">
			<div class="absolute right-0 bottom-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
				<div class="lg:col-span-2 space-y-2">
					<div class="text-xs font-mono text-emerald-400 font-bold uppercase">
						Cloudflare Edge Pet Health Records
					</div>
					<h3 class="text-2xl font-bold tracking-tight">
						Instant Pet Records With Zero Frustration
					</h3>
					<p class="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
						Say goodbye to lost paperwork and waiting on faxed records. Makana securely hosts all vaccination certificates, digital X-rays, and medical notes on Cloudflare D1 and R2 storage — giving you fast, 24/7 access on your phone with zero fees.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-3 text-xs font-mono">
					<div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
						<div class="text-slate-500 text-[11px]">D1 Record Lookup</div>
						<div class="text-xl font-bold text-emerald-400 mt-0.5">&lt; 5ms</div>
					</div>
					<div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
						<div class="text-slate-500 text-[11px]">R2 Owner Download Fee</div>
						<div class="text-xl font-bold text-emerald-400 mt-0.5">R0.00</div>
					</div>
					<div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
						<div class="text-slate-500 text-[11px]">Online Booking Sync</div>
						<div class="text-xl font-bold text-emerald-400 mt-0.5">Instant</div>
					</div>
					<div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
						<div class="text-slate-500 text-[11px]">Record Retention</div>
						<div class="text-xl font-bold text-emerald-400 mt-0.5">Lifetime</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

