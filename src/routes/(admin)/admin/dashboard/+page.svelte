<script lang="ts">
	// @ts-nocheck
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import Chart from './Chart.svelte';
	import { onMount } from 'svelte';

	//รับข้อมูลจาก server
	export let data: PageData;

	//รับข้อมูลจาก server
	let listOrder = data.orders;
	let listTransaction = data.transactions;
	let listUser = data.users;
	let listPackages = data.packages;

	const now = new Date();
	const currentMonth = now.getMonth();
	const currentYear = now.getFullYear();

	let loading = false; // ไม่ต้อง loading เพราะข้อมูลโหลดมาจาก server แล้ว
	const thaiMonths = [
		'มกราคม',
		'กุมภาพันธ์',
		'มีนาคม',
		'เมษายน',
		'พฤษภาคม',
		'มิถุนายน',
		'กรกฎาคม',
		'สิงหาคม',
		'กันยายน',
		'ตุลาคม',
		'พฤศจิกายน',
		'ธันวาคม'
	];
	let listBank = {
		'002': 'BBL',
		'004': 'KBANK',
		'006': 'KTB',
		'011': 'TMB',
		'014': 'SCB',
		'017': 'CITI',
		'020': 'SCBT',
		'022': 'UOBT',
		'024': 'UOBT',
		'025': 'BAY',
		'030': 'GOV',
		'031': 'HSBC',
		'033': 'GHB',
		'034': 'AGRI',
		'039': 'MHCB',
		'065': 'TBANK',
		'066': 'ISBT',
		'067': 'TISCO',
		'069': 'KK',
		'070': 'ACL',
		'071': 'TCRB',
		'073': 'LHBANK',
		'079': 'ANZ',
		'080': 'SMTB',
		'098': 'SMEB'
	};
	let card01: { thisMonth: number; previousMonths: number } | null = null;
	// let listOrder = [];
	// let listTransaction: never[] = [];
	// let listUser: any[] = [];
	// let listPackages: never[] = [];

	let chartDataCard02 = {
		labels: Array.from({ length: 30 }, (_, i) => i + 1),
		datasets: [
			{
				label: 'ยอดการตรวจสอบรายวัน',
				data: Array.from({ length: 30 }),
				backgroundColor: '#f6f0f7',
				borderColor: '#cd829e',
				borderWidth: 1,
				tension: 0.4
			}
		]
	};
	let monthDateCard02 = new Date().toISOString().slice(0, 7);

	let chartDataCard03 = {
		labels: thaiMonths,
		datasets: [
			{
				label: 'รายได้จากแพ็กเกจ',
				data: Array.from({ length: 12 }),
				backgroundColor: '#f6f0f7',
				borderColor: '#cd829e',
				borderWidth: 1,
				tension: 0.4
			}
		]
	};
	let yearDateCard03 = new Date().getFullYear();

	let chartDataCard04 = {
		labels: thaiMonths,
		datasets: [
			{
				label: 'ลูกค้าใหม่',
				data: Array.from({ length: 12 }),
				backgroundColor: '#b1e7f7',
				borderColor: '#3dc2ec',
				borderWidth: 1,
				tension: 0.4
			},
			{
				label: 'สลิปที่ถูกต้อง',
				data: Array.from({ length: 12 }),
				backgroundColor: '#8dd0a8',
				borderColor: '#41b06e',
				borderWidth: 1,
				tension: 0.4
			},
			{
				label: 'สลิปมีข้อผิดพลาด',
				data: Array.from({ length: 12 }),
				backgroundColor: '#e17474',
				borderColor: '#cd1818',
				borderWidth: 1,
				tension: 0.4
			},
			{
				label: 'เลขบัญชีไม่ตรงกับบัญชีผู้รับ',
				data: Array.from({ length: 12 }),
				backgroundColor: '#007263',
				borderColor: '#009688',
				borderWidth: 1,
				tension: 0.4
			},
			{
				label: 'จำนวนเงินน้อยกว่าขั้นต่ำที่กำหนด',
				data: Array.from({ length: 12 }),
				backgroundColor: '#afb2b2',
				borderColor: '#808080',
				borderWidth: 1,
				tension: 0.4
			},
			{
				label: 'เกิดข้อผิดพลาด',
				data: Array.from({ length: 12 }),
				backgroundColor: '#c148c5',
				borderColor: '#98079d',
				borderWidth: 1,
				tension: 0.4
			}
		]
	};
	let yearDateCard04 = new Date().getFullYear();

	let startDateCard05 = '';
	let endDateCard05 = '';
	let name_thCard05 = '';
	let statusCard05 = '';
	let searchCard06 = '';

	onMount(async () => {
		//calculate for chart
		calculateCard01();
		await GetChart04();
		updateChart02();
		updateChart03();
		// loading ถูกตั้งเป็น false แล้วตั้งแต่เริ่มต้น
	});

	// function for chart 01
	function calculateCard01() {
		card01 = listOrder
			.filter((e: any) => e.status === 'SUCCESS')
			.reduce(
				(acc: any, transaction: any) => {
					const transactionDate = new Date(transaction.created_date);
					if (
						transactionDate.getMonth() === currentMonth &&
						transactionDate.getFullYear() === currentYear
					) {
						acc.thisMonth += transaction.price;
					} else {
						acc.previousMonths += transaction.price;
					}
					return acc;
				},
				{ thisMonth: 0, previousMonths: 0 }
			);
	}

	// function for refresh data
	async function refreshData() {
		await invalidateAll(); // reload ข้อมูลจาก server
	}

	async function GetChart04() {
		chartDataCard04 = {
			labels: [],
			datasets: []
		};
		// ลูกค้าใหม่
		var userTotals = Array(12).fill(0);
		if (listUser.filter((e: any) => Number(e.created_date.slice(0, 4)) == yearDateCard04).length !== 0) {
			listUser
				.filter((e: any) => new Date(e.created_date).getFullYear() == yearDateCard04)
				.forEach((order: any) => {
					const date = new Date(order.created_date);
					const month = date.getMonth();
					userTotals[month] += 1;
				});
		}
		listUser
			.filter((e: any) => new Date(e.created_date).getFullYear() == yearDateCard04)
			.forEach((order: any) => {
				const date = new Date(order.created_date);
				const month = date.getMonth();
				userTotals[month] += 1;
			});

		//ใช้ข้อมูลจาก data.transactions แทนเรียก api
		var successTotals = Array(12).fill(0); // สลิปที่ถูกต้อง
		var unsuccessTotals = Array(12).fill(0); // สลิปที่มีข้อผิดพลาด
		var notmatchTotals = Array(12).fill(0); // เลขบัญชีไม่ตรงกับบัญชีผู้รับ
		var lessthanTotals = Array(12).fill(0); // จำนวนเงินน้อยกว่าขั้นต่ำที่กำ หนด
		var errorTotals = Array(12).fill(0); // เกิดข้อผิดพลาด
		if (
			listTransaction.filter((e: any) => Number(e.created_date.slice(0, 4)) == yearDateCard04).length !==
			0
		) {
			listTransaction
				.filter((e: any) => new Date(e.created_date).getFullYear() == yearDateCard04)
				.forEach((order: any) => {
					const date = new Date(order.created_date);
					const month = date.getMonth();
					if (order.status === 'TRANSACTION_SUCCESSFUL') {
						successTotals[month] += 1;
					} else if (
						order.status === 'TRANSACTION_UNSUCCESSFUL' ||
						order.status === 'TRANSACTION_COUNTERFEIT'
					) {
						unsuccessTotals[month] += 1;
					} else if (order.status === 'RECEIVER_NOT_MATCH') {
						notmatchTotals[month] += 1;
					} else if (order.status === 'AMOUNT_LESS_THAN_MINIMUM') {
						lessthanTotals[month] += 1;
					} else if (order.status === 'ERROR') {
						errorTotals[month] += 1;
					}
				});
		}
		chartDataCard04 = {
			labels: thaiMonths,
			datasets: [
				{
					label: 'ลูกค้าใหม่',
					data: userTotals,
					backgroundColor: '#b1e7f7',
					borderColor: '#3dc2ec',
					borderWidth: 1,
					tension: 0.4
				},
				{
					label: 'สลิปที่ถูกต้อง',
					data: successTotals,
					backgroundColor: '#8dd0a8',
					borderColor: '#41b06e',
					borderWidth: 1,
					tension: 0.4
				},
				{
					label: 'สลิปมีข้อผิดพลาด',
					data: unsuccessTotals,
					backgroundColor: '#e17474',
					borderColor: '#cd1818',
					borderWidth: 1,
					tension: 0.4
				},
				{
					label: 'เลขบัญชีไม่ตรงกับบัญชีผู้รับ',
					data: notmatchTotals,
					backgroundColor: '#007263',
					borderColor: '#009688',
					borderWidth: 1,
					tension: 0.4
				},
				{
					label: 'จำนวนเงินน้อยกว่าขั้นต่ำที่กำหนด',
					data: lessthanTotals,
					backgroundColor: '#afb2b2',
					borderColor: '#808080',
					borderWidth: 1,
					tension: 0.4
				},
				{
					label: 'เกิดข้อผิดพลาด',
					data: errorTotals,
					backgroundColor: '#c148c5',
					borderColor: '#98079d',
					borderWidth: 1,
					tension: 0.4
				}
			]
		};
	}

	function getDatesInMonth(date: string) {
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

	function updateChart02() {
		if (monthDateCard02) {
			chartDataCard02 = {
				labels: [],
				datasets: []
			};
			let arrayDate = getDatesInMonth(monthDateCard02);
			chartDataCard02 = {
				labels: arrayDate.map((e) => parseInt(e.split('-')[2])),
				datasets: [
					{
						label: 'ยอดการตรวจสอบรายวัน',
						data: arrayDate.map((e) => {
							return listTransaction.filter((t: any) => t.created_date.split('T')[0] === e).length;
						}),
						backgroundColor: '#f6f0f7',
						borderColor: '#cd829e',
						borderWidth: 1,
						tension: 0.4
					}
				]
			};
		}
	}

	function updateChart03() {
		if (yearDateCard03) {
			chartDataCard03 = {
				labels: [],
				datasets: []
			};
			var monthlyTotals = Array(12).fill(0);
			if (
				listOrder.filter(
					(e: any) => Number(e.created_date.slice(0, 4)) == yearDateCard03 && e.status === 'SUCCESS'
				).length !== 0
			) {
				listOrder
					.filter(
						(e: any) =>
							new Date(e.created_date).getFullYear() == yearDateCard03 && e.status === 'SUCCESS'
					)
					.forEach((order: any) => {
						const date = new Date(order.created_date);
						const month = date.getMonth();
						monthlyTotals[month] += order.price;
					});
			}

			chartDataCard03 = {
				labels: thaiMonths,
				datasets: [
					{
						label: 'รายได้จากแพ็กเกจ',
						data: monthlyTotals,
						backgroundColor: '#93a9f9',
						borderColor: '#4b70f5',
						borderWidth: 1,
						tension: 0.4
					}
				]
			};
		}
	}

	// เพิ่ม functions ที่ขาดหายไป
	function GetTransaction() {
		// function นี้ไม่ต้องเรียก API แล้ว เพราะข้อมูลอยู่ใน listTransaction แล้ว
		updateChart02();
	}

	function GetOrder() {
		updateChart03();
	}

	function GetUser() {
	}

</script>

{#if !loading}
	<div class="p-3">
		<h4 class="h4 fw-bold mb-3"><span>แดชบอร์ด</span></h4>
		<div class="row">
			<!-- รายได้เดือนนี้ -->
			<div class="col-12 col-sm-6 col-xl-3 mb-3">
				<div class="card p-3 shadow">
					<div class="d-flex mb-3">
						<span class="border p-3 rounded-lg" style="background-color: #477DFF;">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="35px"
								height="35px"
								viewBox="0 0 24 24"
							>
								<path
									fill="white"
									d="M19 7h-1V6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3M5 5h10a1 1 0 0 1 1 1v1H5a1 1 0 0 1 0-2m15 10h-1a1 1 0 0 1 0-2h1Zm0-4h-1a3 3 0 0 0 0 6h1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8.83A3 3 0 0 0 5 9h14a1 1 0 0 1 1 1Z"
								/>
							</svg>
						</span>
						<div class="ps-3">
							<small>รายได้เดือนนี้</small>
							<h4 class="h4 fw-bold">
								{card01?.thisMonth?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ฿
							</h4>
						</div>
					</div>
					<div class="d-flex align-items-center justify-content-between mb-1">
						<small>รายได้เดือนที่แล้ว</small>
						<b>{card01?.previousMonths?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ฿</b>
					</div>
					<div class="d-flex align-items-center justify-content-between mb-1">
						<small
							>{card01?.thisMonth && card01?.previousMonths && card01.thisMonth > card01.previousMonths
								? 'มากกว่าเดือนที่แล้ว'
								: 'น้อยกว่าเดือนที่แล้ว'}</small
						>
						<small
							class="badge {card01?.thisMonth && card01?.previousMonths && card01.thisMonth > card01.previousMonths
								? 'badge-success bg-success-subtle border-success text-success'
								: 'badge-danger bg-danger-subtle border-danger text-danger'}"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
								{#if card01?.thisMonth && card01?.previousMonths && card01.thisMonth > card01.previousMonths}
									<path stroke="#106511" stroke-width="2" d="m12 5l6 6m-6-6l-6 6m6-6v14" />
								{:else}
									<path
										fill="#d32f2f"
										d="M11 4.5v11.586l-4.5-4.5L5.086 13L12 19.914L18.914 13L17.5 11.586l-4.5 4.5V4.5z"
									/>
								{/if}
							</svg>
							{card01?.thisMonth && card01?.previousMonths 
								? (((card01.thisMonth - card01.previousMonths) / card01.previousMonths) * 100).toFixed(2) 
								: '0.00'}%
						</small>
					</div>
				</div>
			</div>
			<!-- รายการตรวจสอบ -->
			<div class="col-12 col-sm-6 col-xl-3 mb-3">
				<div class="card p-3 shadow">
					<div class="d-flex mb-3">
						<span class="border p-3 rounded-lg" style="background-color: #1353EC;">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="35px"
								height="35px"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<g fill="none" stroke="white" stroke-width="2">
									<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
									<path d="M14 2v4a2 2 0 0 0 2 2h4M9 15l2 2l4-4" />
								</g>
							</svg>
						</span>
						<div class="ps-3">
							<small>รายการตรวจสอบ</small>
							<h4 class="h4 fw-bold">
								{listTransaction.length?.toLocaleString()}
							</h4>
						</div>
					</div>
					<div class="d-flex align-items-center justify-content-between mb-1">
						<small>ถูกต้อง</small>
						<b class="text-success"
							>{listTransaction
								.filter((e) => e.status === 'TRANSACTION_SUCCESSFUL')
								.length?.toLocaleString()}</b
						>
					</div>
					<div class="d-flex align-items-center justify-content-between">
						<small>ถูกปฏิเสธ</small>
						<b class="text-danger"
							>{listTransaction
								.filter((e) => e.status !== 'TRANSACTION_SUCCESSFUL')
								.length?.toLocaleString()}</b
						>
					</div>
				</div>
			</div>
			<!-- แพ็กเกจ -->
			<div class="col-12 col-sm-6 col-xl-3 mb-3">
				<div class="card p-3 shadow">
					<div class="d-flex mb-3">
						<span class="border p-3 rounded-lg" style="background-color: #182BBA;">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="34px"
								height="34px"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<path
									fill="white"
									d="M10.591 2.513a3.75 3.75 0 0 1 2.818 0l7.498 3.04A1.75 1.75 0 0 1 22 7.175v9.653a1.75 1.75 0 0 1-1.093 1.621l-7.498 3.04a3.75 3.75 0 0 1-2.818 0l-7.498-3.04A1.75 1.75 0 0 1 2 16.827V7.176a1.75 1.75 0 0 1 1.093-1.622zm2.254 1.39a2.25 2.25 0 0 0-1.69 0L9.24 4.68l7.527 2.927l2.669-1.03zm1.846 4.505L7.215 5.5L4.59 6.564l7.411 2.882zM3.5 16.828a.25.25 0 0 0 .156.231l7.499 3.04q.047.02.095.036v-9.371L3.5 7.75zm9.345 3.271l7.499-3.04a.25.25 0 0 0 .156-.232V7.774l-7.75 2.992v9.37z"
								/>
							</svg>
						</span>
						<div class="ps-3">
							<small>แพ็กเกจ</small>
							<h4 class="h4 fw-bold">
								{listPackages.length}
							</h4>
						</div>
					</div>
					<div class="d-flex align-items-center justify-content-between mb-1">
						<small>กำลังใช้งาน</small>
						<b class="text-success">{listPackages.filter((e) => e.is_active).length}</b>
					</div>
					<div class="d-flex align-items-center justify-content-between">
						<small>ไม่ใช้งาน</small>
						<b class="text-danger">{listPackages.filter((e) => !e.is_active).length}</b>
					</div>
				</div>
			</div>
			<!-- ลูกค้า -->
			<div class="col-12 col-sm-6 col-xl-3 mb-3">
				<div class="card p-3 shadow">
					<div class="d-flex mb-3">
						<span class="border p-3 rounded-lg" style="background-color: #113BD4;">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="35px"
								height="35px"
								viewBox="0 0 32 32"
								{...$$props}
							>
								<path
									fill="white"
									d="M30 30h-2v-5a5.006 5.006 0 0 0-5-5v-2a7.01 7.01 0 0 1 7 7zm-8 0h-2v-5a5.006 5.006 0 0 0-5-5H9a5.006 5.006 0 0 0-5 5v5H2v-5a7.01 7.01 0 0 1 7-7h6a7.01 7.01 0 0 1 7 7zM20 2v2a5 5 0 0 1 0 10v2a7 7 0 0 0 0-14m-8 2a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7"
								/>
							</svg>
						</span>
						<div class="ps-3">
							<small>ลูกค้า</small>
							<h4 class="h4 fw-bold">
								{listUser.length}
							</h4>
						</div>
					</div>
					<div class="d-flex align-items-center justify-content-between mb-1">
						<small>กำลังใช้งาน</small>
						<b class="text-success">{listUser.filter((e) => e.is_active).length}</b>
					</div>
					<div class="d-flex align-items-center justify-content-between">
						<small>ไม่ใช้งาน</small>
						<b class="text-danger">{listUser.filter((e) => !e.is_active).length}</b>
					</div>
				</div>
			</div>
			<!-- ยอดการใช้งานรายวัน -->
			<div class="col-12 col-md-6 mb-3">
				<div class="card p-3 shadow">
					<h6 class="h6 fw-bold">ยอดการใช้งานรายวัน</h6>
					<div class="d-flex">
						<input
							type="month"
							bind:value={monthDateCard02}
							class="form-control w-100"
							autocomplete="off"
						/>
						<button class="btn bg-primary text-white ms-2" on:click={() => GetTransaction()}
							>ค้นหา
						</button>
					</div>
					{#if chartDataCard02}
						<Chart
							type="line"
							data={chartDataCard02}
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
					{/if}
				</div>
			</div>
			<!-- สถิติรายได้แบบรายเดือน (บาท) -->
			<div class="col-12 col-md-6 mb-3">
				<div class="card p-3 shadow">
					<h6 class="h6 fw-bold">สถิติรายได้แบบรายเดือน (บาท)</h6>
					<div class="d-flex">
						<select bind:value={yearDateCard03} class="form-control w-100" autocomplete="off">
							{#each Array.from({ length: 11 }, (_, index) => new Date().getFullYear() - 5 + index) as item}
								<option value={item}>{item}</option>
							{/each}</select
						>

						<button class="btn bg-primary text-white ms-2" on:click={() => GetOrder()}
							>ค้นหา
						</button>
					</div>
					{#if chartDataCard03}
						<Chart
							type="bar"
							data={chartDataCard03}
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
					{/if}
				</div>
			</div>
			<!-- สถิติโดยรวมแบบรายเดีอน -->
			<div class="col-12 mb-3">
				<div class="card p-3 shadow">
					<h6 class="h6 fw-bold">สถิติโดยรวมแบบรายเดีอน</h6>
					<div class="d-flex">
						<select bind:value={yearDateCard04} class="form-control w-100" autocomplete="off">
							{#each Array.from({ length: 11 }, (_, index) => new Date().getFullYear() - 5 + index) as item}
								<option value={item}>{item}</option>
							{/each}</select
						>

						<button class="btn bg-primary text-white ms-2" on:click={() => GetChart04()}
							>ค้นหา
						</button>
					</div>
					{#if chartDataCard04}
						<Chart
							type="bar"
							data={chartDataCard04}
							options={{
								responsive: true,
								plugins: {
									legend: {
										position: 'top'
									}
								},
								scales: {
									x: {
										stacked: true,
										title: {
											display: true,
											text: 'เดือน'
										}
									},
									y: {
										stacked: true,
										title: {
											display: true,
											text: 'จำนวน'
										}
									}
								}
							}}
						/>
					{/if}
				</div>
			</div>
			<!-- รายการตรวจสอบล่าสุด -->
			<div class="col-12 mb-3">
				<div class="card p-3 shadow">
					<h4 class="h4 fw-bold">รายการตรวจสอบล่าสุด</h4>
					<div class="d-flex flex-wrap">
						<input
							type="date"
							class="form-control w-48 me-2 mb-2"
							maxlength="100"
							bind:value={startDateCard05}
						/>
						<input
							type="date"
							class="form-control w-48 me-2 mb-2"
							maxlength="100"
							bind:value={endDateCard05}
						/>
						<input
							type="text"
							placeholder="ชื่อลูกค้า"
							class="form-control w-48 me-2 mb-2"
							bind:value={name_thCard05}
						/>
						<select class="form-control w-48 me-2 mb-2" bind:value={statusCard05}>
							<option value="">ทั้งหมด</option>
							<option value="TRANSACTION_SUCCESSFUL">TRANSACTION SUCCESSFUL</option>
							<option value="TRANSACTION_UNSUCCESSFUL">TRANSACTION UNSUCCESSFUL</option>
							<option value="RECEIVER_NOT_MATCH">RECEIVER NOT MATCH</option>
							<option value="AMOUNT_LESS_THAN_MINIMUM">AMOUNT LESS THAN MINIMUM</option>
							<option value="ERROR">ERROR</option>
						</select>
						<button class="btn btn-primary bg-primary me-2 mb-2" on:click={GetTransaction}
							>ค้นหา</button
						>
						<button
							class="btn btn-outline mb-2"
							on:click={() => {
								startDateCard05 = '';
								endDateCard05 = '';
								name_thCard05 = '';
								statusCard05 = '';
								GetTransaction();
							}}>ล้าง</button
						>
					</div>
					<div class="table-responsive" style="max-height:400px">
						<table class="table table-hover">
							<thead>
								<tr class="bg-secondary-subtle">
									<th class="text-center">ลำดับ</th>
									<th>วันเวลาที่ตรวจสอบ</th>
									<th>เลขที่รายการ</th>
									<th>รหัสลูกค้า</th>
									<th>ชื่อ-นามสกุล</th>
									<th>ธนาคาร</th>
									<th>สถานะ</th>
									<th>BankStatusCode</th>
									<th>ErrorMsg</th>
									<th>Tranfer Bank ID</th>
								</tr>
							</thead>
							<tbody>
								{#if listTransaction.length === 0}
									<tr><td colspan="10">ไม่พบข้อมูล</td></tr>
								{:else}
									{#each listTransaction
										.filter((e) => !name_thCard05 || e.name_th.includes(name_thCard05))
										.filter((e) => !statusCard05 || e.status === statusCard05)
										.filter((e) => (!startDateCard05 || new Date(e.created_date) >= new Date(`${startDateCard05}T00:00:00.000Z`)) && (!endDateCard05 || new Date(e.created_date) <= new Date(`${endDateCard05}T23:59:59.000Z`))) as item, index}
										<tr class="text-start text-nowrap">
											<td class="text-center">{index + 1}</td>
											<td title={item.created_date}
												>{item.created_date
													? new Date(item.created_date).toLocaleDateString('th-TH', {
															day: '2-digit',
															month: '2-digit',
															year: 'numeric'
														})
													: '-'}
											</td>
											<td>{item.id.toString().padStart(5, '0')}</td>
											<td
												>{item.user_id === 0
													? ''
													: '#' + item.user_id.toString().padStart(5, '0')}</td
											>
											<td
												class="p-1 sm:p-2 lg:text-sm text-left truncate"
												title={listUser?.find((e) => e.id === item.user_id)?.name_th || '-'}
												>{listUser?.find((e) => e.id === item.user_id)?.name_th || '-'}</td
											>
											<td>{listBank[item.qr_code.slice(18, 21)] || item.qr_code.slice(18, 21)}</td>
											<td title={item.status}>
												<span>
													{#if item.status === 'TRANSACTION_SUCCESSFUL'}
														<small class="px-2 rounded-pill bg-success-subtle text-success"
															>{item.status.replaceAll('-', '')}</small
														>
													{:else}
														<small class="px-2 rounded-pill bg-danger-subtle text-danger"
															>{item.status.replaceAll('-', '')}</small
														>
													{/if}
												</span>
											</td>
											<td>{item.status_code}</td>
											<td title={item.message}>{item.message}</td>
											<td title={item.ref_no}>{item.ref_no}</td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<!-- ลูกค้าที่เปลี่ยนแพ็กเก็จล่าสุด -->
			<div class="col-12 mb-3">
				<div class="card p-3 shadow">
					<h4 class="h4 fw-bold">ลูกค้าที่เปลี่ยนแพ็กเก็จล่าสุด</h4>
					<div class="d-flex mb-3">
						<input
							type="text"
							placeholder="รหัสลูกค้า, ชื่อ-นามสกุล"
							class="form-control w-72 me-2"
							bind:value={searchCard06}
						/>
						<button class="btn btn-primary bg-primary me-2" on:click={GetUser}>ค้นหา</button>
						<button
							class="btn btn-outline"
							on:click={() => {
								searchCard06 = '';
								GetUser();
							}}>ล้าง</button
						>
					</div>
					<div class="table-responsive" style="max-height:400px">
						<table class="table table-hover">
							<thead>
								<tr class="bg-secondary-subtle">
									<th class="text-center">ลำดับ</th>
									<th>รหัสลูกค้า</th>
									<th>อีเมล</th>
									<th>ชื่อ-นามสกุล</th>
									<th>ประเภทลูกค้า</th>
									<th>แพ็กเก็จที่สมัคร</th>
									<th class="text-center">จำนวนเหลือใช้</th>
									<th class="text-center">จำนวนที่ใช้ไป</th>
									<th class="text-center">วันหมดอายุแพ็กเก็จ</th>
								</tr>
							</thead>
							<tbody class="text-center">
								{#if listUser.length === 0}
									<tr><td colspan="11">ไม่พบข้อมูล</td></tr>
								{:else}
									{#each listUser.filter((e) => !searchCard06 || `#${e.id.toString().padStart(5, '0')} ${e.name_th}`.includes(searchCard06)) as item, index}
										<tr class="text-start">
											<th class="text-center">{index + 1}</th>
											<td>#{item.id.toString().padStart(5, '0')}</td>
											<td title={item.email}>{item.email}</td>
											<td title={item.name_th}>{item.name_th}</td>
											<td>{item.user_type}</td>
											<td
												title={listPackages?.find((e) => e.id == item.package_id)?.package_name ||
													''}
												>{listPackages?.find((e) => e.id == item.package_id)?.package_name ||
													''}</td
											>
											<td class="text-end">{item.quota_left.toLocaleString()}</td>
											<td class="text-end">{(item.quota_all - item.quota_left).toLocaleString()}</td
											>
											<td class="text-center"
												>{item.package_id
													? new Date(item.package_change_date).toLocaleDateString('th-TH', {
															day: '2-digit',
															month: '2-digit',
															year: 'numeric'
														}) || '-'
													: '-'}</td
											>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
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
