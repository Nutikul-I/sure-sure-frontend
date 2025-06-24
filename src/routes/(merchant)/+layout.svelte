<script lang="ts">
	import '../../app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';
	import { onMount } from 'svelte';
	onMount(() => {});
</script>

<div>
	<Navbar />

	<div class="mt-5">
		<slot></slot>
	</div>
</div>
