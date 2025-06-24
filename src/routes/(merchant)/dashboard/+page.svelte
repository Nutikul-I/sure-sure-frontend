<script lang="ts">
	import Chart from './Chart.svelte';
	import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY, PUBLIC_LINE_CLIENT_ID } from '$env/static/public';
	import { onMount } from 'svelte';
	import * as XLSX from 'xlsx';
	import liff from '@line/liff';

	// TRUE
	// "TRANSACTION_SUCCESSFUL"
	// "RECEIVER_NOT_MATCH"
	// FALSE
	// "TRANSACTION_UNSUCCESSFUL"
	// "TRANSACTION_COUNTERFEIT"
	// "ERROR"

	let loading = true;

	let profile = null;
	let listTransaction = [];
	let listOverView = [];
	let listTable = [];

	let startDate = new Date(new Date().setDate(1)).toISOString().slice(0, 10);
	let endDate = new Date().toISOString().slice(0, 10);
	let monthDate = new Date().toISOString().slice(0, 7);
	let statusSelect = '';

	// ข้อมูลสำหรับกราฟ
	let chartData = {};

	onMount(async () => {
		profile = localStorage.getItem('profile')
			? JSON.parse(localStorage.getItem('profile') || '')
			: null;
		await GetProfile();
		await Promise.all([GetPackage(), GetTransaction()]);
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
	async function GetTransaction() {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/transaction/get/${profile.id}`, config);
		const data = await result.json();
		listTransaction = data?.data || [];

		if (startDate && endDate) {
			listOverView =
				listTransaction.filter((transaction) => {
					if (!transaction.created_date) return false;
					const transDate = new Date(transaction.created_date.split('T')[0]);
					return transDate >= new Date(startDate) && transDate <= new Date(endDate);
				}) || [];
		} else {
			listOverView = data?.data || [];
		}
		if (monthDate) {
			let arrayDate = await getDatesInMonth(monthDate);
			chartData = {
				labels: arrayDate.map((e) => e.split('-')[2]),
				datasets: [
					{
						label: 'สลิปที่ถูกต้อง',
						data: arrayDate.map((e) => {
							return listTransaction.filter(
								(t) =>
									t.created_date.split('T')[0] === e &&
									['TRANSACTION_SUCCESSFUL'].includes(t.status)
							).length;
						}),
						backgroundColor: '#06E79B',
						borderColor: '#06E79B',
						borderWidth: 1
					},
					{
						label: 'สลิปที่มีข้อผิดพลาด',
						data: arrayDate.map((e) => {
							return listTransaction.filter(
								(t) =>
									t.created_date.split('T')[0] === e &&
									!['TRANSACTION_SUCCESSFUL'].includes(t.status)
							).length;
						}),
						backgroundColor: '#E02424',
						borderColor: '#E02424',
						borderWidth: 1
					}
				]
			};
		}

		listTable = listTransaction.filter(
			(e) => (!statusSelect || e.status === statusSelect) && e.status != 'ERROR'
		);

	}
	async function dowloadExportExcel() {
		
		const userAgent = navigator.userAgent.toLowerCase();
		const isIOS = /ipad|iphone|ipod/.test(userAgent);
		const isAndroid = /android/.test(userAgent);

		if (isIOS || isAndroid) {
			try{
				await liff.init({ liffId: `${PUBLIC_LINE_CLIENT_ID}-1MAOmQra` });
			}catch(e){}
			setTimeout(async () => { 
				liff.openWindow({
					url: `https://slippay.paysolutions.io/report?startDate=${startDate}&endDate=${endDate}&id=${profile.id}`, // URL ที่จะเปิด
					external: true
				}); 
			}, 300);
		} else {
			let status: { [key: string]: string } = {
				TRANSACTION_SUCCESSFUL: 'สลิปถูกต้อง',
				TRANSACTION_UNSUCCESSFUL: 'ตรวจสอบไม่สำเร็จ',
				TRANSACTION_COUNTERFEIT: 'มีการปลอมแปลงข้อมูล',
				RECEIVER_NOT_MATCH: 'ชื่ิอบัญชีไม่ตรง'
			};
			let data =
				listOverView
					?.filter((item) => ['TRANSACTION_SUCCESSFUL'].includes(item.status))
					.map((item, index) => {
						return {
							ลำดับ: index + 1,
							วันที่โอน: item.trans_date || '-',
							เวลาโอน: item.trans_time || '-',
							'Transfer ID': item.ref_no || '-',
							ชื่อบัญชีผู้โอน: item.sender_name || '-',
							เลขบัญชีผู้โอน: item.sender_account_no || '-',
							ชื่อบัญชีผู้รับ: item.receive_name || '-',
							เลขบัญชีผู้รับ: item.receive_account_no || '-',
							จำนวนเงิน: item.amount || '0',
							สถานะ: status[item.status] || '-'
						};
					}) || [];
			const worksheet = XLSX.utils.json_to_sheet(data);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

			XLSX.writeFile(workbook, 'data.xlsx');
		}
	}
	// FUNCTION
	function getDatesInMonth(date) {
		const [startYear, startMonth] = date.split('-').map(Number);
		const [endYear, endMonth] = date.split('-').map(Number);
		const start = new Date(startYear, startMonth - 1, 1); // วันที่เริ่มต้นของเดือน
		const end = new Date(endYear, endMonth, 0); // วันที่สิ้นสุดของเดือน

		const dates = [];

		while (start <= end) {
			dates.push(
				`${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`
			);
			start.setDate(start.getDate() + 1); // เลื่อนไปวันที่ถัดไป
		}

		return dates;
	}
	function formatDate(dateString: any) {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) {
			return 'Invalid date';
		}
		const day = date.getDate();
		const month = date.toLocaleString('th-TH', { month: 'short' });
		const year = date.getFullYear();

		return `${day} ${month} ${year}`;
	}
	function formatTime(text: string) {
		try {
			const time = text.split('T')[1].split('.')[0]; // แยกเวลา
			const date = new Date(`1970-01-01T${time}Z`); // สร้าง Date object จากเวลาใน UTC
			date.setHours(date.getHours() + 7); // เพิ่ม 7 ชั่วโมง (สำหรับเวลาในประเทศไทย)

			const thailandTime = date.toISOString().split('T')[1].split('.')[0]; // แปลงเวลาเป็น ISO และแยกเวลา
			return thailandTime;
		} catch (e) {
			return '';
		}
	}
</script>

{#if !loading}
	<div class="min-h-screen flex flex-col xl:px-20 lg:px-10 md:px-10 px-0">
		<div class="mx-3">
			<h4 class="h4 mt-4 mb-3">รายงาน</h4>
			<div class="row">
				<div class="col-12 col-md-6 col-lg-5 col-xxl-5 d-flex align-items-center mb-3">
					<input type="date" bind:value={startDate} class="form-control" autocomplete="off" />
					<span class="whitespace-nowrap px-2">ถึง</span>
					<input type="date" bind:value={endDate} class="form-control" autocomplete="off" />
				</div>
				<div class="col-12 col-md-2 col-lg-2">
					<button
						class="btn bg-primary text-white mb-3"
						style="width:100%"
						on:click={async () => {
							loading = true;
							await GetTransaction();
							loading = false;
						}}
						>ค้นหา
					</button>
				</div>
			</div>

			<div class="row">
				<!-- สลิปที่ตรวจสอบทั้งหมด -->
				<div class="col-12 col-md-4 col-lg-3 mb-3">
					<div class="card shadow p-3 text-center">
						<span class="mb-4">สลิปที่ตรวจสอบทั้งหมด</span>
						<h1 class="fw-semibold h1 mb-3" style="font-size:36px">
							{listOverView.length || 0}
						</h1>
						<button class="btn bg-white border-1 border-gray-300" on:click={dowloadExportExcel}
							>ดาวน์โหลดไฟล์ Excel</button
						>
					</div>
				</div>
				<!-- สลิปที่ถูกต้อง -->
				<div class="col-6 col-md-4 col-lg-3 mb-3">
					<div class="card shadow p-3">
						<div class="d-flex mb-3">
							<div
								class="rounded-3 d-flex align-items-center justify-content-center"
								style="background-color: #00E698;padding:12px"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_622_10671)">
										<path
											d="M6.25002 9.99996L8.75002 12.5L13.75 7.49996M18.3334 9.99996C18.3334 14.6023 14.6024 18.3333 10 18.3333C5.39765 18.3333 1.66669 14.6023 1.66669 9.99996C1.66669 5.39759 5.39765 1.66663 10 1.66663C14.6024 1.66663 18.3334 5.39759 18.3334 9.99996Z"
											stroke="white"
											stroke-width="1.67"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</g>
									<defs>
										<clipPath id="clip0_622_10671">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</div>
						</div>
						<span class="mb-1 text-nowrap">สลิปที่ถูกต้อง</span>
						<h2 class="fw-semibold h2 mb-0" style="font-size:px">
							{listOverView?.filter((e) => ['TRANSACTION_SUCCESSFUL'].includes(e.status)).length ||
								0}
						</h2>
						<small class="text-nowrap">
							<b
								>{(
									(listOverView?.filter((e) => ['TRANSACTION_SUCCESSFUL'].includes(e.status))
										.length /
										listOverView.length) *
										100 || 0
								).toFixed(2)}%</b
							> ของสลิปทั้งหมด
						</small>
					</div>
				</div>
				<!-- สลิปที่มีข้อผิดพลาด -->
				<div class="col-6 col-md-4 col-lg-3 mb-3">
					<div class="card shadow p-3">
						<div class="d-flex mb-3">
							<div
								class="rounded-3 d-flex align-items-center justify-content-center"
								style="background-color: #D92D20;padding:12px"
							>
								<svg
									width="20"
									height="17"
									viewBox="0 0 20 17"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9.99975 6.49995V9.83328M9.99975 13.1666H10.0081M8.84585 2.24305L1.99178 14.0819C1.61161 14.7386 1.42153 15.0669 1.44962 15.3364C1.47412 15.5714 1.59727 15.785 1.7884 15.924C2.00753 16.0833 2.38691 16.0833 3.14568 16.0833H16.8538C17.6126 16.0833 17.992 16.0833 18.2111 15.924C18.4022 15.785 18.5254 15.5714 18.5499 15.3364C18.578 15.0669 18.3879 14.7386 18.0077 14.0819L11.1537 2.24305C10.7748 1.58875 10.5854 1.26159 10.3383 1.15172C10.1228 1.05587 9.87672 1.05587 9.66117 1.15172C9.41406 1.26159 9.22466 1.58875 8.84585 2.24305Z"
										stroke="white"
										stroke-width="1.6"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						</div>
						<span class="mb-1 text-nowrap">สลิปที่มีข้อผิดพลาด</span>
						<h2 class="fw-semibold h2 mb-0" style="font-size:px">
							{listOverView?.filter((e) => !['TRANSACTION_SUCCESSFUL'].includes(e.status)).length ||
								0}
						</h2>
						<small class="text-nowrap">
							<b
								>{(
									(listOverView?.filter((e) => !['TRANSACTION_SUCCESSFUL'].includes(e.status))
										.length /
										listOverView.length) *
										100 || 0
								).toFixed(2)}%</b
							> ของสลีปทั้งหมด
						</small>
					</div>
				</div>
				<!-- การใช้งาน -->
				<div class="col-12 col-lg-3 mb-3">
					<div class="card shadow p-3 text-center">
						<div class="d-none d-lg-flex mb-2">
							<div
								class="rounded-3 d-flex align-items-center justify-content-center"
								style="background-color: #1353EC;padding:12px"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3.33337 6.5C3.33337 5.09987 3.33337 4.3998 3.60586 3.86502C3.84554 3.39462 4.22799 3.01217 4.6984 2.77248C5.23318 2.5 5.93324 2.5 7.33337 2.5H12.6667C14.0668 2.5 14.7669 2.5 15.3017 2.77248C15.7721 3.01217 16.1545 3.39462 16.3942 3.86502C16.6667 4.3998 16.6667 5.09987 16.6667 6.5V17.5L14.375 15.8333L12.2917 17.5L10 15.8333L7.70837 17.5L5.62504 15.8333L3.33337 17.5V6.5Z"
										stroke="white"
										stroke-width="1.6"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						</div>
						<div class="d-flex justify-content-between">
							<div>การใช้งาน</div>
							<div class="d-flex align-items-end">
								<h4 class="h4 fw-semibold mx-1 mb-0">{profile?.quota_usage || 0}</h4>
								/<span class="mx-1 fw-light mb-0 text-secondary">{profile?.quota_all || 0}</span>
							</div>
						</div>
						<div class="flex justify-center mb-1">
							<div class="w-100 bg-secondary-subtle h-2 rounded-3">
								<div
									class="bg-primary h-2 rounded-3"
									style="width:{(profile?.quota_usage / profile?.quota_all) * 100}%"
								></div>
							</div>
						</div>
						<div class="d-flex d-lg-block align-items-center justify-content-between">
							<div class="d-flex align-items-center">
								แพ็กเกจ: <h6 class="h6 mb-0 ms-1">{profile?.package_name || '-'}</h6>
							</div>
							<div class="d-flex align-items-center">
								วันที่หมดอายุ: <h6 class="h6 mb-0 ms-1">
									{profile?.package_name && profile?.package_change_date
										? formatDate(profile.package_change_date.split('T')[0])
										: '-'}
								</h6>
							</div>
						</div>
					</div>
				</div>
				<!-- กราฟแสดงข้อมูลในช่วงเดือน -->
				<div class="col-12 col-lg-6 mb-3">
					<div
						class="card shadow p-3 text-center"
						style="min-height:375px; max-height:500px; height: 100%"
					>
						<div class="row">
							<div class="col-12 col-xl-6 text-start mb-3">
								<span class="text-nowrap fw-semibold">กราฟแสดงข้อมูลในช่วงเดือน</span>
							</div>
							<div class="col-12 col-xl-6 d-flex mb-3">
								<input
									type="month"
									bind:value={monthDate}
									class="form-control w-100"
									autocomplete="off"
								/>
								<button
									class="btn bg-primary text-white ms-2"
									on:click={() => {
										GetTransaction();
									}}
									>ค้นหา
								</button>
							</div>
						</div>
						<Chart
							type="bar"
							data={chartData}
							options={{
								responsive: true,
								plugins: {
									legend: {
										position: 'top'
									}
								},
								scales: {
									x: {
										title: {
											display: true,
											text: 'วันที่'
										}
									},
									y: {
										title: {
											display: true,
											text: 'จำนวน'
										}
									}
								}
							}}
						/>
					</div>
				</div>
				<div class="col-12 col-lg-6 mb-3">
					<div
						class="card shadow p-3 text-center"
						style="min-height:375px; max-height:500px; height: 100%"
					>
						<div class="row">
							<div class="col-12 col-xl-6 text-start mb-3">
								<span class="text-nowrap fw-semibold">รายการย้อนหลัง</span>
							</div>
							<div class="col-12 col-xl-6 d-flex mb-3">
								<select bind:value={statusSelect} class="form-control w-100" autocomplete="off">
									<option value="">ทั้งหมด</option>
									<option value="TRANSACTION_SUCCESSFUL">สลิปถูกต้อง</option>
									<option value="RECEIVER_NOT_MATCH">บัญชีธนาคารไม่ตรงกับบัญชีผู้รับ</option>
									<option value="TRANSACTION_UNSUCCESSFUL">สลิปมีข้อผิดพลาด</option>
								</select>
								<button
									class="btn bg-primary text-white ms-2"
									on:click={() => {
										GetTransaction();
									}}
									>ค้นหา
								</button>
							</div>
						</div>
						<div class="table-responsive">
							<table class="table table-hover">
								<tbody>
									<tr class="bg-secondary-subtle">
										<td class="text-nowrap px-3">วันที่ทำรายการ</td>
										<td class="text-nowrap px-3">เวลาที่ทำรายการ</td>
										<td class="text-nowrap px-3">Transfer ID</td>
										<td class="text-nowrap px-3">สถานะ</td>
									</tr>
									{#each listTable as item}
										<tr>
											<td class="text-nowrap px-3"
												>{item.created_date
													? new Date(item.created_date).toLocaleDateString('th-TH', {
															day: '2-digit',
															month: '2-digit',
															year: 'numeric'
														})
													: '-'}</td
											>
											<td class="text-nowrap px-3"
												>{item.created_date ? formatTime(item.created_date) : '-'}</td
											>
											<td class="text-nowrap px-3">{item.ref_no || '-'}</td>
											<td>
												{#if item.status === 'TRANSACTION_SUCCESSFUL'}
													<span
														class="border-1 rounded-pill border-success text-success bg-success-subtle py-0 px-3 text-sm text-nowrap"
														>สลิปถูกต้อง</span
													>
												{:else if item.status === 'TRANSACTION_UNSUCCESSFUL' || item.status === 'TRANSACTION_COUNTERFEIT'}
													<span
														class="border-1 rounded-pill border-danger text-danger bg-danger-subtle py-0 px-3 text-sm text-nowrap"
														>สลิปมีข้อผิดพลาด</span
													>
												{:else if item.status === 'RECEIVER_NOT_MATCH'}
													<span
														class="border-1 rounded-pill border-danger text-danger bg-danger-subtle py-0 px-3 text-sm text-nowrap"
														>บัญชีธนาคารไม่ตรงกับบัญชีผู้รับ</span
													>
												{:else}
													<span
														class="border-1 rounded-pill border-secondary text-secondary bg-secondary-subtle py-0 px-3 text-sm text-nowrap"
														>ตรวจสอบไม่สำเร็จ</span
													>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
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
