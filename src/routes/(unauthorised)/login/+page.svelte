<script lang="ts">
	import { onMount } from 'svelte';
	import paysoLogo from '$lib/image/SURE2copy.jpg';
	import Swal from 'sweetalert2';
	import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY, PUBLIC_DOMAIN } from '$env/static/public';

	let loading = false;
	let username = "";
	let password = "";
	let show_password = false;
	onMount(async () => { });
	async function Login() {
			try {
				const config: RequestInit = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', apikey: PUBLIC_BACKEND_API_KEY },
					body: JSON.stringify({
						username: username,
						password: password
					})
				};
				const datalogin = await fetch(`${PUBLIC_API_ENDPOINT}/login`, config)
					.then((response) => response.json())
					.catch((error) => console.error(error));
				if (datalogin.data.id) {
					localStorage.setItem('profile', JSON.stringify(datalogin.data));
					if (datalogin.data.step < 10) {
									window.location.href = `/advice?step=${datalogin.data.step}`;
								} else {
									window.location.href = '/dashboard';
								}
				}else{
					return Swal.fire({
					width: '26em',
					imageUrl:
						'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'เกิดข้อผิดพลาด',
					text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
					confirmButtonText: 'ตกลง',
					customClass: {
						container: 'mb-0 pt-2 text-md',
						image: 'mb-2',
						title: 'text-xl pt-1',
						htmlContainer: 'text-md pt-2',
						actions: 'w-100 px-3 mt-2',
						confirmButton: 'btn btn-primary bg-primary text-white w-100'
					}
				});
				}
			} catch (error) {
				loading = false;
				return Swal.fire({
					width: '26em',
					imageUrl:
						'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'เกิดข้อผิดพลาด',
					text: 'กรุณาลองใหม่อีกครั้ง',
					confirmButtonText: 'ตกลง',
					customClass: {
						container: 'mb-0 pt-2 text-md',
						image: 'mb-2',
						title: 'text-xl pt-1',
						htmlContainer: 'text-md pt-2',
						actions: 'w-100 px-3 mt-2',
						confirmButton: 'btn btn-primary bg-primary text-white w-100'
					}
				});
			}
	}
</script>

{#if !loading}
	<div class="w-100 min-vh-100 d-flex align-items-center justify-content-center">
		<div class="row w-100">
			<div class="col-12 col-lg-7 col-xl-8 login-background min-vh-100 d-none d-lg-block p-0">
				<div class="d-flex p-5 w-100 h-100 align-items-center" style="background-color: #000000bb;">
					<div class="px-10">
						<h1 class="fw-bold text-white h1">
							ดูข้อมูลสลิปและการใช้งานผ่านกราฟและสถิติตามช่วงเวลา
						</h1>
						<h4 class="fw-bold text-white h4">
							แพ็กเกจการใช้งานที่หลากหลาย พร้อมการชำระเงินสะดวกด้วย QR Code เชื่อมต่อ LINE
							เพื่อแชร์จำนวนการใช้งานจากแพ็กเกจที่ซื้อ
						</h4>
						<span class="text-white"
							>ยินดีต้อนรับสู่แดชบอร์ดที่ให้คุณดูสถิติและวิเคราะห์ข้อมูลได้อย่างง่ายดาย!</span
						>
					</div>
				</div>
			</div>
			<div
				class="col-12 col-lg-5 col-xl-4 min-vh-100 d-flex align-items-center justify-content-center position-relative"
				style="background-color: #f1f4fe;"
			>
				<div class="text-center w-75">
					<img alt="logo" src={paysoLogo} width="50" class="mb-3 rounded-circle mx-auto" />
					<div class="fw-bold mb-3">เข้าสู่ระบบ</div>
					<input type="text" class="form-control mb-3" bind:value={username} placeholder="ชื่อผู้ใช้"/>
					<div class="position-relative">
					{#if show_password}
					<input type="text" class="form-control mb-3" bind:value={password} placeholder="รหัสผ่าน"/>
					<svg class="position-absolute z-50 top-2 right-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="24" on:click={() => show_password = !show_password}><path fill="#acacac" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/></svg>
					{:else}
					<input type="password" class="form-control mb-3" bind:value={password}/>
					<svg class="position-absolute z-50 top-2 right-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="22" on:click={() => show_password = !show_password}><path fill="#acacac" d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg>
					{/if}
				</div>
					<button
						class="btn btn-primary bg-primary text-white w-100 mb-3 d-flex align-items-between py-0 px-1"
						type="button"
						on:click={Login}
					>
						เข้าสู่ระบบ
					</button>
				</div>
				<div class="text-center w-100 text-sm text-gray-300 position-absolute z-50 bottom-1">
					v.1.0.2
				</div>
			</div>
		</div>
	</div>
{:else}
	<div
		class="d-flex min-vh-100 w-100 justify-content-center align-items-center position-fixed bg-white z-50"
	>
		<div class="svg-container">
			<svg
				width="130"
				viewBox="0 0 97 53"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
			>
				<rect x="0.5" width="96" height="52.7473" fill="url(#pattern0_40_6806)" />
				<defs>
					<pattern
						id="pattern0_40_6806"
						patternContentUnits="objectBoundingBox"
						width="1"
						height="1"
					>
						<use xlink:href="#image0_40_6806" transform="matrix(0.000961538 0 0 0.00175 0 -0.41)" />
					</pattern>
					<image
						id="image0_40_6806"
						width="1040"
						height="1040"
						xlink:href="https://img5.pic.in.th/file/secure-sv1/download83d2394b5f3ec781.png"
					/>
				</defs>
			</svg>
		</div>
	</div>
{/if}
