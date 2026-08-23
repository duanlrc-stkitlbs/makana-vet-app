<script lang="ts">
	interface Props {
		selectedDate: string;
		selectedSlot: string;
		onDateChange: (date: string) => void;
		onSlotChange: (slot: string) => void;
	}

	let { selectedDate, selectedSlot, onDateChange, onSlotChange }: Props = $props();

	// Generate the next 7 days for quick date selection
	const quickDays = $derived.by(() => {
		const days = [];
		const base = new Date();
		for (let i = 0; i < 6; i++) {
			const d = new Date(base);
			d.setDate(base.getDate() + i);
			const iso = d.toISOString().split('T')[0];
			const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
			const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			days.push({ iso, dayName, dateFormatted });
		}
		return days;
	});

	const timeSlots = [
		{ period: 'Morning Slots', slots: ['08:30 AM', '09:30 AM', '10:45 AM', '11:30 AM'] },
		{ period: 'Afternoon Slots', slots: ['01:15 PM', '02:30 PM', '03:45 PM', '04:30 PM'] },
		{ period: 'Evening & Priority', slots: ['05:30 PM', '06:45 PM', 'Immediate ER'] }
	];
</script>

<div class="space-y-4">
	<!-- Date Selection Row -->
	<div>
		<div class="flex items-center justify-between mb-2 text-xs font-mono">
			<span class="text-slate-600 font-semibold uppercase">1. Select Appointment Date</span>
			<span class="text-emerald-700 font-medium">Synced with D1 Schedule</span>
		</div>

		<div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
			{#each quickDays as day}
				<button
					type="button"
					onclick={() => onDateChange(day.iso)}
					class="p-2 rounded-xl text-center border transition-all {selectedDate === day.iso
						? 'bg-slate-950 text-white border-slate-950 shadow-sm'
						: 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}"
				>
					<div class="text-[11px] font-medium {selectedDate === day.iso ? 'text-emerald-400' : 'text-slate-500'}">
						{day.dayName}
					</div>
					<div class="text-xs font-mono font-bold mt-0.5">
						{day.dateFormatted}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Time Slot Selection Grid -->
	<div>
		<div class="flex items-center justify-between mb-2 text-xs font-mono">
			<span class="text-slate-600 font-semibold uppercase">2. Select Consultation Window</span>
			<span class="text-slate-400 font-normal">Eastern Time (ET)</span>
		</div>

		<div class="space-y-3">
			{#each timeSlots as group}
				<div>
					<div class="text-[11px] font-mono text-slate-400 uppercase mb-1.5">{group.period}</div>
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
						{#each group.slots as slot}
							<button
								type="button"
								onclick={() => onSlotChange(slot)}
								class="py-2 px-3 rounded-xl text-xs font-mono font-medium border transition-all flex items-center justify-center gap-1.5 {selectedSlot ===
								slot
									? 'bg-emerald-700 text-white border-emerald-800 shadow-sm font-bold'
									: 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'}"
							>
								{#if slot.includes('ER')}
									<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
								{/if}
								<span>{slot}</span>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
