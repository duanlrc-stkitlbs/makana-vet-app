<script lang="ts">
	import type { Specialist } from '$lib/types';
	import { DEFAULT_SPECIALISTS } from '$lib/data/mock-data';

	interface Props {
		specialists?: Specialist[];
		onConsultSpecialist?: (specialist: Specialist) => void;
	}

	let { specialists = DEFAULT_SPECIALISTS, onConsultSpecialist }: Props = $props();

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -80;
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}
</script>

<section id="specialists" class="py-20 sm:py-28 bg-surface-50 border-b border-slate-200/80 relative">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
			<div>
				<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-mono mb-3">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
					<span>OUR VETERINARY CARE TEAM</span>
				</div>
				<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
					Compassionate Doctors &amp; Technicians
				</h2>
				<p class="mt-2 text-base text-slate-600 max-w-2xl">
					Meet the friendly veterinarians and licensed care team dedicated to gentle, stress-free veterinary visits.
				</p>
			</div>

			<div class="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white p-3 rounded-xl border border-slate-200 shadow-clinical-sm">
				<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
				<span>Welcoming New Dogs, Cats &amp; Small Pets</span>
			</div>
		</div>

		<!-- Specialists Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each specialists as spec}
				<div class="bento-card rounded-2xl p-5 flex flex-col justify-between hover:border-slate-400/80 transition-all bg-white">
					<div>
						<!-- Avatar / Image with status badge -->
						<div class="relative mb-4 rounded-xl overflow-hidden aspect-square bg-slate-100 border border-slate-200">
							<img
								src={spec.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'}
								alt={spec.name}
								class="w-full h-full object-cover transition-all duration-300"
								loading="lazy"
							/>
							<div class="absolute top-2 right-2">
								<span
									class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-sm {spec.status === 'On Duty'
										? 'bg-emerald-500 text-slate-950'
										: 'bg-slate-900 text-white'}"
								>
									● {spec.status}
								</span>
							</div>
						</div>

						<!-- Specialist Name & Credentials -->
						<div class="space-y-1">
							<h3 class="text-base font-bold text-slate-950">{spec.name}</h3>
							<div class="text-xs font-mono text-emerald-700 font-semibold">{spec.credentials}</div>
							<div class="text-xs font-semibold text-slate-700 pt-0.5">{spec.title}</div>
						</div>

						<p class="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
							{spec.bio}
						</p>
					</div>

					<div class="mt-4 pt-3 border-t border-slate-100 space-y-2">
						<div class="text-[10px] font-mono text-slate-400 truncate" title={spec.board_cert}>
							{spec.board_cert}
						</div>

						<button
							type="button"
							onclick={() => {
								if (onConsultSpecialist) onConsultSpecialist(spec);
								scrollTo('intake');
							}}
							class="w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold bg-slate-50 text-slate-700 hover:bg-emerald-700 hover:text-white border border-slate-200 transition-colors flex items-center justify-center gap-1"
						>
							<span>Book Appointment</span>
							<span>→</span>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

