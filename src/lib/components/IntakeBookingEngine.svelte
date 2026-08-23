<script lang="ts">
	import type { Service, SpeciesType, UrgencyLevel, Appointment } from '$lib/types';
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import TimeSlotSelector from '$lib/components/TimeSlotSelector.svelte';

	interface Props {
		services: Service[];
		selectedService?: Service | null;
	}

	let { services = [], selectedService }: Props = $props();

	// Form State using Svelte 5 runes
	let clientName = $state('');
	let email = $state('');
	let phone = $state('');
	let petName = $state('');
	let species = $state<SpeciesType>('Canine');
	let breed = $state('');
	let ageYears = $state<string>('');
	let weightKg = $state<string>('');
	let serviceSlug = $state<string>('');
	let urgencyLevel = $state<UrgencyLevel>('routine');
	let symptoms = $state('');
	let scheduledDate = $state(
		new Date(Date.now() + 86400000).toISOString().split('T')[0]
	);
	let selectedSlot = $state('09:30 AM');
	let attachedFiles = $state<File[]>([]);

	// Submission state
	let isSubmitting = $state(false);
	let submitError = $state<string | null>(null);
	let confirmedAppointment = $state<Appointment | null>(null);

	// Sync when a service is selected from the Service Matrix
	$effect(() => {
		if (selectedService) {
			serviceSlug = selectedService.slug;
		} else if (!serviceSlug && services.length > 0) {
			serviceSlug = services[0].slug;
		}
	});

	const activeServiceObj = $derived(
		services.find((s) => s.slug === serviceSlug) || services[0]
	);

	const speciesOptions: { id: SpeciesType; label: string; icon: string }[] = [
		{ id: 'Canine', label: 'Canine (Dog)', icon: '🐕' },
		{ id: 'Feline', label: 'Feline (Cat)', icon: '🐈' },
		{ id: 'Small Mammal', label: 'Rabbit / Small Pet', icon: '🐇' },
		{ id: 'Avian', label: 'Avian (Bird)', icon: '🦜' },
		{ id: 'Exotic', label: 'Exotic / Reptile', icon: '🦎' }
	];

	const urgencyOptions: { id: UrgencyLevel; label: string; desc: string; badge: string; color: string }[] = [
		{
			id: 'routine',
			label: 'Routine Wellness & Vaccines',
			desc: 'Annual physical, puppy/kitten shots, dental check, microchip',
			badge: 'Routine',
			color: 'border-slate-200 hover:border-slate-300'
		},
		{
			id: 'sick_visit',
			label: 'Sick Pet Visit',
			desc: 'Ear infection, mild limp, skin rash, mild vomiting or lethargy',
			badge: 'Sick Visit',
			color: 'border-amber-200 bg-amber-50/30 hover:border-amber-400'
		},
		{
			id: 'urgent_day',
			label: 'Same-Day Urgent Visit',
			desc: 'Acute daytime concern, sudden pain, or minor injury',
			badge: 'Same-Day',
			color: 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-500'
		}
	];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitError = null;

		// Validation
		if (!clientName.trim()) {
			submitError = 'Please enter pet parent / owner name.';
			return;
		}
		if (!email.trim() || !email.includes('@')) {
			submitError = 'Please provide a valid email address.';
			return;
		}
		if (!phone.trim()) {
			submitError = 'Please enter a contact phone number.';
			return;
		}
		if (!petName.trim()) {
			submitError = 'Please enter your pet’s name.';
			return;
		}

		isSubmitting = true;

		try {
			const formData = new FormData();
			formData.append('client_name', clientName.trim());
			formData.append('email', email.trim());
			formData.append('phone', phone.trim());
			formData.append('pet_name', petName.trim());
			formData.append('species', species);
			formData.append('breed', breed.trim());
			if (ageYears) formData.append('age_years', ageYears);
			if (weightKg) formData.append('weight_kg', weightKg);
			formData.append('service_type', serviceSlug);
			formData.append('urgency_level', urgencyLevel);
			formData.append('symptoms', symptoms.trim());
			formData.append('scheduled_at', scheduledDate);
			formData.append('time_slot', selectedSlot);

			// Append R2 attachments
			for (const file of attachedFiles) {
				formData.append('attachments', file);
			}

			const response = await fetch('/api/appointments', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				throw new Error(result.error || 'Failed to confirm appointment booking.');
			}

			confirmedAppointment = result.appointment;
		} catch (err: any) {
			console.error('Submission error:', err);
			submitError = err.message || 'An error occurred while scheduling your appointment.';
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		confirmedAppointment = null;
		clientName = '';
		email = '';
		phone = '';
		petName = '';
		breed = '';
		ageYears = '';
		weightKg = '';
		symptoms = '';
		attachedFiles = [];
		submitError = null;
	}

	function formatPrice(cents: number): string {
		return `$${(cents / 100).toLocaleString('en-US')}`;
	}
</script>

<section id="intake" class="py-20 sm:py-28 bg-surface-50 border-b border-slate-200/80 relative">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Title -->
		<div class="text-center max-w-3xl mx-auto mb-14">
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-mono mb-3 shadow-clinical-sm font-semibold">
				<span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
				<span>ONLINE APPOINTMENT BOOKING</span>
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
				Schedule Your Pet’s Visit Online
			</h2>
			<p class="mt-3 text-base text-slate-600">
				Select your preferred consultation window, upload previous vaccine or medical records to Cloudflare R2, and secure an instant confirmation.
			</p>
		</div>

		{#if confirmedAppointment}
			<!-- SUCCESS CONFIRMATION STATE -->
			<div class="max-w-3xl mx-auto bg-white rounded-3xl border border-emerald-200 shadow-clinical-lg p-8 sm:p-12 text-center animate-fade-in relative overflow-hidden">
				<div class="absolute -right-12 -top-12 w-48 h-48 bg-emerald-50 rounded-full blur-2xl pointer-events-none"></div>

				<div class="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-600/20">
					<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>

				<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-bold mb-3">
					<span>APPOINTMENT CONFIRMED • SAVED TO PET PORTAL</span>
				</div>

				<h3 class="text-2xl sm:text-3xl font-extrabold text-slate-950">
					We Look Forward to Seeing You &amp; {confirmedAppointment.pet_name}!
				</h3>
				<p class="mt-2 text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
					Your visit has been reserved and your clinical notes and records have been linked.
				</p>

				<!-- Reference Token Card -->
				<div class="mt-8 p-6 rounded-2xl bg-slate-950 text-white text-left font-mono border border-slate-800 shadow-xl max-w-xl mx-auto">
					<div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs">
						<span class="text-slate-400">APPOINTMENT REFERENCE TOKEN</span>
						<span class="text-emerald-400 font-bold">STATUS: CONFIRMED</span>
					</div>

					<div class="text-2xl sm:text-3xl font-bold tracking-wider text-emerald-400 mb-4">
						{confirmedAppointment.reference_code}
					</div>

					<div class="grid grid-cols-2 gap-y-2.5 text-xs text-slate-300">
						<div>
							<span class="text-slate-500 block">Patient / Species:</span>
							<span class="font-bold text-white">{confirmedAppointment.pet_name} ({confirmedAppointment.species})</span>
						</div>
						<div>
							<span class="text-slate-500 block">Owner / Parent:</span>
							<span class="font-bold text-white">{confirmedAppointment.client_name}</span>
						</div>
						<div>
							<span class="text-slate-500 block">Scheduled Time:</span>
							<span class="font-bold text-white">{confirmedAppointment.scheduled_at} @ {confirmedAppointment.time_slot}</span>
						</div>
						<div>
							<span class="text-slate-500 block">Attending Doctor:</span>
							<span class="font-bold text-emerald-300">{confirmedAppointment.clinician_assigned || 'Dr. Maya Lin'}</span>
						</div>
						{#if confirmedAppointment.attachments && confirmedAppointment.attachments.length > 0}
							<div class="col-span-2 pt-2 border-t border-slate-800">
								<span class="text-slate-500 block">Attached Records:</span>
								<span class="font-medium text-emerald-400">
									{confirmedAppointment.attachments.length} file(s) saved in R2 vault
								</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Actions -->
				<div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
					<button
						type="button"
						onclick={() => window.print()}
						class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm transition-all"
					>
						<svg class="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="6 9 6 2 18 2 18 9"></polyline>
							<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
							<rect x="6" y="14" width="12" height="8"></rect>
						</svg>
						<span>Print Visit Details</span>
					</button>

					<button
						type="button"
						onclick={resetForm}
						class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-700 hover:bg-emerald-800 text-sm transition-all shadow-sm"
					>
						<span>Book Another Pet</span>
					</button>
				</div>
			</div>
		{:else}
			<!-- MAIN INTAKE FORM & SIDEBAR -->
			<form onsubmit={handleSubmit} class="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<!-- Form Columns (8 cols) -->
				<div class="lg:col-span-8 space-y-8">
					<!-- Step 1: Patient Profile & Species -->
					<div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-clinical-sm">
						<div class="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
							<div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-sm border border-emerald-200">
								1
							</div>
							<div>
								<h3 class="text-lg font-bold text-slate-900">Pet &amp; Species Information</h3>
								<p class="text-xs text-slate-500 font-mono">Basic details about your furry family member</p>
							</div>
						</div>

						<!-- Species Selector -->
						<div class="mb-6">
							<span class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-2">
								Select Species *
							</span>
							<div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
								{#each speciesOptions as sp}
									<button
										type="button"
										onclick={() => (species = sp.id)}
										class="p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 {species === sp.id
											? 'bg-slate-950 text-white border-slate-950 shadow-sm'
											: 'bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'}"
									>
										<span class="text-xl">{sp.icon}</span>
										<span class="text-xs font-semibold">{sp.label.split(' ')[0]}</span>
									</button>
								{/each}
							</div>
						</div>

						<!-- Pet Name, Breed, Age, Weight -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label for="petName" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
									Pet's Name *
								</label>
								<input
									id="petName"
									type="text"
									bind:value={petName}
									required
									placeholder="e.g. Milo, Luna, Buster"
									class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
								/>
							</div>

							<div>
								<label for="breed" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
									Breed / Mix
								</label>
								<input
									id="breed"
									type="text"
									bind:value={breed}
									placeholder="e.g. Golden Retriever, Domestic Shorthair"
									class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
								/>
							</div>

							<div>
								<label for="ageYears" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
									Age (Years)
								</label>
								<input
									id="ageYears"
									type="number"
									step="0.1"
									bind:value={ageYears}
									placeholder="e.g. 2.5"
									class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
								/>
							</div>

							<div>
								<label for="weightKg" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
									Weight (kg or approx)
								</label>
								<input
									id="weightKg"
									type="number"
									step="0.1"
									bind:value={weightKg}
									placeholder="e.g. 14.5"
									class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
								/>
							</div>
						</div>

						<!-- Urgency Level Selection -->
						<div class="mt-6 pt-5 border-t border-slate-100">
							<span class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-2.5">
								Reason For Visit / Urgency *
							</span>
							<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
								{#each urgencyOptions as u}
									<button
										type="button"
										onclick={() => (urgencyLevel = u.id)}
										class="p-3.5 rounded-2xl border text-left transition-all relative {urgencyLevel === u.id
											? 'border-slate-950 bg-slate-950 text-white shadow-sm'
											: u.color + ' bg-white text-slate-800'}"
									>
										<div class="flex items-center justify-between mb-1">
											<span class="text-xs font-bold">{u.label}</span>
											<span
												class="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold {urgencyLevel === u.id
													? 'bg-slate-800 text-emerald-400'
													: 'bg-slate-100 text-slate-600'}"
											>
												{u.badge}
											</span>
										</div>
										<p class="text-[11px] {urgencyLevel === u.id ? 'text-slate-300' : 'text-slate-500'}">
											{u.desc}
										</p>
									</button>
								{/each}
							</div>
						</div>
					</div>

					<!-- Step 2: Client & Contact Info -->
					<div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-clinical-sm">
						<div class="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
							<div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-sm border border-emerald-200">
								2
							</div>
							<div>
								<h3 class="text-lg font-bold text-slate-900">Pet Parent / Owner Contact</h3>
								<p class="text-xs text-slate-500 font-mono">For appointment reminders and medical record notifications</p>
							</div>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div>
								<label for="clientName" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
									Your Full Name *
								</label>
								<input
									id="clientName"
									type="text"
									bind:value={clientName}
									required
									placeholder="e.g. Sarah Jenkins"
									class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
								/>
							</div>

							<div>
								<label for="email" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
									Email Address *
								</label>
								<input
									id="email"
									type="email"
									bind:value={email}
									required
									placeholder="e.g. sarah@example.com"
									class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
								/>
							</div>

							<div>
								<label for="phone" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
									Phone Number *
								</label>
								<input
									id="phone"
									type="tel"
									bind:value={phone}
									required
									placeholder="e.g. +1 (555) 234-5678"
									class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
								/>
							</div>
						</div>
					</div>

					<!-- Step 3: Clinical Protocol & Diagnostic Attachments (R2 Dropzone) -->
					<div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-clinical-sm">
						<div class="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
							<div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-sm border border-emerald-200">
								3
							</div>
							<div>
								<h3 class="text-lg font-bold text-slate-900">Service Selection &amp; Previous Records</h3>
								<p class="text-xs text-slate-500 font-mono">Upload prior vaccine records, adoption certificates, or recent vet notes</p>
							</div>
						</div>

						<!-- Service Selection Dropdown -->
						<div class="mb-5">
							<label for="serviceSelect" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
								Select Primary Service *
							</label>
							<select
								id="serviceSelect"
								bind:value={serviceSlug}
								class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white font-medium text-slate-800"
							>
								{#each services as s}
									<option value={s.slug}>
										{s.title} ({formatPrice(s.price_cents)} • {s.duration_minutes}m)
									</option>
								{/each}
							</select>
						</div>

						<!-- Symptoms & Notes -->
						<div class="mb-6">
							<label for="symptoms" class="block text-xs font-mono font-semibold text-slate-700 uppercase mb-1.5">
								Notes or Symptoms to Share with the Vet
							</label>
							<textarea
								id="symptoms"
								bind:value={symptoms}
								rows="3"
								placeholder="e.g. Scratching left ear for 3 days, due for annual rabies booster, or questions about diet..."
								class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
							></textarea>
						</div>

						<!-- R2 File Dropzone -->
						<FileDropzone
							files={attachedFiles}
							onFilesChange={(files) => (attachedFiles = files)}
						/>
					</div>

					<!-- Step 4: Time Slot & Scheduling Window -->
					<div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-clinical-sm">
						<div class="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
							<div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-sm border border-emerald-200">
								4
							</div>
							<div>
								<h3 class="text-lg font-bold text-slate-900">Choose Appointment Time</h3>
								<p class="text-xs text-slate-500 font-mono">Select a convenient date and time for your visit</p>
							</div>
						</div>

						<TimeSlotSelector
							selectedDate={scheduledDate}
							selectedSlot={selectedSlot}
							onDateChange={(d) => (scheduledDate = d)}
							onSlotChange={(s) => (selectedSlot = s)}
						/>
					</div>
				</div>

				<!-- Sticky Summary & Submission Panel (4 cols) -->
				<div class="lg:col-span-4">
					<div class="sticky top-24 rounded-3xl bg-white border border-slate-200/90 shadow-clinical-md p-6 sm:p-7 space-y-6">
						<div>
							<div class="flex items-center justify-between text-xs font-mono mb-2">
								<span class="text-slate-500 uppercase">Appointment Summary</span>
								<span class="text-emerald-700 font-bold">SECURE BOOKING</span>
							</div>
							<h3 class="text-xl font-extrabold text-slate-950">
								{activeServiceObj?.title || 'Selected Service'}
							</h3>
							<p class="text-xs text-slate-500 mt-1 font-mono">
								Category: <span class="capitalize font-semibold text-slate-700">{activeServiceObj?.category?.replace('_', ' ') || 'General'}</span>
							</p>
						</div>

						<div class="border-t border-slate-100 pt-4 space-y-2.5 text-xs font-mono">
							<div class="flex justify-between">
								<span class="text-slate-500">Patient:</span>
								<span class="font-bold text-slate-900">{petName || '—'} ({species})</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-500">Visit Type:</span>
								<span class="font-bold capitalize text-slate-800">
									{urgencyLevel.replace('_', ' ')}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-500">Schedule:</span>
								<span class="font-bold text-slate-900">{scheduledDate} @ {selectedSlot}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-500">Attached Files:</span>
								<span class="font-bold text-emerald-700">{attachedFiles.length} file(s)</span>
							</div>
						</div>

						<!-- Pricing breakdown -->
						<div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
							<div class="flex items-center justify-between mb-1">
								<span class="text-xs font-mono text-slate-500">Estimated Procedure Fee</span>
								<span class="text-lg font-bold font-mono text-slate-950">
									{formatPrice(activeServiceObj?.price_cents || 6500)}
								</span>
							</div>
							<div class="text-[11px] font-mono text-emerald-700">
								✓ Clear transparent pricing
							</div>
						</div>

						{#if submitError}
							<div class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-700 flex items-start gap-2">
								<svg class="w-4 h-4 text-red-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<circle cx="12" cy="12" r="10" />
									<line x1="12" y1="8" x2="12" y2="12" />
									<line x1="12" y1="16" x2="12.01" y2="16" />
								</svg>
								<span>{submitError}</span>
							</div>
						{/if}

						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 text-sm font-sans"
						>
							{#if isSubmitting}
								<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span>Saving Appointment...</span>
							{:else}
								<span>Confirm &amp; Schedule Visit</span>
								<svg class="w-4 h-4 text-emerald-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M5 12h14"></path>
									<path d="m12 5 7 7-7 7"></path>
								</svg>
							{/if}
						</button>

						<div class="text-center">
							<span class="text-[11px] font-mono text-slate-400">
								Confidential pet health records • Fast online confirmation
							</span>
						</div>
					</div>
				</div>
			</form>
		{/if}
	</div>
</section>

