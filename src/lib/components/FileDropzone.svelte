<script lang="ts">
	interface Props {
		files: File[];
		onFilesChange: (files: File[]) => void;
		maxFiles?: number;
		maxSizeBytes?: number;
	}

	let {
		files = [],
		onFilesChange,
		maxFiles = 5,
		maxSizeBytes = 10 * 1024 * 1024 // 10MB
	}: Props = $props();

	let isDragging = $state(false);
	let errorMessage = $state<string | null>(null);
	let fileInputRef: HTMLInputElement | null = null;

	const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
	const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

	function validateAndAdd(incomingFiles: FileList | File[]) {
		errorMessage = null;
		const validList: File[] = [...files];

		for (const file of Array.from(incomingFiles)) {
			if (validList.length >= maxFiles) {
				errorMessage = `Maximum of ${maxFiles} diagnostic attachments allowed per intake.`;
				break;
			}

			if (file.size > maxSizeBytes) {
				errorMessage = `File "${file.name}" exceeds the maximum limit of 10 MB.`;
				continue;
			}

			const ext = file.name.split('.').pop()?.toLowerCase() || '';
			const isMimeAllowed = allowedMimes.includes(file.type.toLowerCase()) || allowedExtensions.includes(ext);

			if (!isMimeAllowed) {
				errorMessage = `File "${file.name}" is not an allowed format (PDF, JPEG, PNG, WEBP).`;
				continue;
			}

			// Avoid duplicates
			if (!validList.some((f) => f.name === file.name && f.size === file.size)) {
				validList.push(file);
			}
		}

		onFilesChange(validList);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			validateAndAdd(e.dataTransfer.files);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			validateAndAdd(target.files);
			target.value = ''; // Reset
		}
	}

	function removeFile(index: number) {
		const updated = files.filter((_, i) => i !== index);
		onFilesChange(updated);
	}

	function formatBytes(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		const kb = bytes / 1024;
		if (kb < 1024) return kb.toFixed(1) + ' KB';
		return (kb / 1024).toFixed(2) + ' MB';
	}
</script>

<div class="w-full">
	<!-- Drag & Drop Zone -->
	<div
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={() => fileInputRef?.click()}
		role="button"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') fileInputRef?.click();
		}}
		class="w-full p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center relative overflow-hidden {isDragging
			? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
			: 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'}"
	>
		<input
			bind:this={fileInputRef}
			type="file"
			multiple
			accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
			onchange={handleFileSelect}
			class="hidden"
		/>

		<div class="flex flex-col items-center justify-center pointer-events-none">
			<div class="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-clinical-sm flex items-center justify-center text-slate-700 mb-3">
				<svg class="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" y1="3" x2="12" y2="15" />
				</svg>
			</div>

			<p class="text-sm font-semibold text-slate-900">
				<span>Drag &amp; drop medical records or</span>
				<span class="text-emerald-700 underline underline-offset-2 ml-1">browse files</span>
			</p>
			<p class="text-xs text-slate-500 font-mono mt-1">
				Direct Cloudflare R2 Upload • PDF, JPEG, PNG, WEBP (Max 10 MB per file)
			</p>
		</div>
	</div>

	<!-- Error Alert -->
	{#if errorMessage}
		<div class="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-700 flex items-center gap-2">
			<svg class="w-4 h-4 text-red-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="12" />
				<line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- File List Preview -->
	{#if files.length > 0}
		<div class="mt-4 space-y-2">
			<div class="text-xs font-mono text-slate-500 flex items-center justify-between">
				<span>ATTACHED CLINICAL ASSETS ({files.length}/{maxFiles})</span>
				<span class="text-emerald-700 font-semibold">R2 Pipeline Ready</span>
			</div>

			{#each files as file, index}
				<div class="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-clinical-sm text-xs font-mono">
					<div class="flex items-center gap-2.5 overflow-hidden">
						<div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 font-bold uppercase text-[10px]">
							{file.name.split('.').pop() || 'DOC'}
						</div>
						<div class="truncate">
							<div class="font-semibold text-slate-800 truncate">{file.name}</div>
							<div class="text-[11px] text-slate-400">{formatBytes(file.size)}</div>
						</div>
					</div>

					<button
						onclick={(e) => {
							e.stopPropagation();
							removeFile(index);
						}}
						type="button"
						class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
						title="Remove attachment"
					>
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
