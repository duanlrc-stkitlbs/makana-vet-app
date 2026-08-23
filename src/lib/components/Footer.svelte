<script lang="ts">
	import { onMount } from 'svelte';
	import type { EdgeHealthResponse } from '$lib/types';

	let health = $state<EdgeHealthResponse | null>(null);
	let isChecking = $state(false);

	async function checkEdgeHealth() {
		try {
			isChecking = true;
			const res = await fetch('/api/health');
			if (res.ok) {
				health = await res.json();
			}
		} catch (err) {
			console.error('Health ping error:', err);
		} finally {
			isChecking = false;
		}
	}

	onMount(() => {
		checkEdgeHealth();
		const interval = setInterval(checkEdgeHealth, 20000);
		return () => clearInterval(interval);
	});

	const schemaJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'VeterinaryCare',
		name: 'Makana Clinical Veterinary Medicine',
		image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf',
		telephone: '+1-800-555-8389',
		address: {
			'@type': 'PostalAddress',
			streetAddress: '4200 Precision Parkway, Suite 100',
			addressLocality: 'San Francisco',
			addressRegion: 'CA',
			postalCode: '94107',
			addressCountry: 'US'
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: 37.7749,
			longitude: -122.4194
		},
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				opens: '00:00',
				closes: '23:59'
			}
		],
		priceRange: '$$$'
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schemaJsonLd)}</script>`}
</svelte:head>

<footer id="emergency" class="bg-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
	<!-- Emergency Hotline Banner -->
	<div class="bg-gradient-to-r from-red-950 via-red-900 to-slate-950 border-b border-red-800/80 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
		<div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
					<svg class="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
					</svg>
				</div>
				<div>
					<div class="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wide">
						<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
						<span>24/7 Priority Emergency Triage Protocol</span>
					</div>
					<h3 class="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
						Acute Trauma &amp; Critical Care Hotline
					</h3>
					<p class="text-xs text-red-200/80 font-mono mt-0.5">
						Attending emergency surgeons on standby. Zero intake delay.
					</p>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				<a
					href="tel:+18005558389"
					class="px-6 py-3.5 rounded-xl font-mono font-bold text-base bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
				>
					<span>CALL +1 (800) 555-8389</span>
				</a>
			</div>
		</div>
	</div>

	<!-- Main Footer Columns -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
			<!-- Col 1: Brand & Edge Telemetry (2 cols) -->
			<div class="lg:col-span-2 space-y-4">
				<div class="flex items-center gap-2.5">
					<div class="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm border border-slate-800">
						⚡
					</div>
					<span class="font-bold tracking-tight text-white text-lg">MAKANA VETERINARY</span>
				</div>

				<p class="text-xs text-slate-400 leading-relaxed font-mono max-w-sm">
					Tertiary veterinary medical center deployed to Cloudflare Edge. Backed by Cloudflare D1 distributed SQLite and R2 Object Storage for sub-millisecond EHR queries.
				</p>

				<!-- Edge Telemetry Latency Badge -->
				<div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-2">
					<div class="flex items-center justify-between text-slate-400">
						<span class="flex items-center gap-1.5">
							<span class="w-2 h-2 rounded-full {health?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
							<span>Edge Node: <strong class="text-white">{health?.edgeLocation || 'IAD-01 (Primary)'}</strong></span>
						</span>
						<button
							onclick={checkEdgeHealth}
							class="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
							title="Ping health check"
						>
							<span>{isChecking ? 'Pinging...' : 'Ping'}</span>
						</button>
					</div>

					<div class="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
						<div>
							<span class="text-slate-500">D1 Status:</span>
							<span class="text-emerald-400 ml-1 font-bold">{health?.d1Status?.toUpperCase() || 'CONNECTED'}</span>
						</div>
						<div>
							<span class="text-slate-500">Latency:</span>
							<span class="text-emerald-400 ml-1 font-bold">{health?.latencyMs || 2.4} ms</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Col 2: Clinical Services -->
			<div class="space-y-3">
				<h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Clinical Services</h4>
				<ul class="space-y-2 text-xs font-mono text-slate-400">
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">3.0T High-Field MRI</a></li>
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">64-Slice Spectral CT</a></li>
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">Laparoscopic Surgery</a></li>
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">TPLO Reconstruction</a></li>
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">24/7 Tele-Triage</a></li>
				</ul>
			</div>

			<!-- Col 3: Hospital Facility -->
			<div class="space-y-3">
				<h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Hospital Facility</h4>
				<div class="text-xs font-mono text-slate-400 space-y-1.5 leading-relaxed">
					<p class="text-slate-300 font-semibold">Emergency Triage Bays 1–4</p>
					<p>4200 Precision Parkway, Suite 100</p>
					<p>Innovation District, CA 94107</p>
					<p class="pt-2 text-emerald-400">● 24/7/365 Continuous Operation</p>
				</div>
			</div>

			<!-- Col 4: Platform & Compliance -->
			<div class="space-y-3">
				<h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Edge Infrastructure</h4>
				<ul class="space-y-2 text-xs font-mono text-slate-400">
					<li>Cloudflare Pages + Workers</li>
					<li>Cloudflare D1 Edge SQLite</li>
					<li>Cloudflare R2 PACS Storage</li>
					<li>AAHA Accredited Facility</li>
					<li>VECCS Level 1 Certified</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Copyright Row -->
		<div class="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
			<div>
				© 2026 Makana Clinical Veterinary Medicine. All rights reserved.
			</div>
			<div class="flex items-center gap-4">
				<span>Global PoP Routing</span>
				<span>•</span>
				<span>Zero-Egress PACS</span>
				<span>•</span>
				<span>SvelteKit + Svelte 5</span>
			</div>
		</div>
	</div>
</footer>
