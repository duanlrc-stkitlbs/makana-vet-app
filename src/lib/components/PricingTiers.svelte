<script lang="ts">
	import { PRICING_WELLNESS_PLANS } from '$lib/data/mock-data';
	import type { Service } from '$lib/types';

	interface Props {
		services?: Service[];
		onSelectPlan?: (planName: string) => void;
	}

	let { services = [], onSelectPlan }: Props = $props();

	let billingCycle = $state<'monthly' | 'annual'>('monthly');
	let pricingMode = $state<'wellness' | 'procedures'>('wellness');

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -80;
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}

	function handlePlanClick(planName: string) {
		if (onSelectPlan) onSelectPlan(planName);
		scrollTo('intake');
	}
</script>

<section id="pricing" class="py-20 sm:py-28 bg-white border-b border-slate-200/80 relative">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center max-w-3xl mx-auto mb-12">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-bold mb-3">
				<span>TRANSPARENT PRICING &amp; WELLNESS PLANS</span>
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
				Predictable Care. No Hidden Surcharges.
			</h2>
			<p class="mt-3 text-base text-slate-600">
				Keep your companions healthy year-round with comprehensive monthly wellness plans or explore our fixed-rate clinic fee schedule.
			</p>

			<!-- Toggle: Wellness Plans vs Direct Procedures -->
			<div class="mt-8 inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold">
				<button
					type="button"
					onclick={() => (pricingMode = 'wellness')}
					class="px-4 py-2 rounded-lg transition-all {pricingMode === 'wellness'
						? 'bg-white text-slate-950 shadow-sm'
						: 'text-slate-600 hover:text-slate-900'}"
				>
					Monthly Wellness Plans
				</button>
				<button
					type="button"
					onclick={() => (pricingMode = 'procedures')}
					class="px-4 py-2 rounded-lg transition-all {pricingMode === 'procedures'
						? 'bg-white text-slate-950 shadow-sm'
						: 'text-slate-600 hover:text-slate-900'}"
				>
					Standard Procedure Fee Schedule
				</button>
			</div>
		</div>

		{#if pricingMode === 'wellness'}
			<!-- Billing Cycle Toggle -->
			<div class="flex items-center justify-center gap-3 mb-10 text-xs sm:text-sm font-mono">
				<span class={billingCycle === 'monthly' ? 'font-bold text-slate-900' : 'text-slate-500'}>
					Monthly Invoicing
				</span>
				<button
					type="button"
					onclick={() => (billingCycle = billingCycle === 'monthly' ? 'annual' : 'monthly')}
					class="w-12 h-6 rounded-full bg-slate-200 p-0.5 relative transition-colors focus:outline-none"
					aria-label="Toggle annual billing"
				>
					<div
						class="w-5 h-5 rounded-full bg-slate-900 transition-transform {billingCycle === 'annual'
							? 'translate-x-6 bg-emerald-600'
							: 'translate-x-0'}"
					></div>
				</button>
				<span class={billingCycle === 'annual' ? 'font-bold text-slate-900' : 'text-slate-500'}>
					Annual Prepay <span class="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-xs">Save ~10%</span>
				</span>
			</div>

			<!-- SaaS Pricing Cards Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
				{#each PRICING_WELLNESS_PLANS as plan}
					<div
						class="rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all relative {plan.popular
							? 'bg-slate-950 text-white border-2 border-emerald-500 shadow-xl lg:-translate-y-2'
							: 'bg-white text-slate-900 border border-slate-200 shadow-clinical-sm hover:border-slate-300'}"
					>
						{#if plan.popular}
							<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono font-bold text-xs shadow-sm">
								RECOMMENDED FOR ADULT PETS
							</div>
						{/if}

						<div>
							<div class="flex items-center justify-between">
								<h3 class="text-xl font-bold tracking-tight">{plan.name}</h3>
								{#if !plan.popular}
									<span class="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">Plan</span>
								{/if}
							</div>

							<p class="mt-2 text-xs leading-relaxed {plan.popular ? 'text-slate-400' : 'text-slate-500'}">
								{plan.tagline}
							</p>

							<!-- Price Display -->
							<div class="mt-6 pb-6 border-b {plan.popular ? 'border-slate-800' : 'border-slate-100'}">
								<div class="flex items-baseline gap-1">
									<span class="text-4xl font-extrabold font-mono">
										R{billingCycle === 'monthly' ? plan.monthly_price_rand : plan.annual_price_rand}
									</span>
									<span class="text-xs font-mono {plan.popular ? 'text-slate-400' : 'text-slate-500'}">
										/{billingCycle === 'monthly' ? 'month' : 'year'}
									</span>
								</div>
								<div class="text-[11px] font-mono mt-1 {plan.popular ? 'text-emerald-400' : 'text-emerald-700'}">
									Zero deductible • Cancel or adjust anytime
								</div>
							</div>

							<!-- Features List -->
							<ul class="mt-6 space-y-3 text-xs sm:text-sm">
								{#each plan.features as feat}
									<li class="flex items-start gap-2.5">
										<svg
											class="w-4 h-4 mt-0.5 shrink-0 {plan.popular ? 'text-emerald-400' : 'text-emerald-600'}"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.5"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
										<span class={plan.popular ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
									</li>
								{/each}
							</ul>
						</div>

						<div class="mt-8 pt-6 border-t {plan.popular ? 'border-slate-800' : 'border-slate-100'}">
							<button
								type="button"
								onclick={() => handlePlanClick(plan.name)}
								class="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm {plan.popular
									? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
									: 'bg-slate-950 text-white hover:bg-slate-800'}"
							>
								{plan.cta}
							</button>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Direct Transparent Procedure Schedule Table -->
			<div class="max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-clinical-sm overflow-hidden">
				<div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-mono">
					<span class="text-slate-700 font-bold uppercase">Standardized Clinic Fee Schedule</span>
					<span class="text-emerald-700 font-semibold">100% Upfront Estimates</span>
				</div>

				<div class="divide-y divide-slate-100">
					{#each services as s}
						<div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700 font-semibold">
										{s.category.replace('_', ' ')}
									</span>
									<h4 class="text-sm sm:text-base font-bold text-slate-900">{s.title}</h4>
								</div>
								<p class="text-xs text-slate-500 max-w-xl">{s.description}</p>
							</div>

							<div class="flex items-center justify-between sm:justify-end gap-6 shrink-0">
								<div class="text-right">
									<div class="text-lg font-extrabold font-mono text-slate-950">
										R{(s.price_cents / 100).toLocaleString('en-ZA')}
									</div>
									<div class="text-[11px] font-mono text-slate-400">{s.duration_minutes} min consult</div>
								</div>

								<button
									type="button"
									onclick={() => {
										scrollTo('intake');
									}}
									class="px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-slate-100 text-slate-800 hover:bg-emerald-700 hover:text-white transition-all border border-slate-200"
								>
									Book
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

