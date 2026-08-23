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
		name: 'Makana Family Veterinary Clinic',
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
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
				opens: '08:00',
				closes: '18:00'
			},
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Saturday'],
				opens: '08:30',
				closes: '14:00'
			}
		],
		priceRange: '$$'
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schemaJsonLd)}</script>`}
</svelte:head>

<footer id="emergency" class="bg-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
	<!-- Urgent Care & Hours Guidance Banner -->
	<div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-800/60 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
		<div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-2xl bg-emerald-700/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
					<svg class="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
					</svg>
				</div>
				<div>
					<div class="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
						<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
						<span>Daytime Urgent Care &amp; Clinic Support</span>
					</div>
					<h3 class="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
						Need Same-Day Care For Your Pet?
					</h3>
					<p class="text-xs text-slate-300 font-mono mt-0.5">
						Call for urgent daytime appointments or guidance. For midnight life-threatening emergencies, we provide local 24/7 ER partner routing.
					</p>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				<a
					href="tel:+18005558389"
					class="px-6 py-3.5 rounded-xl font-mono font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all active:scale-95"
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
					<div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-mono font-bold text-sm border border-emerald-600">
						🐾
					</div>
					<span class="font-bold tracking-tight text-white text-lg">MAKANA FAMILY VET</span>
				</div>

				<p class="text-xs text-slate-400 leading-relaxed font-mono max-w-sm">
					Your community companion animal clinic powered by Cloudflare Edge. Backed by Cloudflare D1 distributed SQLite and R2 Object Storage for instant digital pet records.
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

			<!-- Col 2: Veterinary Services -->
			<div class="space-y-3">
				<h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Veterinary Care</h4>
				<ul class="space-y-2 text-xs font-mono text-slate-400">
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">Wellness &amp; Physical Exams</a></li>
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">Vaccines &amp; Microchipping</a></li>
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">Dental Scale &amp; Polish</a></li>
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">Spay &amp; Neuter Surgeries</a></li>
					<li><a href="#services" class="hover:text-emerald-400 transition-colors">In-House Lab &amp; Digital X-Ray</a></li>
				</ul>
			</div>

			<!-- Col 3: Clinic Hours & Location -->
			<div class="space-y-3">
				<h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Clinic Hours &amp; Location</h4>
				<div class="text-xs font-mono text-slate-400 space-y-1.5 leading-relaxed">
					<p class="text-slate-300 font-semibold">Makana Family Veterinary Clinic</p>
					<p>4200 Precision Parkway, Suite 100</p>
					<p>San Francisco, CA 94107</p>
					<div class="pt-2 text-slate-300">
						<p><strong class="text-emerald-400">Mon–Fri:</strong> 8:00 AM – 6:00 PM</p>
						<p><strong class="text-emerald-400">Saturday:</strong> 8:30 AM – 2:00 PM</p>
						<p><strong class="text-slate-500">Sunday:</strong> Closed (ER On-Call)</p>
					</div>
				</div>
			</div>

			<!-- Col 4: Standards & Technology -->
			<div class="space-y-3">
				<h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Care Standards</h4>
				<ul class="space-y-2 text-xs font-mono text-slate-400">
					<li>Fear-Free Certified Protocols</li>
					<li>Cat-Friendly Practice Guidelines</li>
					<li>AAHA Accredited Standards</li>
					<li>Cloudflare D1 &amp; R2 Fast Portal</li>
					<li>100% Upfront Pricing Guarantee</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Copyright Row -->
		<div class="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
			<div>
				© 2026 Makana Family Veterinary Clinic. All rights reserved.
			</div>
			<div class="flex items-center gap-4">
				<span>Global Edge Hosting</span>
				<span>•</span>
				<span>Instant Pet Records</span>
				<span>•</span>
				<span>SvelteKit + Svelte 5</span>
			</div>
		</div>
	</div>
</footer>

