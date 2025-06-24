<script context="module" lang="ts">
	export type NavItem = {
		id: number;
		title: string;
		link: string;
	};
</script>

<script lang="ts">
	import cookie from 'cookie';
	import logo from '$lib/image/SureSure-white@1040x.png';
	import { onMount } from 'svelte';
	export let navItems: NavItem[] = [];
	let isMenuOpen = false;
	let profile: { step: number; user_type: string; name_th: any; } | null = null;
	let isOpen = false;

	onMount(() => {
		profile = localStorage.getItem('profile')
			? JSON.parse(localStorage.getItem('profile') || '')
			: null;
	});

	function handleLogout() {
		localStorage.removeItem('profile');
		if (profile?.user_type === 'admin') {
			window.location.replace('/admin/login');
		} else if (profile?.user_type === 'merchant-register') {
			window.location.replace('/login');
		}else{
			window.location.replace('/');
		}
	}
</script>

<nav class="position-fixed w-100 top-0 left-0 z-50" style="background-color:#1353ec;">
	<div class="position-relative d-flex h-11 align-items-center justify-content-between">
		<div class="d-flex px-3">
			<img
				class="w-12 h-10 object-contain"
				src={logo}
				alt="Your Company"
				on:click={() => {
					if (profile?.step === 99) {
						window.location.href = `${profile?.user_type === 'admin' && '/admin'}/dashboard`;
					}
				}}
			/>
			{#if profile?.user_type === 'merchant'}
				<div class="d-none d-md-flex align-items-center text-white">
					<a class="text-sm px-3 text-white d-flex text-decoration-none" href="/dashboard">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" class="me-1"
							><path
								fill="#ffffff"
								d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"
							/></svg
						>
						รายงาน</a
					>
					<a class="text-sm px-3 text-white d-flex text-decoration-none" href="/bank">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" class="me-1"
							><path
								fill="#ffffff"
								d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160l0 8c0 13.3 10.7 24 24 24l400 0c13.3 0 24-10.7 24-24l0-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224l-64 0 0 196.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512l448 0c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224l-64 0 0 192-40 0 0-192-64 0 0 192-48 0 0-192-64 0 0 192-40 0 0-192zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
							/></svg
						>
						บัญชีธนาคาร</a
					>
					<a class="text-sm px-3 text-white d-flex text-decoration-none" href="/rooms">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="12" class="me-1"
							><path
								fill="#ffffff"
								d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z"
							/></svg
						>
						สาขาร้านค้า</a
					>
				</div>
			{/if}
		</div>
		<div class="d-flex align-items-center position-relative mx-2">
			<div>
				<span
					class="d-none d-md-flex bg-[#DBE8FF] rounded-circle align-items-center justify-content-center"
					style="width:32px;height:32px;"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20px"
						height="20px"
						viewBox="0 0 24 24"
						{...$$props}
					>
						<g fill="none" stroke="#1353EC">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.5 21v-5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v5"
							/>
							<path
								d="M5 11v6c0 1.886 0 2.828.586 3.414S7.114 21 9 21h6c1.886 0 2.828 0 3.414-.586S19 18.886 19 17v-6M4.621 4.515c.182-.728.273-1.091.544-1.303C5.437 3 5.812 3 6.562 3h10.876c.75 0 1.125 0 1.397.212c.27.212.362.575.544 1.303l1.203 4.814c.097.388.146.581.135.739a1 1 0 0 1-.69.883c-.15.049-.354.049-.763.049c-.533 0-.8 0-1.023-.052a2 2 0 0 1-1.393-1.18c-.089-.212-.132-.47-.217-.983c-.024-.144-.036-.216-.05-.235a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489l-.018.1A2 2 0 0 1 14.352 11h-.204a2 2 0 0 1-1.936-1.726l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489l-.018.1A2 2 0 0 1 9.852 11h-.204A2 2 0 0 1 7.73 9.374l-.018-.1l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235c-.085.514-.128.77-.217.983a2 2 0 0 1-1.392 1.18C5.536 11 5.27 11 4.736 11c-.409 0-.613 0-.763-.049a1 1 0 0 1-.69-.883c-.01-.158.038-.351.135-.739z"
							/>
						</g>
					</svg>
				</span>
			</div>
			<button
				class="d-flex align-items-center mx-2"
				on:click={() => {
					isOpen = !isOpen;
				}}
			>
				<div class="d-none d-md-block text-white me-2">{profile?.name_th || ''}</div>
				<svg
					class="d-block d-md-none"
					xmlns="http://www.w3.org/2000/svg"
					width="20px"
					height="20px"
					viewBox="0 0 512 512"
					><path
						fill="#ffffff"
						d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
					/></svg
				>
				{#if isOpen}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						width="14"
						height="14"
						class="d-none d-md-block"
						><path
							fill="#ffffff"
							d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
						/></svg
					>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						width="14"
						height="14"
						class="d-none d-md-block"
						><path
							fill="#ffffff"
							d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
						/></svg
					>
				{/if}
			</button>

			{#if isOpen}
				<div
					class="position-absolute mt-1 bg-white border rounded-3 shadow-lg overflow-y-auto z-50 w-44 end-0 top-8 text-dark"
				>
					{#if profile?.user_type === 'merchant'}
						<div
							class="d-flex align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/profile';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
								/></svg
							>
							<span>โปรไฟล์</span>
						</div>
						<div
							class="d-flex d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/dashboard';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"
								/></svg
							>
							<span>รายงาน</span>
						</div>
						<div
							class="d-flex d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/bank';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160l0 8c0 13.3 10.7 24 24 24l400 0c13.3 0 24-10.7 24-24l0-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224l-64 0 0 196.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512l448 0c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224l-64 0 0 192-40 0 0-192-64 0 0 192-48 0 0-192-64 0 0 192-40 0 0-192zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
								/></svg
							>
							<span>บัญชีธนาคาร</span>
						</div>
						<div
							class="d-flex d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/rooms';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z"
								/></svg
							>
							<span>สาขาร้านค้า</span>
						</div>
					{:else}
						<div
							class="d-flex d-md-none d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/admin/dashboard';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
								/></svg
							>
							<span>แดชบอร์ด</span>
						</div>
						<div
							class="d-flex d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/admin/report-transection';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
								/></svg
							>
							<span>ธุรกรรม</span>
						</div>
						<div
							class="d-flex d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/admin/user';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
								/></svg
							>
							<span>ผู้ใช้</span>
						</div>

						<div
							class="d-flex d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/admin/report-room';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z"
								/></svg
							>
							<span>สาขาร้านค้า</span>
						</div>
						<div
							class="d-flex d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/admin/package';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M50.7 58.5L0 160l208 0 0-128L93.7 32C75.5 32 58.9 42.3 50.7 58.5zM240 160l208 0L397.3 58.5C389.1 42.3 372.5 32 354.3 32L240 32l0 128zm208 32L0 192 0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-224z"
								/></svg
							>
							<span>จัดการแพ็กเก็จ</span>
						</div>
						<div
							class="d-flex d-md-none align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
							on:click={() => {
								window.location.href = '/admin/report-room';
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
								/></svg
							>

							<span>บันทึก</span>
						</div>
					{/if}
					<hr />
					<div
						class="d-flex align-items-center p-2 cursor-pointer hover:bg-gray-100 d-flex"
						on:click={handleLogout}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" class="me-1"
							><path
								fill="#344054"
								d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
							/></svg
						>
						<span>ออกจากระบบ</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	{#if isMenuOpen}
		<div class="sm:hidden" id="mobile-menu">
			<div class="space-y-1 px-2 pb-3 pt-2">
				<ul class=" text-white">
					{#each navItems as item}
						<li class=" my-1">
							<a href={item.link} class=" ">{item.title}</a>
						</li>
					{/each}
					<li>
						<a class="py-2 hover:bg-gray-100 rounded" href="/profile"><button>โปรไฟล์</button></a>
					</li>
					<li>
						<a class="py-2 hover:bg-gray-100 rounded whitespace-nowrap" on:click={handleLogout}
							><button style="color:#F04438;">ออกจากระบบ</button></a
						>
					</li>
				</ul>
			</div>
		</div>
	{/if}
</nav>

<style scoped>
	.dropdown summary {
		list-style: none;
		outline: none;
		cursor: pointer;
		position: relative;
		padding-right: 1.5rem; /* ให้พื้นที่สำหรับลูกศร */
	}

	.dropdown summary::after {
		content: '\25BC'; /* Unicode สำหรับลูกศรชี้ลง */
		position: absolute;
		right: 0.5rem;
		font-size: 0.75rem; /* ขนาดของลูกศร */
		color: white; /* เปลี่ยนสีลูกศรเป็นสีขาว */
		transition: color 0.2s ease; /* เพิ่มการเปลี่ยนแปลงของสี */
	}

	.dropdown[open] summary::after {
		content: '\25BC'; /* ลูกศรชี้ลงคงที่ (ไม่หมุน) */
	}
</style>
