<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY } from '$env/static/public';
	import Swal from 'sweetalert2';
	let loading = true;
	let profile = null;
	let storePhone = '';
	let storeType = '';
	let storeEmail = '';
	let storeName = '';
	let storeNameError = '';
	let phoneError = '';
	let emailError = '';
	onMount(async () => {
		profile = localStorage.getItem('profile')
			? JSON.parse(localStorage.getItem('profile') || '')
			: null;
		await GetProfile();
		await GetPackage();
		loading = false;
	});

	const GetProfile = async () => {
		let config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/user/get/${profile.uid}`, config);
		const data = await result.json();
		profile = data.data;
		localStorage.setItem('profile', JSON.stringify(data.data));
	};

	async function GetPackage() {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/package/get`, config);
		const data = await result.json();
		profile = {
			...profile,
			package_name: data.data.find((e) => e.id === profile?.package_id)?.package_name || ''
		};
	}

	const UpdateProfile = async () => {
		const config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			},
			body: JSON.stringify({
				id: profile.id,
				store_phone: storePhone,
				store_category_type: storeType,
				store_email: storeEmail,
				store_name: storeName
			})
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/user/update`, config);
		const data = await result.json();
		if (data.message === 'Success') {
			const modal = document.getElementById('modal_update_profile');
			modal.close();
			Swal.fire({
				width: '26em',
				imageUrl: 'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'สำเร็จ',
				text: 'แก้ไขข้อมูลผู้ใช้สำเร็จ',
				confirmButtonText: 'ตกลง',
				customClass: {
					container: 'mb-0 pt-2 text-md',
					image: 'mb-2',
					title: 'text-xl pt-1',
					htmlContainer: 'text-md pt-2',
					actions: 'w-100 px-3 mt-2',
					confirmButton: 'btn btn-primary bg-primary text-white w-100'
				}
			}).then(() => {
				window.location.reload();
			});
		}
	};

	function formatDate(isoDate: string) {
		const date = new Date(isoDate);

		// Format to DD/MM/YYYY
		const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

		return formattedDate;
	}
	async function CopyCodeToClipboard(code: string) {
		const Toast = Swal.mixin({
			toast: true,
			position: 'bottom',
			iconColor: 'white',
			showConfirmButton: false,
			timer: 1500
		});
		navigator.clipboard.writeText(code).then(
			async function () {
				await Toast.fire({
					imageUrl:
						'https://img2.pic.in.th/pic/download-4ee155f4d99bcfb97.png',
					imageWidth: 18,
					imageHeight: 18,
					title: 'คัดลอก Code แล้ว',
					background: '#ECFDF3',
					customClass: {
						popup: 'px-3 py-1 rounded-3 mb-5 d-flex align-items-center',
						title: 'fw-normal mx-2 text-success',
						image: 'p-0 m-0'
					}
				});
			},
			async function (err) {
				await Toast.fire({
					imageUrl:
						'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
					imageWidth: 18,
					imageHeight: 18,
					title: 'ไม่สามารถคัดลอก Code ได้',
					background: '#FFFAEB',
					customClass: {
						popup: 'px-3 py-1 rounded-3 mb-5 d-flex align-items-center',
						title: 'fw-normal mx-2 text-warning',
						image: 'p-0 m-0'
					}
				});
			}
		);
	}
</script>

{#if !loading}
	<div class="w-100">
		<div class="row mx-0">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative" style="height:100vh">
				<div class="card p-3 shadow mb-3">
					<div class="d-flex align-items-center">
						<img
							alt="user"
							src={profile?.picture || 'https://img2.pic.in.th/pic/Avatar9a802c5e3f7f13e6.png'}
							class="rounded-circle me-4"
							width="48px"
							height="48px"
						/>
						<div>
							<div class="fw-semibold">{profile?.name_th || '-'}</div>
							<small>รหัสผู้ใช้: #{profile?.id?.toString().padStart(5, '0') || '-'}</small>
						</div>
					</div>
					<hr class="my-3" />
					<div class="d-flex align-items-center">
						แพ็กเกจ: <h6 class="h6 mb-0 ms-1">{profile?.package_name || '-'}</h6>
					</div>
					<div class="d-flex align-items-center mb-3">
						วันที่หมดอายุ: <h6 class="h6 mb-0 ms-1">
							{profile?.package_name && profile?.package_change_date
								? formatDate(profile.package_change_date.split('T')[0])
								: '-'}
						</h6>
					</div>
					<div class="flex justify-center mb-3">
						<div class="w-100 bg-secondary-subtle h-2 rounded-3">
							<div
								class="bg-primary h-2 rounded-3"
								style="width:{(profile?.quota_usage / profile?.quota_all) * 100}%"
							></div>
						</div>
					</div>
					<div class="d-flex justify-content-between mb-2">
						<div>การใช้งาน</div>
						<div class="d-flex align-items-end">
							<h4 class="h4 fw-semibold mx-1 mb-0">{profile?.quota_usage || 0}</h4>
							/<span class="mx-1 fw-light mb-0 text-secondary">{profile?.quota_all || 0}</span>
						</div>
					</div>
					<button
						class="btn bg-primary text-white w-100"
						on:click={() => {
							window.location.href = '/package';
						}}>ซื้อแพ็กเกจ</button
					>
				</div>
				<div class="card p-3 shadow mb-3">
					<div class="d-flex justify-content-between">
						<h4 class="fw-semibold mb-3">ข้อมูลร้านค้า</h4>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							width="16"
							height="16"
							on:click={() => {
								const modal = document.getElementById('modal_update_profile');
								modal.showModal();
								storePhone = profile.store_phone || '';
								storeName = profile.store_name || '';
								storeEmail = profile.store_email || '';
							}}
							><path
								fill="#667085"
								d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"
							/></svg
						>
					</div>

					<div class="d-flex">
						<span class="text-secondary w-40">ชื่อร้านค้า</span>
						<span class="w-100">{profile?.store_name || '-'}</span>
					</div>
					<div class="d-flex">
						<span class="text-secondary w-40">เบอร์โทรศัพท์</span>
						<span class="w-100">{profile?.store_phone || '-'}</span>
					</div>
					<div class="d-flex">
						<span class="text-secondary w-40">อีเมล</span>
						<span class="w-100">{profile?.store_email || '-'}</span>
					</div>
				</div>
				<div class="card p-3 shadow mb-3">
						<h4 class="fw-semibold mb-3">API Key</h4>
					<div class="d-flex justify-content-between w-100 flex-wrap">
						<span>{profile?.access_token || '-'}</span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
							width="16"
							height="16"
							on:click={() => {
								CopyCodeToClipboard(profile?.access_token || '');
							}}
							><path
								fill="#667085" d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"/></svg>

					</div>
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
<dialog id="modal_update_profile" class="modal">
	<div class="modal-box">
		<!-- {currentId} {Status} -->
		<form method="dialog">
			<div class="d-flex justify-content-between">
				<h5 class="h5 fw-semibold mb-0">แก้ไขข้อมูลร้านค้า</h5>
				<button class="text-lg w-8 h-8 rounded-circle text-secondary">✕</button>
			</div>
		</form>
		<div class="text-secondary mb-1">ชื่อร้านค้า</div>
		<input
			type="text"
			name="storeName"
			bind:value={storeName}
			class="form-control {storeNameError && 'border-danger'}"
			placeholder="กรุณากรอกชื่อร้านค้า"
		/>
		{#if storeNameError}
			<div class="text-danger mt-1">
				{storeNameError}
			</div>
		{/if}
		<div class="text-secondary mt-3 mb-1">เบอร์โทรศัพท์</div>
		<input
			type="tel"
			name="phone"
			bind:value={storePhone}
			on:input={(event) => {
				if (event && event.target) {
					let inputValue = event.target.value.replace(/[^0-9]/g, '').slice(0, 10);
					event.target.value = inputValue;
				}
			}}
			on:blur={() => {
				if (!storePhone || storePhone.length < 10) {
					phoneError = 'กรุณากรอกเบอร์โทรศัพท์';
				} else {
					phoneError = '';
				}
			}}
			class="form-control {phoneError && 'border-danger'}"
			placeholder="กรุณากรอกเบอร์โทรศัพท์"
		/>
		{#if phoneError}
			<div class="text-danger mt-1">
				{phoneError}
			</div>
		{/if}
		<div class="text-secondary mt-3 mb-1">อีเมล</div>
		<input
			type="email"
			name="email"
			bind:value={storeEmail}
			on:blur={() => {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ตรวจสอบรูปแบบอีเมล
				if (!storeEmail) {
					emailError = 'กรุณากรอกอีเมล';
				} else if (!emailRegex.test(storeEmail)) {
					emailError = 'กรุณากรอกอีเมลให้ถูกต้อง';
				} else {
					emailError = '';
				}
			}}
			class="form-control {emailError && 'border-danger'}"
			placeholder="กรุณากรอกอีเมล"
		/>
		{#if emailError}
			<div class="text-danger mt-1">
				{emailError}
			</div>
		{/if}
		<button
			class="btn bg-primary text-white w-100 mt-3"
			on:click={() => {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ตรวจสอบรูปแบบอีเมล
				storeNameError = '';
				phoneError = '';
				emailError = '';
				if (!storeName) {
					storeNameError = 'กรุณากรอกชื่อร้านค้า';
				} else if (!storePhone || storePhone.length < 10) {
					phoneError = 'กรุณากรอกเบอร์โทรศัพท์';
				} else if (!storeEmail) {
					emailError = 'กรุณากรอกอีเมล';
				} else if (!emailRegex.test(storeEmail)) {
					emailError = 'กรุณากรอกอีเมลให้ถูกต้อง';
				} else {
					UpdateProfile();
				}
			}}>บันทึก</button
		>
	</div>
</dialog>

<style scoped>
	@media (min-width: 1024px) {
		.lg\:h-screen {
			height: calc(100vh - 41px);
		}
	}
	@media (min-width: 768px) {
		.lg\:h-screen {
			height: calc(100vh - 41px);
		}
	}
	.spin {
		display: inline-block;
		animation: spin 2s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
