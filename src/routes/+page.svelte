<script lang="ts">
	import type { PageData } from './$types';
	import type { Service, Specialist } from '$lib/types';
	import Header from '$lib/components/Header.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ServiceMatrix from '$lib/components/ServiceMatrix.svelte';
	import IntakeBookingEngine from '$lib/components/IntakeBookingEngine.svelte';
	import PricingTiers from '$lib/components/PricingTiers.svelte';
	import TechStackDiagnostics from '$lib/components/TechStackDiagnostics.svelte';
	import SpecialistsSection from '$lib/components/SpecialistsSection.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import AppointmentLookupModal from '$lib/components/AppointmentLookupModal.svelte';

	let { data }: { data: PageData } = $props();

	let selectedService = $state<Service | null>(null);
	let isLookupOpen = $state(false);

	function handleSelectService(service: Service) {
		selectedService = service;
	}

	function handleConsultSpecialist(specialist: Specialist) {
		// Auto select appropriate service based on specialist specialty
		if (specialist.specialty.includes('Surgery')) {
			selectedService = data.services.find((s) => s.category === 'surgery') || null;
		} else if (specialist.specialty.includes('Radiology') || specialist.specialty.includes('MRI')) {
			selectedService = data.services.find((s) => s.category === 'diagnostics') || null;
		} else if (specialist.specialty.includes('Emergency')) {
			selectedService = data.services.find((s) => s.category === 'teletriage') || null;
		}
	}

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -80;
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Makana Veterinary Medicine | Precision Edge Clinical Care</title>
	<meta
		name="description"
		content="High-performance modern veterinary clinic with instant edge intake, 24/7 tele-triage, and advanced diagnostics backed by Cloudflare D1 and R2."
	/>
</svelte:head>

<!-- Sticky Command Bar Header -->
<Header
	triageCapacity={data.triageCapacity}
	onOpenLookup={() => (isLookupOpen = true)}
	onBookClick={() => scrollTo('intake')}
/>

<main class="flex-1">
	<!-- Hero Section -->
	<Hero
		triageCapacity={data.triageCapacity}
		onBookClick={() => scrollTo('intake')}
	/>

	<!-- Interactive Service Matrix (Bento Grid) -->
	<ServiceMatrix
		services={data.services}
		onSelectService={handleSelectService}
	/>

	<!-- Edge Intake & Booking Engine (D1 + R2) -->
	<IntakeBookingEngine
		services={data.services}
		{selectedService}
	/>

	<!-- Transparency & Pricing Tiers -->
	<PricingTiers
		services={data.services}
		onSelectPlan={(plan) => {
			scrollTo('intake');
		}}
	/>

	<!-- Clinical Hardware & Diagnostics Tech Stack -->
	<TechStackDiagnostics />

	<!-- Veterinary Team Specialists -->
	<SpecialistsSection
		specialists={data.specialists}
		onConsultSpecialist={handleConsultSpecialist}
	/>
</main>

<!-- Footer with 24/7 ER Protocol and Edge Health -->
<Footer />

<!-- Appointment & Medical Record Lookup Modal -->
<AppointmentLookupModal
	isOpen={isLookupOpen}
	onClose={() => (isLookupOpen = false)}
/>
