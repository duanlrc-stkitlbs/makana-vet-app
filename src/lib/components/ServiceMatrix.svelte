<script lang="ts">
	import type { Service, ServiceCategory } from '$lib/types';

	interface Props {
		services: Service[];
		onSelectService?: (service: Service) => void;
	}

	let { services = [], onSelectService }: Props = $props();

	let activeFilter = $state<string>('all');

	const categories: { id: string; label: string; count: number }[] = $derived([
		{ id: 'all', label: 'All Services', count: services.length },
		{
			id: 'preventive',
			label: 'Wellness & Vaccines',
			count: services.filter((s) => s.category === 'preventive').length
		},
		{
			id: 'dental',
			label: 'Dental Care',
			count: services.filter((s) => s.category === 'dental').length
		},
		{
			id: 'surgery',
			label: 'Routine Surgeries',
			count: services.filter((s) => s.category === 'surgery').length
		},
		{
			id: 'diagnostics',
			label: 'In-House Lab & X-Ray',
			count: services.filter((s) => s.category === 'diagnostics').length
		},
		{
			id: 'urgent_care',
			label: 'Sick Pet & Urgent',
			count: services.filter((s) => s.category === 'urgent_care').length
		}
	]);

	const filteredServices = $derived(
		activeFilter === 'all'
			? services
			: services.filter((s) => s.category === activeFilter)
	);

	function formatPrice(cents: number): string {
		return `$${(cents / 100).toLocaleString('en-US')}`;
	}

	function handleBook(service: Service) {
		if (onSelectService) {
			onSelectService(service);
		}
		const intakeEl = document.getElementById('intake');
		if (intakeEl) {
			const yOffset = -80;
			const y = intakeEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}
</script>

<section id="services" class="py-20 sm:py-28 bg-white border-b border-slate-200/80 relative">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
			<div>
				<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-semibold mb-3">
					<span>COMMUNITY VETERINARY CARE</span>
					<span class="text-emerald-400">•</span>
					<span>TRANSPARENT PRICING</span>
				</div>
				<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
					Complete Care For Every Stage of Life
				</h2>
				<p class="mt-2 text-base text-slate-600 max-w-2xl font-normal">
					From puppy and kitten vaccinations to routine dental care, in-house lab tests, and gentle surgery — all with transparent, fixed pricing.
				</p>
			</div>

			<!-- Live Price Transparency Pill -->
			<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
				<div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
					$0
				</div>
				<div>
					<div class="font-bold text-slate-900">Zero Surprise Fees</div>
					<div class="text-slate-500 text-[11px]">All estimates provided upfront</div>
				</div>
			</div>
		</div>

		<!-- Category Filter Tabs -->
		<div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
			{#each categories as cat}
				<button
					onclick={() => (activeFilter = cat.id)}
					class="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border {activeFilter === cat.id
						? 'bg-slate-950 text-white border-slate-950 shadow-sm'
						: 'bg-white text-slate-600 border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'}"
				>
					<span>{cat.label}</span>
					<span
						class="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-mono {activeFilter === cat.id
							? 'bg-slate-800 text-emerald-300'
							: 'bg-slate-100 text-slate-500'}"
					>
						{cat.count}
					</span>
				</button>
			{/each}
		</div>

		<!-- Bento Grid Service Matrix -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredServices as service, idx}
				<div
					class="bento-card rounded-2xl p-6 flex flex-col justify-between relative group hover:border-slate-400/80 transition-all {idx === 0 && activeFilter === 'all' ? 'lg:col-span-2 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20' : ''}"
				>
					<div>
						<!-- Top badge row -->
						<div class="flex items-center justify-between gap-2 mb-4">
							<div class="flex items-center gap-2">
								<span class="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/80 uppercase">
									{service.category.replace('_', ' ')}
								</span>
								{#if service.badge}
									<span class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
										{service.badge}
									</span>
								{/if}
							</div>

							<!-- Duration & SLA -->
							<div class="text-right">
								<span class="text-xs font-mono text-slate-500 flex items-center gap-1">
									<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
									{service.duration_minutes}m
								</span>
							</div>
						</div>

						<!-- Title and Description -->
						<h3 class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
							{service.title}
						</h3>
						<p class="mt-2 text-sm text-slate-600 leading-relaxed">
							{service.description}
						</p>

						<!-- Feature Bullets -->
						<ul class="mt-4 space-y-2 border-t border-slate-100 pt-4">
							{#each service.features as feature}
								<li class="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
									<svg class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
										<polyline points="20 6 9 17 4 12" />
									</svg>
									<span>{feature}</span>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Bottom Row: Pricing & Book CTA -->
					<div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
						<div>
							<div class="text-[11px] font-mono uppercase text-slate-400">Fixed Fee</div>
							<div class="text-xl font-extrabold font-mono text-slate-950">
								{formatPrice(service.price_cents)}
							</div>
							{#if service.sla_turnaround}
								<div class="text-[10px] font-mono text-emerald-700 font-medium mt-0.5">
									{service.sla_turnaround}
								</div>
							{/if}
						</div>

						<button
							onclick={() => handleBook(service)}
							type="button"
							class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-emerald-700 hover:text-white border border-slate-200 group-hover:border-slate-900 transition-all shadow-clinical-sm active:scale-95"
						>
							<span>Book Visit</span>
							<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M5 12h14"></path>
								<path d="m12 5 7 7-7 7"></path>
							</svg>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

