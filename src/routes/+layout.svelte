<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-[#fafbfd] selection:bg-emerald-500 selection:text-white">
	{@render children?.()}
</div>
