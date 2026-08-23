<script lang="ts">
	import type { TriageCapacity } from '$lib/types';

	interface Props {
		capacity?: TriageCapacity;
	}

	let { capacity = {
		status: 'Open & Welcoming',
		activeSpecialists: 3,
		erBedCapacityPercent: 45,
		avgTriageLatencySeconds: 8,
		edgeNode: 'IAD-01',
		triageQueueCount: 1
	} }: Props = $props();
</script>

<div
	class="inline-flex flex-wrap items-center gap-y-2 gap-x-3 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-clinical-sm text-xs font-mono text-slate-700 backdrop-blur-sm"
>
	<!-- Status Indicator -->
	<div class="flex items-center gap-1.5 font-semibold text-slate-900">
		<span class="relative flex h-2 w-2">
			<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
			<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
		</span>
		<span>{capacity.status}</span>
	</div>

	<span class="text-slate-300 hidden sm:inline">•</span>

	<!-- Active Doctors -->
	<div class="flex items-center gap-1">
		<svg class="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
		<span class="font-medium text-slate-800">{capacity.activeSpecialists} Doctors On Site Today</span>
	</div>

	<span class="text-slate-300 hidden sm:inline">•</span>

	<!-- Schedule Availability -->
	<div class="flex items-center gap-1.5">
		<div class="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
			<div
				class="h-full bg-emerald-500 rounded-full transition-all duration-500"
				style="width: {100 - capacity.erBedCapacityPercent}%"
			></div>
		</div>
		<span class="text-slate-600">Schedule Open: <strong class="text-slate-900">{100 - capacity.erBedCapacityPercent}% Open</strong></span>
	</div>

	<span class="text-slate-300 hidden md:inline">•</span>

	<!-- Check-in Wait -->
	<div class="hidden md:flex items-center gap-1 text-slate-500">
		<span>Avg Check-in:</span>
		<span class="font-semibold text-emerald-700">&lt; {capacity.avgTriageLatencySeconds || 8} mins</span>
	</div>

	<span class="text-slate-300 hidden lg:inline">•</span>

	<!-- Edge Node -->
	<div class="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
		<span>D1/R2 Cloud:</span>
		<span class="text-slate-700 font-bold">{capacity.edgeNode}</span>
	</div>
</div>

