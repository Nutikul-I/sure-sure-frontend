<script lang="ts">
	import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	let profile = null;
	let loading = true;
	let listPackages: any[] = [];
	let refNo = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;

	onMount(async () => {
		localStorage.removeItem('redirect_page');
		profile = localStorage.getItem('profile')
			? JSON.parse(localStorage.getItem('profile') || '')
			: null;
		await GetPackage();
		// await GetOrderPackage();
		loading = false;
	});

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
		listPackages = data.data?.filter((e) => e.amount > 0 && e.package_price > 0) || [];
	}

	// const GetOrderPackage = async () => {
	// 	const config = {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'ngrok-skip-browser-warning': 'true',
	// 			apikey: PUBLIC_BACKEND_API_KEY
	// 		}
	// 	};
	// 	const result = await fetch(`${PUBLIC_API_ENDPOINT}/order-package/get/${profile.id}`, config);
	// 	const data = await result.json();
	// 	const listOrderPackages = data.data?.filter((e) => e.price === 0) || [];

	// 	let free_trial = false;
	// 	// ดึงวันที่ปัจจุบัน
	// 	const currentDate = new Date();
	// 	const currentMonth = currentDate.getMonth();
	// 	const currentYear = currentDate.getFullYear();

	// 	// ตรวจสอบรายการใน listOrderPackages
	// 	for (let item of listOrderPackages) {
	// 		const createdDate = new Date(item.created_date);
	// 		if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
	// 			free_trial = true;
	// 		}
	// 	}
	// 	if (free_trial) {
	// 		listPackages = listPackages.filter((e) => e.package_price != 0);
	// 	}
	// };
</script>

{#if !loading}
	<div class="w-100 p-3 pt-5">
		<h5 class="text-center h5 fw-bold">ราคาแพ็กเกจ</h5>
		<div class="text-center text-sm text-secondary mb-4">
			เพิ่มความสะดวกสบายและประหยัดเวลาด้วยบริการตรวจสอบสลิปธนาคารของเรา เลือกแพ็กเกจที่เหมาะกับคุณ
		</div>

		<div class="row mx-0">
			{#each listPackages as pkg, i}
				<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
					<div class="card shadow overflow-hidden">
						<div class="card-body text-center p-3">
							<div class="d-flex justify-content-center mb-2">
								<span
									class="border-1 px-2 py-0 rounded-pill text-primary bg-primary-foreground fw-semibold"
									>{pkg.package_name}</span
								>
							</div>
							<h1 class="h1 fw-semibold mb-0" style="font-size: 32px">
								{pkg.package_price === 0 ? 'ฟรี' : '฿ ' + pkg.package_price.toLocaleString()}
							</h1>

							<span>{pkg.package_price !== 0 ? 'ราคา / เดือน' : '‎'}</span>
						</div>
						<div class="card-footer text-center p-3 border-0">
							<div class="d-flex mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									x="0px"
									y="0px"
									width="24"
									height="24"
									viewBox="0,0,256,256"
									><g
										fill="#146dec"
										fill-rule="nonzero"
										stroke="none"
										stroke-width="1"
										stroke-linecap="butt"
										stroke-linejoin="miter"
										stroke-miterlimit="10"
										stroke-dasharray=""
										stroke-dashoffset="0"
										font-family="none"
										font-weight="none"
										font-size="none"
										text-anchor="none"
										style="mix-blend-mode: normal"
										><g transform="scale(10.66667,10.66667)"
											><path
												d="M12,2c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c5.511,0 10,-4.489 10,-10c0,-5.511 -4.489,-10 -10,-10zM12,4c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8zM16.29297,8.29297l-6.29297,6.29297l-2.29297,-2.29297l-1.41406,1.41406l3.70703,3.70703l7.70703,-7.70703z"
											></path></g
										></g
									></svg
								>
								<span class="fw-semibold ps-3">{pkg.quota_limit?.toLocaleString() || 0} สลิป</span>
							</div>
							{#if pkg.package_price !== 0}
								<div class="d-flex mb-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										x="0px"
										y="0px"
										width="24"
										height="24"
										viewBox="0,0,256,256"
										><g
											fill="#146dec"
											fill-rule="nonzero"
											stroke="none"
											stroke-width="1"
											stroke-linecap="butt"
											stroke-linejoin="miter"
											stroke-miterlimit="10"
											stroke-dasharray=""
											stroke-dashoffset="0"
											font-family="none"
											font-weight="none"
											font-size="none"
											text-anchor="none"
											style="mix-blend-mode: normal"
											><g transform="scale(10.66667,10.66667)"
												><path
													d="M12,2c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c5.511,0 10,-4.489 10,-10c0,-5.511 -4.489,-10 -10,-10zM12,4c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8zM16.29297,8.29297l-6.29297,6.29297l-2.29297,-2.29297l-1.41406,1.41406l3.70703,3.70703l7.70703,-7.70703z"
												></path></g
											></g
										></svg
									>
									<span class="ps-3 h-5 overflow-hidden text-nowrap text-ellipsis"
										>ราคาเฉลี่ย {(pkg.package_price / pkg.quota_limit).toFixed(2)} บาท / สลิป</span
									>
								</div>
							{/if}
							<div class="d-flex mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									x="0px"
									y="0px"
									width="24"
									height="24"
									viewBox="0,0,256,256"
									><g
										fill="#146dec"
										fill-rule="nonzero"
										stroke="none"
										stroke-width="1"
										stroke-linecap="butt"
										stroke-linejoin="miter"
										stroke-miterlimit="10"
										stroke-dasharray=""
										stroke-dashoffset="0"
										font-family="none"
										font-weight="none"
										font-size="none"
										text-anchor="none"
										style="mix-blend-mode: normal"
										><g transform="scale(10.66667,10.66667)"
											><path
												d="M12,2c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c5.511,0 10,-4.489 10,-10c0,-5.511 -4.489,-10 -10,-10zM12,4c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8zM16.29297,8.29297l-6.29297,6.29297l-2.29297,-2.29297l-1.41406,1.41406l3.70703,3.70703l7.70703,-7.70703z"
											></path></g
										></g
									></svg
								>
								<span class="ps-3">ระยะเวลา 30 วัน</span>
							</div>
							{#if pkg.package_price === 0}
								<div class="d-flex mb-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										x="0px"
										y="0px"
										width="24"
										height="24"
										viewBox="0,0,256,256"
									></svg>
									<span class="ps-3">‎</span>
								</div>
							{/if}
							<button
								class="btn bg-primary w-100 text-white"
								on:click={async () => {
									if (profile.package_id) {
										Swal.fire({
											width: '26em',
											imageUrl:
												'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
											imageWidth: 72,
											imageHeight: 72,
											imageAlt: 'Custom image',
											showCloseButton: true,
											title: 'ยืนยันข้อมูล',
											html: `
											คุณมีแพ็กเกจที่ใช้งานอยู่<br/>คุณยืนยันที่จะเปลี่ยนแพ็กเกจใหม่หรือไม่<br/>
											<span class="text-danger">**จำนวนตรวจสอบสลิปที่คุณเหลืออยู่จะโดนรีเซ็ทใหม่</span>`,
											confirmButtonText: 'เปลี่ยนแพ็กเกจ',
											showCancelButton: true,
											cancelButtonText: 'ไม่เปลี่ยนแพ็กเกจ',
											customClass: {
												container: 'mb-0 pt-2 text-md',
												image: 'mb-2',
												title: 'text-xl pt-1',
												htmlContainer: 'text-md pt-2',
												actions: 'w-100 px-3 mt-2',
												confirmButton: 'btn btn-primary bg-primary text-white w-100 mb-2',
												cancelButton: 'btn btn-outline-secondary w-100'
											}
										}).then((result) => {
											if (result.isConfirmed) {
												localStorage.removeItem('packageData');
												localStorage.removeItem('redirect_page');
												localStorage.removeItem('refNo');
												localStorage.setItem('selectPackage', JSON.stringify(pkg));
												window.location.assign('/payment');
											}
										});
									} else {
										localStorage.removeItem('packageData');
										localStorage.removeItem('redirect_page');
										localStorage.removeItem('refNo');
										localStorage.setItem('selectPackage', JSON.stringify(pkg));
										window.location.assign('/payment');
									}
									// }
								}}>{pkg.Price === 0 ? 'ทดลองใช้' : 'ซื้อเลย'}</button
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="text-center content-center text-xl my-5" style="color: #0031E5;">
			<a href="/dashboard">ไปหน้า แดชบอร์ด >></a>
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
