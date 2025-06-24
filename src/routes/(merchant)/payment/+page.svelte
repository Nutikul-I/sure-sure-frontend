<script lang="ts">
	import cookie from 'cookie';
	import Swal from 'sweetalert2';
	// @ts-ignore
	import { PUBLIC_oauth_KEY } from '$env/static/public';
	import {
		PUBLIC_API_ENDPOINT,
		PUBLIC_BACKEND_API_KEY,
		PUBLIC_PAYMENT_URL,
		PUBLIC_PAYMENT_MERCHANT,
		PUBLIC_ORDER_APIKEY,
		PUBLIC_ORDER_SECRETKEY,
		PUBLIC_ORDER_MID,
		PUBLIC_ORDER_URL
	} from '$env/static/public';
	import { onMount,onDestroy } from 'svelte';
	import dowlaod from '$lib/image/downloads.png';
	import payment from '$lib/image/Payment.png';
	let profile: {
		package_change_date: string;
		email: string;
		id: string;
	} | null = null;
	let refNo = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
	let packageData: any = null;
	let paymentData: any = null;
	let countDown: any = '';
	let timeInterval: any = null;
	let successCountDown: any = 6;
	let successTimeInterval: any = null;
	let step: any = false;

	let selectPackage: {
		QuotaLimit: number;
		AmountLimit: number;
		OrderAmount: number;
		Price: number;
		Name: string;
		Id: string;
		id: string;
		package_name: string;
		package_price: string;
		quota_limit: string;
	} | null = null;

	onMount(async () => {
		localStorage.removeItem('redirect_page');
		profile = localStorage.getItem('profile')
			? JSON.parse(localStorage.getItem('profile') || '')
			: null;
		try {
			const packageDataString = localStorage.getItem('packageData');
			packageData = packageDataString ? JSON.parse(packageDataString) : null;
		} catch (e) {}
		const selectPackageString = localStorage.getItem('selectPackage');
		selectPackage = selectPackageString ? JSON.parse(selectPackageString) : selectPackage;
		const packagePrice = Number(selectPackage?.package_price) || 0;
		const packageName = selectPackage?.package_name || '';
		const packageId = Number(selectPackage?.id) || '';
		const email = profile?.email || 'nutikul.test@gmail.com';
		const merchantId = profile?.id;
		const status = packagePrice === 0 ? 'SUCCESS' : 'PENDING';
		if (packageData?.data) {
			refNo = packageData?.referenceNo || refNo;
			timeInterval = setInterval(Countdown, 1000);
		} else {
			// Configurations
			const headers = {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			};

			// Fetch Data
			try {
				[packageData, paymentData] = await Promise.all([
					packagePrice > 0 &&
						fetch(
							`${PUBLIC_PAYMENT_URL}?merchantID=${PUBLIC_PAYMENT_MERCHANT}&productDetail=${packageName}&customerEmail=${email}&customerName=customer&total=${packagePrice}&referenceNo=${refNo}`,
							{
								method: 'POST',
								headers: { ...headers, Authorization: `Bearer ${PUBLIC_oauth_KEY}` }
							}
						).then((res) => res.json()),
					fetch(`${PUBLIC_API_ENDPOINT}/order-package/create`, {
						method: 'POST',
						headers: { ...headers, apikey: PUBLIC_BACKEND_API_KEY },
						body: JSON.stringify({
							ref_no: refNo,
							user_id: merchantId,
							package_id: packageId,
							price: packagePrice,
							status
						})
					}).then((res) => res.json())
				]);
				if (!paymentData || paymentData.message !== 'Success') {
					throw new Error(
						paymentData?.message?.includes('duplicate')
							? 'รายการนี้ถูกสร้างไปแล้ว'
							: 'ไม่สามารถซื้อแพ็กเกจได้ กรุณาลองใหม่อีกครั้ง'
					);
				}
			} catch (error) {
				Swal.fire({
					width: '26em',
					imageUrl: 'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'กรุณาตรวจสอบข้อมูล',
					text: error?.message,
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
					window.location.href = '/package';
				});
				return;
			}
			// Finalize
			localStorage.setItem('packageData', JSON.stringify(packageData));
			localStorage.setItem('selectPackage', JSON.stringify(selectPackage));
			localStorage.setItem('refNo', refNo);
			timeInterval = setInterval(Countdown, 1000);
		}
	});
	onDestroy(() => {
    clearInterval(timeInterval);
    console.log('Interval cleared!');
  });

	// GET
	const GetStatusPayment = async () => {
		let config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true', 
				'apikey': PUBLIC_BACKEND_API_KEY
			},
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/order-package/get/refno/${refNo}`, config);
		const data = await result.json();
		if (data.data.status === 'SUCCESS') {
			clearInterval(timeInterval);
			localStorage.removeItem('refNo');
			localStorage.removeItem('packageData');
			localStorage.removeItem('selectPackage');
			UpdateOrderPackage('SUCCESS');
			step = true;
			successTimeInterval = setInterval(() => {
				successCountDown -= 1;
				if (successCountDown <= 0) {
					clearInterval(successTimeInterval);
					window.location.assign('/profile');
				}
			}, 1000);
		}
	};

	// UPDATE
	async function UpdateOrderPackage(status: string) {
		fetch(`${PUBLIC_API_ENDPOINT}/order-package/update`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			},
			body: JSON.stringify({
				ref_no: refNo,
				status: status
			})
		}).then((res) => res.json());
	}

	// DOWNLOAD
	async function DownloadImage(imageUrl: string, filename: string) {
		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();

			const isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
			const canUseShare =
				navigator.canShare &&
				navigator.canShare({ files: [new File([blob], filename, { type: blob.type })] });

			if (isMobile && canUseShare) {
				await navigator.share({
					files: [new File([blob], filename, { type: blob.type })],
					title: 'ดาวน์โหลดรูปภาพ',
					text: 'บันทึกภาพลงในเครื่องของคุณ'
				});
			} else {
				const blobUrl = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = blobUrl;
				link.download = filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setTimeout(() => {
					window.URL.revokeObjectURL(blobUrl);
				}, 100);
			}
		} catch (error) {
			alert('ไม่สามารถดาวน์โหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
		}
	}

	// FUNCTION
	async function Countdown() {
		const now = new Date();
		const endDate = new Date(packageData?.data?.expiredate);
		const timeRemaining = endDate.getTime() - now.getTime();
		if (Math.floor(timeRemaining / 1000) % 10 === 0) {
			GetStatusPayment();
		}
		if (!timeRemaining || timeRemaining <= 0) {
			localStorage.removeItem('packageData');
			localStorage.removeItem('selectPackage');
			localStorage.removeItem('refNo');
			clearInterval(timeInterval);

			await UpdateOrderPackage('CANCEL');

			return Swal.fire({
				width: '26em',
				imageUrl: 'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'หมดเวลา',
				text: 'กรุณาทำรายการใหม่อีกครั้ง',
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
				window.location.href = '/package';
			});
		}

		const minutes = String(Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))).padStart(
			2,
			'0'
		);
		const seconds = String(Math.floor((timeRemaining % (1000 * 60)) / 1000)).padStart(2, '0');

		countDown = `${minutes}:${seconds}`;
	}

	function formatDate(isoDate: string) {
		const date = new Date(isoDate);

		// Format to DD/MM/YYYY
		const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

		return formattedDate;
	}
</script>

{#if !step}
	<div class="row mx-0 mt-5">
		<div class="col-12 col-md-8 col-lg-6 mx-auto">
			<div class="card px-2 py-4 shadow mb-3">
				<h5 class="font-semibold h5 text-center mb-3">สแกนเพื่อชำระเงิน</h5>
				{#if packageData?.data}
					<div class="flex justify-center">
						<div class="border-2 border-[#113566] rounded-md overflow-hidden w-5/5">
							<div class=" bg-[#113566] flex justify-center">
								<img src={payment} width="120px" height="100px" />
							</div>
							<div class="">
								<!-- svelte-ignore a11y-missing-attribute -->
								<img
									src={packageData?.data?.image}
									class="w-[220px] h-[220px] lg:w-[250px] lg:h-[230px]"
								/>
							</div>
						</div>
					</div>
				{/if}
				<div class="d-flex justify-content-center mt-3 mb-2">
					<span class="text-secondary">แพ็กเกจ :</span>
					<span class="font-semibold">{selectPackage?.package_name || '-'}</span>
				</div>
				<div class="d-flex justify-content-center mb-2">
					<span class="text-secondary">จำนวนเงิน :</span>
					<h4 class="font-semibold text-primary h4">
						฿ {selectPackage?.package_price.toLocaleString() || '-'}
					</h4>
				</div>
				<div class="card border-0 text-center p-3 mb-3 text-danger bg-[#FEF6F6]">
					<h5 class="h4 font-semibold">หมดอายุใน {countDown} นาที</h5>
					<small
						>*จ่ายสำเร็จแล้ว โปรดรอจนหน้าจอกลับไปยังหน้าหลัก คิวอาร์โค้ดที่จ่ายสำเร็จแล้ว
						ไม่สามารถจ่ายซ้ำได้</small
					>
				</div>
				<button
					class="w-100 btn bg-primary text-white"
					on:click={() => DownloadImage(packageData?.data?.image, 'QRcode.png')}
				>
					<img alt="" src={dowlaod} width="18px" height="18px" class="mr-3" />ดาวน์โหลดคิวอาร์โค้ด
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="row min-vh-100 px-3 py-5 mx-0">
		<div class="col-12 col-md-8 col-lg-6 mx-auto">
			<div class="card px-2 py-4 shadow mb-3">
				<img
					alt="checked"
					src="https://cdn.paysolutions.io/assets/images/icon-check.gif"
					width="96"
					height="96"
					class="mx-auto mb-4"
				/>
				<h5 class="font-semibold h5 text-center mb-3">ชำระเงินสำเร็จ</h5>

				<div class="d-flex justify-content-center">
					<span class="text-secondary me-2">แพ็กเกจ :</span>
					<span class="font-semibold">{selectPackage?.package_name}</span>
				</div>
				<div class="d-flex justify-content-center">
					<span class="text-secondary me-2">ค่าบริการ :</span>
					<span class="font-semibold">฿ {(selectPackage?.package_price ?? 0).toLocaleString()}</span
					>
				</div>
				<div class="d-flex justify-content-center">
					<span class="text-secondary me-2">จำนวนตรวจสอบ :</span>
					<span class="font-semibold">{selectPackage?.quota_limit} สลิป</span>
				</div>
				<div class="d-flex justify-content-center">
					<span class="text-secondary me-2"
						>วันที่หมดอายุ :{formatDate(profile?.package_change_date || '')}</span
					>
					<span class="font-semibold"></span>
				</div>

				<button
					class="btn bg-primary text-white w-100 mt-3"
					on:click={() => {
						clearInterval(successTimeInterval);
						window.location.href = '/dashboard';
					}}>กลับหน้าบัญชี ({successCountDown} วิ)</button
				>
			</div>
		</div>
	</div>
{/if}
