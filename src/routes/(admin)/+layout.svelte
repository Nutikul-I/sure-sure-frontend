<script lang="ts">
	import '../../app.postcss';
	import Navbar, { type NavItem } from '$lib/component/navbar.svelte';

</script>

<div>
	<Navbar />
	 <div class="h-11"></div>
	<div class="row mx-0 p-0">
		<div class="col-12 col-md-3 col-xl-2 min-vh-100 p-0 d-none d-md-block bg-white">
			<button class="btn btn-outline-light bg-white rounded-0 border-0 d-flex justify-content-start w-100 fw-normal shadow-none" on:click={() => { window.location.href = '/admin/dashboard'; }} >
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
								/></svg
							>
							แดชบอร์ด</button>
			<button class="btn btn-outline-light bg-white rounded-0 border-0 d-flex justify-content-start w-100 fw-normal shadow-none" on:click={() => { window.location.href = '/admin/report-transection'; }} >
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" class="me-1"
							><path
								fill="#344054" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
							
								ธุรกรรม</button>
			<button class="btn btn-outline-light bg-white rounded-0 border-0 d-flex justify-content-start w-100 fw-normal shadow-none" on:click={() => { window.location.href = '/admin/user'; }} >
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" class="me-1"
								><path
									fill="#344054"
									d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
								/></svg
							>
							ผู้ใช้</button>
			<button class="btn btn-outline-light bg-white rounded-0 border-0 d-flex justify-content-start w-100 fw-normal shadow-none" on:click={() => { window.location.href = '/admin/report-room'; }} >
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="12" class="me-1"
							><path
								fill="#344054" d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z"/></svg>
							
								สาขาร้านค้า</button>
			<button class="btn btn-outline-light bg-white rounded-0 border-0 d-flex justify-content-start w-100 fw-normal shadow-none" on:click={() => { window.location.href = '/admin/package'; }} >
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" class="me-1"
							><path
								fill="#344054" d="M50.7 58.5L0 160l208 0 0-128L93.7 32C75.5 32 58.9 42.3 50.7 58.5zM240 160l208 0L397.3 58.5C389.1 42.3 372.5 32 354.3 32L240 32l0 128zm208 32L0 192 0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-224z"/></svg>
							
								จัดการแพ็กเก็จ</button>
			<!-- <button class="btn btn-outline-light bg-white rounded-0 border-0 d-flex justify-content-start w-100 fw-normal shadow-none" on:click={() => { window.location.href = '/admin/log'; }} >
			 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" class="me-1"
						><path
							fill="#344054" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
						
							บันทึก</button> -->
		</div>
		<div class="col-12 col-md-9 col-xl-10 px-0 py-3">
			<slot></slot>
		</div>
	</div>
</div>
