<script lang="ts"> 
	import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import * as XLSX from 'xlsx';

	let loading = true;

	let listOverView = [];

	let startDate = new Date(new Date().setDate(1)).toISOString().slice(0, 10);
	let endDate = new Date().toISOString().slice(0, 10);

	// ข้อมูลสำหรับกราฟ
	let chartData = {};

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		startDate = urlParams.get('startDate') || new Date(new Date().setDate(1)).toISOString().slice(0, 10);
		endDate = urlParams.get('endDate') || new Date().toISOString().slice(0, 10);
		const id = urlParams.get('id') || "";
		await GetTransaction(id);
		await dowloadExportExcel();
		loading = false;
	});
	async function GetTransaction(id: string) {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/transaction/get/${id}`, config);
		const data = await result.json();
		if (startDate && endDate) {
			listOverView =
				(data?.data || []).filter((transaction) => {
					if (!transaction.created_date) return false;
					const transDate = new Date(transaction.created_date.split('T')[0]);
					return transDate >= new Date(startDate) && transDate <= new Date(endDate);
				}) || [];
		} else {
			listOverView = data?.data || [];
		}
	}
	function dowloadExportExcel() {
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
</script>
