<script lang="ts">
	import type { TriageCapacity } from '$lib/types';

	interface Props {
		triageCapacity?: TriageCapacity;
		onOpenLookup?: () => void;
		onBookClick?: () => void;
	}

	let { triageCapacity, onOpenLookup, onBookClick }: Props = $props();

	let isScrolled = $state(false);
	let mobileMenuOpen = $state(false);

	function handleScroll() {
		if (typeof window !== 'undefined') {
			isScrolled = window.scrollY > 20;
		}
	}

	function scrollToSection(id: string) {
		mobileMenuOpen = false;
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -80;
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}
</script>

<svelte:window onscroll={handleScroll} />

<header
	class="sticky top-0 z-50 w-full transition-all duration-200 {isScrolled
		? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
		: 'bg-white/60 backdrop-blur-sm border-b border-slate-100'}"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 sm:h-18">
			<!-- Logo & Status -->
			<div class="flex items-center gap-4 sm:gap-6">
				<a href="#hero" class="flex items-center gap-2.5 group">
					<div
						class="w-9 h-9 rounded-lg bg-slate-950 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg shadow-sm border border-slate-800 group-hover:border-emerald-500/50 transition-colors"
					>
						<svg
							class="w-5 h-5 transition-transform group-hover:scale-110"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
						</svg>
					</div>
					<div>
						<div class="flex items-center gap-1.5">
							<span class="font-bold tracking-tight text-slate-900 text-base sm:text-lg">MAKANA</span>
							<span class="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
								EDGE VET
							</span>
						</div>
						<p class="text-[10px] text-slate-500 tracking-wider uppercase font-mono hidden sm:block">
							Clinical Precision • D1/R2 Cloud
						</p>
					</div>
				</a>

				<!-- Live Triage Status Badge -->
				<div class="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-mono">
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
					</span>
					<span class="text-slate-600 font-medium">Emergency Triage:</span>
					<span class="text-emerald-700 font-semibold">Online & Direct</span>
					<span class="text-slate-300">|</span>
					<span class="text-slate-500">{triageCapacity?.avgTriageLatencySeconds || 134}s SLA</span>
				</div>
			</div>

			<!-- Desktop Navigation Links -->
			<nav class="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
				<button
					onclick={() => scrollToSection('services')}
					class="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
				>
					Services Matrix
				</button>
				<button
					onclick={() => scrollToSection('intake')}
					class="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
				>
					Edge Intake
				</button>
				<button
					onclick={() => scrollToSection('pricing')}
					class="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
				>
					Pricing & Plans
				</button>
				<button
					onclick={() => scrollToSection('diagnostics')}
					class="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
				>
					Clinical Tech
				</button>
				<button
					onclick={() => scrollToSection('specialists')}
					class="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
				>
					Specialists
				</button>
				<button
					onclick={() => scrollToSection('emergency')}
					class="px-3 py-1.5 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-semibold"
				>
					24/7 ER Protocol
				</button>
			</nav>

			<!-- Action CTAs -->
			<div class="flex items-center gap-2.5">
				<!-- Track Appointment Button -->
				<button
					onclick={() => onOpenLookup && onOpenLookup()}
					type="button"
					class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-clinical-sm"
					title="Lookup existing appointment or test with sample reference code"
				>
					<svg class="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
					<span>Track Intake</span>
					<kbd class="hidden md:inline-block px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200">
						REF#
					</kbd>
				</button>

				<!-- Book Consult Primary Button -->
				<button
					onclick={() => {
						if (onBookClick) onBookClick();
						else scrollToSection('intake');
					}}
					type="button"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm shadow-slate-900/10 border border-slate-800 group"
				>
					<span>Book Consult</span>
					<svg
						class="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M5 12h14"></path>
						<path d="m12 5 7 7-7 7"></path>
					</svg>
				</button>

				<!-- Mobile menu trigger -->
				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					type="button"
					class="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
					aria-label="Toggle navigation menu"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						{#if mobileMenuOpen}
							<path d="M18 6 6 18M6 6l12 12" />
						{:else}
							<path d="M4 12h16M4 6h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Menu Dropdown -->
		{#if mobileMenuOpen}
			<div class="lg:hidden py-4 border-t border-slate-200 bg-white/95 rounded-b-xl shadow-lg mt-1 space-y-2 px-2">
				<div class="px-3 py-2 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono mb-3">
					<span class="text-emerald-700 font-semibold">● Live Triage: Online</span>
					<span class="text-slate-500">Latency: 4ms</span>
				</div>
				<button
					onclick={() => scrollToSection('services')}
					class="w-full text-left px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-100"
				>
					Services Matrix
				</button>
				<button
					onclick={() => scrollToSection('intake')}
					class="w-full text-left px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-100"
				>
					Edge Intake Engine
				</button>
				<button
					onclick={() => scrollToSection('pricing')}
					class="w-full text-left px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-100"
				>
					Pricing & Wellness Plans
				</button>
				<button
					onclick={() => scrollToSection('diagnostics')}
					class="w-full text-left px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-100"
				>
					Clinical Technology
				</button>
				<button
					onclick={() => scrollToSection('specialists')}
					class="w-full text-left px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-100"
				>
					Specialist Team
				</button>
				<button
					onclick={() => scrollToSection('emergency')}
					class="w-full text-left px-3 py-2 rounded-md text-red-600 font-bold hover:bg-red-50"
				>
					24/7 Emergency Hotline
				</button>
				<button
					onclick={() => {
						mobileMenuOpen = false;
						if (onOpenLookup) onOpenLookup();
					}}
					class="w-full text-left px-3 py-2 rounded-md text-slate-800 font-mono text-xs border border-slate-200 bg-slate-50"
				>
					🔍 Track Existing Appointment (Ref#)
				</button>
			</div>
		{/if}
	</div>
</header>
