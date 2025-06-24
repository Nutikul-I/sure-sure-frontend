<script lang="ts">
	import Switch from '$lib/components/ui/switch/Switch2.svelte';
	import {
		PUBLIC_API_ENDPOINT,
		PUBLIC_SECRETKEY,
		PUBLIC_BACKEND_API_KEY,
		PUBLIC_PAYSO_DEFAULT_SECRET,
		PUBLIC_oauth_KEY
	} from '$env/static/public';
	import Swal from 'sweetalert2';

	import { onMount } from 'svelte';

	let loading = true;
	let profile: { store_name: string; id: any; username: any; } | null = null;

	let listBank: any[] = [
		{
			value: '002',
			label: 'ธนาคารกรุงเทพ',
			imageUrl: 'https://moneyexpo.net/wp-content/uploads/2023/05/BBL.jpg'
		},
		{
			value: '004',
			label: 'ธนาคารกสิกรไทย',
			imageUrl: 'https://i.pinimg.com/736x/cb/7c/ca/cb7cca77e49eece5ce042aa9f25ad27c.jpg'
		},
		{
			value: '006',
			label: 'ธนาคารกรุงไทย',
			imageUrl: 'https://moneyexpo.net/wp-content/uploads/2023/05/KTB.jpg'
		},
		{
			value: '009',
			label: 'ธนาคารโอเวอร์ซี',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_ocbc@2x.png'
		},
		{
			value: '011',
			label: 'ธนาคารทหารไทยธนชาต',
			imageUrl: 'https://media.ttbbank.com/1/global/ttb.jpg'
		},
		{
			value: '014',
			label: 'ธนาคารไทยพาณิชย์',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_sb@2x.png'
		},
		{
			value: '017',
			label: 'ธนาคารซิตี้แบงก์',
			imageUrl: 'https://moneyandbanking.co.th/wp-content/uploads/2024/04/Citi-Bank-905x613.webp'
		},
		{
			value: '018',
			label: 'ธนาคารซูมิโตโม มิตซุย',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_smbc@2x.png'
		},
		{
			value: '020',
			label: 'ธนาคารสแตนดาร์ดชาร์เตอร์ด',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_scthai@2x.png'
		},
		{
			value: '022',
			label: 'ธนาคารซีไอเอ็มบี ไทย',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_cimbthai@2x.png'
		},
		{
			value: '024',
			label: 'ธนาคารยูโอบี',
			imageUrl: 'https://cms-tpq.theparq.com/wp-content/uploads/2020/07/UOB_LOGO_800x800.png'
		},
		{
			value: '025',
			label: 'ธนาคารกรุงศรี',
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhQjvxKz4c3kDRgXc3YS1gVDAv1rlVu6NIEA&s'
		},
		{
			value: '030',
			label: 'ธนาคารออมสิน',
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKB3R_1uIDD6IOdNF0ASnynXcUrrdxs3OUVw&s'
		},
		{
			value: '031',
			label: 'ธนาคารฮ่องกงและเซี่ยงไฮ้แบงกิ้ง',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_hsbc@2x.png'
		},
		{
			value: '032',
			label: 'ธนาคารดอยซ์แบงก์',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_deutsche@2x.png'
		},
		{
			value: '033',
			label: 'ธนาคารอาคารสงเคราะห์',
			imageUrl: 'https://ghbloyalty.ghbank.co.th/logo_ghb.png'
		},
		{
			value: '034',
			label: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
			imageUrl: 'https://s.isanook.com/mn/0/ud/175/877323/fack.jpg'
		},
		{
			value: '039',
			label: 'ธนาคารมิซูโฮ',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_mizuho@2x.png'
		},
		{
			value: '045',
			label: 'ธนาคารบีเอ็นพี พารีบาส์',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_bnpparibas@2x.png'
		},
		{
			value: '052',
			label: 'ธนาคารประเทศจีน',
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrfV_dWH9d6FO7JrEw11bWRbiIx0izN_I5g&s'
		},
		{
			value: '066',
			label: 'ธนาคารอิสลาม',
			imageUrl:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIzQBxnxe1oqnWPkll8vmLqnxJcaRanB23ow&s'
		},
		{
			value: '067',
			label: 'ธนาคารทิสโก้',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_tisco@2x.png'
		},
		{
			value: '069',
			label: 'ธนาคารเกียรตินาคิน',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_kkp@2x.png'
		},
		{
			value: '070',
			label: 'ธนาคารไอซีบีซี ไทย',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_icbc@2x.png'
		},
		{
			value: '071',
			label: 'ธนาคารไทยเครดิต',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_thaicredit@2x.png'
		},
		{
			value: '073',
			label: 'ธนาคารแลนด์ แอนด์ เฮ้าส์',
			imageUrl: 'https://www.dpa.or.th/storage/uploads/bank/dpa_bank_lhbank@2x.png'
		},
		{
			value: '098',
			label: 'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม',
			imageUrl: 'https://csrgroup.co.th/img/Client258-6.png'
		}
	];
	let listPromptpay: any[] = [
		{
			label: 'เบอร์โทร',
			value: 'MSISDN',
			imageUrl:
				'https://play-lh.googleusercontent.com/dVr2IZFMqilCP3pixPfH1djP_BPhwfjkQyNAjhhzhsFtKfXXh3BomzR3aGg2QMvhya4=w240-h480-rw'
		},
		{
			label: 'เลขประจำตัว',
			value: 'NATID',
			imageUrl:
				'https://play-lh.googleusercontent.com/dVr2IZFMqilCP3pixPfH1djP_BPhwfjkQyNAjhhzhsFtKfXXh3BomzR3aGg2QMvhya4=w240-h480-rw'
		},
		{ label: 'e-Wallet ID', value: 'EWALLETID', imageUrl: 'https://play-lh.googleusercontent.com/dVr2IZFMqilCP3pixPfH1djP_BPhwfjkQyNAjhhzhsFtKfXXh3BomzR3aGg2QMvhya4=w240-h480-rw' },
		// { label: 'บัญชีธนาคาร', value: 'BANKAC', imageUrl: '/src/lib/image/bg-people.png' }
	];
	let isExpand: boolean = true; //เปิดปิดเมนู
	let isOpen: boolean = false; //เปิดปิดเมนู

	let listMyBankAccount: any[] = [];
	let storeName: string = '';

	let listRoom: any[] = [];
	let stepRoom: string = 'list';
	let roomId: number = -1;
	let roomLineGroupId: string = '';
	let roomVerifyCode: string = '';
	let roomName: string = '';
	let roomNameError: string = '';
	let MinAmountReceive: number = 0;
	let HideSenderDetail: boolean = false;
	let HideReceiverDetail: boolean = false;

	onMount(async () => {
		profile = localStorage.getItem('profile')
			? JSON.parse(localStorage.getItem('profile') || '')
			: null;

		if (profile) {
			storeName = profile.store_name;
		}

		await Promise.all([GetRoom(), GetBank()]);
		loading = false;
	});
	async function GetBank() {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/bank2/get/${profile?.id || ""}`, config);
		const data = await result.json();
		for (let item of data?.data || []) {
			item.account_no = await DecryptAccountNo(item.account_no);
		}
		listMyBankAccount = data?.data || [];
	}
	async function GetRoom() {
		let config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/room2/get/${profile?.id || ""}`, config);
		const data = await result.json();
		listRoom = data.data || [];
		stepRoom = 'list';
	}

	async function CreateRoom() {
		const config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			},
			body: JSON.stringify({
				user_id: profile?.id || "",
				room_name: roomName,
				min_receive: MinAmountReceive,
				show_transferor: HideSenderDetail,
				show_recipient: HideReceiverDetail,
				qr_token: 'dmVyaWZ5LXRva2Vu:' + generateToken(),
				list_bank: JSON.stringify(
					listMyBankAccount.filter((item) => item.is_active).map((item) => item.id)
				)
			})
		};
		const url = `${PUBLIC_API_ENDPOINT}/room2/create`;
		const result = await fetch(url, config);
		const data = await result.json();
		if (data.data) {
			Swal.fire({
				width: '26em',
				imageUrl:
					'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'สำเร็จ',
				text: 'เพิ่มสาขาสำเร็จ',
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
	}

	async function UpdateRoom() {
		const config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			},
			body: JSON.stringify({
				id: roomId,
				room_name: roomName,
				min_receive: MinAmountReceive,
				show_transferor: HideSenderDetail,
				show_recipient: HideReceiverDetail,
				list_bank: JSON.stringify(
					listMyBankAccount.filter((item) => item.is_active).map((item) => item.id)
				)
			})
		};
		const url = `${PUBLIC_API_ENDPOINT}/room2/update`;
		const result = await fetch(url, config);
		const data = await result.json();
		if (data.message === 'Success') {
			Swal.fire({
				width: '26em',
				imageUrl:
					'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'สำเร็จ',
				text: 'แก้ไขสาขาสำเร็จ',
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
	}

	async function DeleteRoom() {
		try {
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/room2/delete/${roomId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'ngrok-skip-browser-warning': 'true',
					apikey: PUBLIC_BACKEND_API_KEY
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			} else {
				Swal.fire({
					width: '26em',
					imageUrl:
						'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'สำเร็จ',
					text: 'ลบสาขาสำเร็จ',
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
				GetRoom();
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

	async function DecryptAccountNo(encryptedBase64: string) {
		const combined = new Uint8Array(
			atob(encryptedBase64)
				.split('')
				.map((c) => c.charCodeAt(0))
		);
		const nonce = combined.slice(0, 16);
		const ciphertext = combined.slice(16);
		const key = new TextEncoder().encode(PUBLIC_PAYSO_DEFAULT_SECRET);
		const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: 'AES-CTR' }, false, [
			'decrypt'
		]);
		const decryptedBytes = await window.crypto.subtle.decrypt(
			{ name: 'AES-CTR', counter: nonce, length: 128 },
			cryptoKey,
			ciphertext
		);
		return new TextDecoder().decode(decryptedBytes);
	}

	async function openLineGroupCreation() {
		const userAgent = navigator.userAgent.toLowerCase();
		const isIOS = /ipad|iphone|ipod/.test(userAgent);
		const isAndroid = /android/.test(userAgent);

		
		try {
			// เปิดแอป LINE ตามแพลตฟอร์ม
			if (isIOS || isAndroid) {
				await fetch(`${PUBLIC_API_ENDPOINT}/room2/howto/${roomId}/${profile?.username}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${PUBLIC_oauth_KEY}`,
				apikey: PUBLIC_BACKEND_API_KEY
			}
		});				window.location.href = 'line://oaMessage/@suresure';
			} else {
				alert('แพลตฟอร์มของคุณไม่รองรับการเปิดแอป LINE');
			}
		} catch (error) {
			alert('ไม่สามารถเปิดแอพ LINE ได้ กรุณาตรวจสอบการติดตั้ง'); // แสดงข้อผิดพลาด
		}
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
	function generateToken(length = 32) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let token = '';
		for (let i = 0; i < length; i++) {
			token += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return token;
	}
</script>
{#if !loading}
{#if stepRoom === 'list'}
	<div class="position-relative w-100 min-vh-100">
		<div class="row mx-0">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative" style="height:100vh">
				<h5 class="fw-semibold h5 mb-2">สาขาร้านค้า</h5>
				<div class="text-secondary mb-2">เชื่อมต่อสาขากับ LINE Group เพื่อตรวจสลิป</div>
				<div class="card px-3 py-4 shadow">
					{#each listRoom as item}
						<div class="card p-3 mb-3 position-relative">
							<div
								class="d-flex justify-content-between mb-2 cursor-pointer"
								on:click={() => {
									stepRoom = '';
									roomId = item.id;
									roomLineGroupId = item.line_group_id;
									roomName = item.room_name;
									roomVerifyCode = item.qr_token;
									MinAmountReceive = item.min_receive;
									HideSenderDetail = item.show_transferor;
									HideReceiverDetail = item.show_recipient;
									listMyBankAccount = listMyBankAccount.map((e) => {
										return {
											...e,
											is_active: item.list_bank && JSON.parse(item.list_bank).includes(e.id)
										};
									});
								}}
							>
								<div class="d-flex">
									<div
										class="rounded-3 d-flex align-items-center justify-content-center p-2 h-12"
										style="background-color: #00E698;"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="30"
											height="30"
											viewBox="0 0 24 24"
											{...$$props}
										>
											<path
												fill="white"
												d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z"
											/>
										</svg>
									</div>
									<div class="px-3 me-auto">
										<h5 class="fw-semibold h5 mb-1">{item.room_name}</h5>
										{#if item.line_group_id}
											<div class="d-flex">
												<span
													class="border text-sm rounded-pill px-2 bg-[#f6fef7] text-success border-success d-flex align-items-center mb-2"
												>
													<svg
														class="me-1"
														width="12"
														height="12"
														viewBox="0 0 12 12"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M6.35378 9.18196L5.64667 9.88907C4.67036 10.8654 3.08745 10.8654 2.11114 9.88907C1.13483 8.91276 1.13483 7.32985 2.11114 6.35354L2.81825 5.64643M9.18221 6.35354L9.88931 5.64643C10.8656 4.67012 10.8656 3.08721 9.88931 2.1109C8.913 1.13458 7.33009 1.13458 6.35378 2.1109L5.64667 2.818M4.25023 7.74997L7.75023 4.24997"
															stroke="#198754"
															stroke-width="1.5"
															stroke-linecap="round"
															stroke-linejoin="round"
														/>
													</svg>
													เชื่อมต่อแล้ว
												</span>
											</div>
											<div>ตรวจสอบสลิปแล้ว {item.quota_used} สลิป</div>
										{:else}
											<div
												class="border text-sm rounded-pill px-2 bg-[#FEF6F6] text-danger border-danger d-flex align-items-center mb-2"
											>
												<div class="me-1">
													<svg
														width="12"
														height="12"
														viewBox="0 0 12 12"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M6.35378 9.18196L5.64667 9.88907C4.67036 10.8654 3.08745 10.8654 2.11114 9.88907C1.13483 8.91276 1.13483 7.32985 2.11114 6.35354L2.81825 5.64643M9.18221 6.35354L9.88931 5.64643C10.8656 4.67012 10.8656 3.08721 9.88931 2.1109C8.913 1.13458 7.33009 1.13458 6.35378 2.1109L5.64667 2.818M4.25023 7.74997L7.75023 4.24997"
															stroke="#F04438"
															stroke-width="1.5"
															stroke-linecap="round"
															stroke-linejoin="round"
														/>
													</svg>
												</div>
												ยังไม่ได้เชื่อมต่อ
											</div>
										{/if}
									</div>
								</div>
							</div>
							{#if !item.line_group_id}
								<div class="row">
									<div class="col-6 px-1">
										<button
											class="btn btn-outline-secondary w-100"
											on:click={() => {
												CopyCodeToClipboard(item.qr_token);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 448 512"
												width="16"
												height="16"
												><path
													d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"
												/></svg
											>
											คัดลอก Code</button
										>
									</div>
									<div class="col-6 px-1">
										<button
											class="btn bg-primary text-white w-100"
											on:click={() => {
												openLineGroupCreation();
											}}>สร้าง LINE Group</button
										>
									</div>
								</div>
							{/if}
							<div class="position-absolute end-4 top-4">
								<div class="pe-1 position-relative">
									<svg
										on:click={() => {
											roomId = item.id;
											isOpen = !isOpen;
										}}
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 128 512"
										width="16px"
										height="16px"
										><path
											fill="#98A2B3"
											d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"
										/></svg
									>
									{#if isOpen && roomId === item.id}
										<div
											class="position-absolute mt-1 bg-white border rounded-3 shadow-lgz-50"
											style="width: 148px; right: 0"
										>
											<div
												class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
												on:click={() => {
													stepRoom = 'update';
													roomId = item.id;
													roomLineGroupId = item.line_group_id;
													roomName = item.room_name;
													roomVerifyCode = item.qr_token;
													MinAmountReceive = item.min_receive;
													HideSenderDetail = item.show_transferor;
													HideReceiverDetail = item.show_recipient;
													listMyBankAccount = listMyBankAccount.map((e) => {
														return {
															...e,
															is_active: item.list_bank && JSON.parse(item.list_bank).includes(e.id)
														};
													});
												}}
											>
												<svg
													class="me-2"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 512 512"
													width="16px"
													height="16px"
													><path
														d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"
													/></svg
												>
												แก้ไข
											</div>
											<div
												class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
												on:click={() => {
													Swal.fire({
														width: '26em',
														imageUrl:
															'https://img2.pic.in.th/pic/download-3c14b44da064fee8b.png',
														imageWidth: 72,
														imageHeight: 72,
														imageAlt: 'Custom image',
														showCloseButton: true,
														title: 'ลบรายการนี้',
														text: 'คุณแน่ใจใช่ไหมว่าต้องการลบรายการนี้',
														confirmButtonText: 'ลบทันที',
														showCancelButton: true,
														cancelButtonText: 'ยกเลิก',
														customClass: {
															container: 'mb-0 pt-2 text-md',
															image: 'mb-2',
															title: 'text-xl pt-1',
															htmlContainer: 'text-md pt-2',
															actions: 'w-100 px-3 mt-2',
															confirmButton: 'btn btn-danger bg-danger text-white w-100 mb-2',
															cancelButton: 'btn btn-outline-secondary w-100'
														}
													}).then((result) => {
														if (result.isConfirmed) {
															roomId = item.id;
															DeleteRoom();
														}
													});
													isOpen = false;
												}}
											>
												<svg
													class="me-2"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 448 512"
													width="16px"
													height="16px"
													><path
														d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"
													/></svg
												>
												ลบ
											</div>
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="position-fixed w-100 p-3 bg-white" style="bottom:0">
			<button
				class="btn bg-primary text-white w-100"
				on:click={() => {
					stepRoom = 'create';
					roomId = -1;
					roomLineGroupId = '';
					roomName = '';
					roomVerifyCode = '';
					MinAmountReceive = 0;
					HideSenderDetail = false;
					HideReceiverDetail = false;
				}}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M9.99984 6.66667V13.3333M6.6665 10H13.3332M18.3332 10C18.3332 14.6024 14.6022 18.3333 9.99984 18.3333C5.39746 18.3333 1.6665 14.6024 1.6665 10C1.6665 5.39763 5.39746 1.66667 9.99984 1.66667C14.6022 1.66667 18.3332 5.39763 18.3332 10Z"
						stroke="#ffffff"
						stroke-width="1.66667"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>

				เพิ่มสาขา</button
			>
		</div>
	</div>
{/if}
{#if stepRoom === 'create'}
	<div class="position-relative w-100">
		<div class="row mx-0">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative" style="height:100vh">
				<div class="card px-3 py-4 shadow mb-5">
					<h5 class="fw-semibold h5 mb-2">สร้างสาขาร้านค้า</h5>
					<div class="d-flex mb-3">
						<div
							class="rounded-3 d-flex align-items-center justify-content-center p-2"
							style="background-color: #00E698;"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="30"
								height="30"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<path
									fill="white"
									d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z"
								/>
							</svg>
						</div>
						<div class="w-100 ps-2">
							<input class="form-control" placeholder="ชื่อร้านค้า" bind:value={roomName} />
							{#if roomNameError}
								<div class="text-danger text-sm mt-1">{roomNameError}</div>
							{/if}
						</div>
					</div>
					<span class="fw-semibold mb-3">บัญชีรับเงินที่เชื่อมต่อ</span>
					{#each listMyBankAccount as item}
						<div class="d-flex justify-content-between mb-3">
							<div class="d-flex">
								<img
									src={(item.account_type === 'BANK' ? listBank : listPromptpay).find(
										(e) =>
											e.value ==
											(item.account_type === 'BANK' ? item.bank_code : item.prompt_pay_type)
									)?.imageUrl || ''}
									alt={item.account_type}
									class="w-11 h-11 mr-2"
								/>
								<div>
									<div>{item.name_th}</div>
									<div>{item.account_no}</div>
								</div>
							</div>
							<Switch
								bind:checked={item.is_active}
								on:change={(e) => {
									item.is_active = e.target.checked;
								}}
							/>
						</div>
					{/each}
					<div class="d-flex cursor-pointer mb-2" on:click={() => (isExpand = !isExpand)}>
						<span class="fw-semibold">ตั้งค่าระบบการตรวจสอบ</span>
						<span class="ms-auto text-secondary text-sm mt-1"
							>{#if isExpand}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"
									><path
										d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
									/></svg
								>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"
									><path
										d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
									/></svg
								>
							{/if}</span
						>
					</div>
					{#if isExpand}
						<div class="mb-3">
							<div class="position-relative">
								<input
									type="number"
									class="form-control mb-3"
									placeholder="จำนวนเงินขั้นต่ำ"
									bind:value={MinAmountReceive}
								/>
								<div class="position-absolute end-0 top-2 h-10 d-flex">
									<div
										class="w-6 h-6 rounded-circle bg-secondary-subtle me-1 d-flex align-items-center justify-content-center text-xl text-secondary cursor-pointer"
										on:click={() => {
											MinAmountReceive = MinAmountReceive ? MinAmountReceive - 1 : 0;
										}}
									>
										-
									</div>
									<div
										class="w-6 h-6 rounded-circle bg-secondary-subtle me-1 d-flex align-items-center justify-content-center text-xl text-secondary cursor-pointer"
										on:click={() => {
											MinAmountReceive += 1;
										}}
									>
										+
									</div>
								</div>
							</div>
							<div class="d-flex justify-content-between mb-2">
								<span>ซ่อนเลขบัญชีผู้โอน</span>
								<Switch
									bind:checked={HideSenderDetail}
									on:change={(e) => {
										HideSenderDetail = e.target.checked;
									}}
								/>
							</div>
							<div class="d-flex justify-content-between mb-2">
								<span>ซ่อนเลขบัญชีผู้รับ</span>
								<Switch
									bind:checked={HideReceiverDetail}
									on:change={(e) => {
										HideReceiverDetail = e.target.checked;
									}}
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>
			<div class="position-fixed d-flex w-100 p-3 bg-white" style="bottom:0">
				<div class="w-100 pe-1">
					<button
						class="btn bg-outline-secondary text-dark w-100"
						on:click={() => {
							stepRoom = 'list';
						}}>ย้อนกลับ</button
					>
				</div>
				<div class="w-100 ps-1">
					<button
						class="btn {roomName ? 'bg-primary' : 'bg-secondary'} text-white w-100"
						on:click={() => {
							roomNameError = '';
							if (!roomName) {
								roomNameError = 'กรุณากรอกชื่อสาขา';
								Swal.fire({
									width: '26em',
									imageUrl:
										'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
									imageWidth: 72,
									imageHeight: 72,
									imageAlt: 'Custom image',
									showCloseButton: true,
									title: 'กรุณาตรวจสอบข้อมูล',
									text: 'กรุณากรอกชื่อสาขา',
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
							} else if (listMyBankAccount.filter((e) => e.is_active).length == 0) {
								Swal.fire({
									width: '26em',
									imageUrl:
										'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
									imageWidth: 72,
									imageHeight: 72,
									imageAlt: 'Custom image',
									showCloseButton: true,
									title: 'กรุณาตรวจสอบข้อมูล',
									text: 'กรุณาเลือกบัญชีรับเงินที่เชื่อมต่ออย่างน้อย 1 บัญชี',
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
							} else {
								CreateRoom();
							}
						}}>สร้างสาขา</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
{#if stepRoom === 'update'}
	<div class="position-relative w-100">
		<div class="row mx-0">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative" style="height:100vh">
				<div class="card px-3 py-4 shadow mb-5">
					<h5 class="fw-semibold h5 mb-2">ตั้งค่าสาขาร้านค้า</h5>
					<div class="d-flex mb-3">
						<div
							class="rounded-3 d-flex align-items-center justify-content-center p-2"
							style="background-color: #00E698;"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="30"
								height="30"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<path
									fill="white"
									d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z"
								/>
							</svg>
						</div>
						<div class="w-100 ps-2">
							<input class="form-control" placeholder="ชื่อร้านค้า" bind:value={roomName} />
							{#if roomNameError}
								<div class="text-danger text-sm mt-1">{roomNameError}</div>
							{/if}
						</div>
					</div>
					<span class="fw-semibold mb-3">บัญชีรับเงินที่เชื่อมต่อ</span>
					{#each listMyBankAccount as item}
						<div class="d-flex justify-content-between mb-3">
							<div class="d-flex">
								<img
									src={(item.account_type === 'BANK' ? listBank : listPromptpay).find(
										(e) =>
											e.value ==
											(item.account_type === 'BANK' ? item.bank_code : item.prompt_pay_type)
									)?.imageUrl || ''}
									alt={item.account_type === 'BANK'}
									class="w-11 h-11 mr-2"
								/>
								<div>
									<div>{item.name_th}</div>
									<div>{item.account_no}</div>
								</div>
							</div>
							<Switch
								bind:checked={item.is_active}
								on:change={(e) => {
									item.is_active = e.target.checked;
								}}
							/>
						</div>
					{/each}
					<div class="d-flex cursor-pointer mb-2" on:click={() => (isExpand = !isExpand)}>
						<span class="fw-semibold">ตั้งค่าระบบการตรวจสอบ</span>
						<span class="ms-auto text-secondary text-sm mt-1"
							>{#if isExpand}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"
									><path
										d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
									/></svg
								>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"
									><path
										d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
									/></svg
								>
							{/if}</span
						>
					</div>
					{#if isExpand}
						<div class="mb-3">
							<div class="position-relative">
								<input
									type="number"
									class="form-control mb-3"
									placeholder="จำนวนเงินขั้นต่ำ"
									bind:value={MinAmountReceive}
								/>
								<div class="position-absolute end-0 top-2 h-10 d-flex">
									<div
										class="w-6 h-6 rounded-circle bg-secondary-subtle me-1 d-flex align-items-center justify-content-center text-xl text-secondary cursor-pointer"
										on:click={() => {
											MinAmountReceive = MinAmountReceive ? MinAmountReceive - 1 : 0;
										}}
									>
										-
									</div>
									<div
										class="w-6 h-6 rounded-circle bg-secondary-subtle me-1 d-flex align-items-center justify-content-center text-xl text-secondary cursor-pointer"
										on:click={() => {
											MinAmountReceive += 1;
										}}
									>
										+
									</div>
								</div>
							</div>
							<div class="d-flex justify-content-between mb-2">
								<span>ซ่อนเลขบัญชีผู้โอน</span>
								<Switch
									bind:checked={HideSenderDetail}
									on:change={(e) => {
										HideSenderDetail = e.target.checked;
									}}
								/>
							</div>
							<div class="d-flex justify-content-between mb-2">
								<span>ซ่อนเลขบัญชีผู้รับ</span>
								<Switch
									bind:checked={HideReceiverDetail}
									on:change={(e) => {
										HideReceiverDetail = e.target.checked;
									}}
								/>
							</div>
						</div>
					{/if}
					<!-- CheckedHideSenderDetail
						CheckedHideReceiverDetail -->
				</div>
			</div>
		</div>
		<div class="position-fixed d-flex w-100 p-3 bg-white" style="bottom:0">
			<div class="w-100 pe-1">
				<button
					class="btn bg-outline-secondary text-dark w-100"
					on:click={() => {
						stepRoom = 'list';
					}}>ย้อนกลับ</button
				>
			</div>
			<div class="w-100 ps-1">
				<button
					class="btn {roomName ? 'bg-primary' : 'bg-secondary'} text-white w-100"
					on:click={() => {
						roomNameError = '';
						if (!roomName) {
							roomNameError = 'กรุณากรอกชื่อสาขา';
							Swal.fire({
								width: '26em',
								imageUrl:
									'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
								imageWidth: 72,
								imageHeight: 72,
								imageAlt: 'Custom image',
								showCloseButton: true,
								title: 'กรุณาตรวจสอบข้อมูล',
								text: 'กรุณากรอกชื่อสาขา',
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
						} else if (listMyBankAccount.filter((e) => e.is_active).length == 0) {
							Swal.fire({
								width: '26em',
								imageUrl:
									'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
								imageWidth: 72,
								imageHeight: 72,
								imageAlt: 'Custom image',
								showCloseButton: true,
								title: 'กรุณาตรวจสอบข้อมูล',
								text: 'กรุณาเลือกบัญชีรับเงินที่เชื่อมต่ออย่างน้อย 1 บัญชี',
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
						} else {
							UpdateRoom();
						}
					}}>บันทึก</button
				>
			</div>
		</div>
	</div>
{/if}
{#if stepRoom === ''}
	<div class="position-relative w-100">
		<div class="row mx-0">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative" style="height:100vh">
				<div class="card px-3 py-4 shadow">
					<div class="d-flex mb-3">
						<div
							class="rounded-3 d-flex align-items-center justify-content-center p-2"
							style="background-color: #00E698;"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="30"
								height="30"
								viewBox="0 0 24 24"
								{...$$props}
							>
								<path
									fill="white"
									d="m21.914 9.73l-.48-1.66l-1.11-3.17a2.8 2.8 0 0 0-1-1.36a2.74 2.74 0 0 0-1.62-.52H6.234a2.8 2.8 0 0 0-2.65 1.88l-1.13 3.21l-.46 1.62a.8.8 0 0 0 0 .21a3.85 3.85 0 0 0 2.06 3.39v4.83a2.8 2.8 0 0 0 .82 2a2.84 2.84 0 0 0 2 .82h10.28a2.8 2.8 0 0 0 2.81-2.81v-4.83a3.74 3.74 0 0 0 1.35-1.18a3.8 3.8 0 0 0 .7-2.21a1.5 1.5 0 0 0-.1-.22m-6.89 8.4h-6.17a1 1 0 1 1 0-2h6.17a1 1 0 0 1 0 2m5-6.85c-.282.399-.68.7-1.14.86a2.3 2.3 0 0 1-2.08-.31a2.34 2.34 0 0 1-.99-1.86a.75.75 0 1 0-1.5 0v.05a2.4 2.4 0 0 1-.14.74a2.4 2.4 0 0 1-.86 1.12a2.27 2.27 0 0 1-1.33.43a2.32 2.32 0 0 1-2.2-1.57a2 2 0 0 1-.14-.73a.75.75 0 0 0-1.5 0a2.36 2.36 0 0 1-.99 1.87a2.33 2.33 0 0 1-1.35.43a2.6 2.6 0 0 1-.77-.14a2.28 2.28 0 0 1-1.13-.85a2.33 2.33 0 0 1-.42-1.24l.41-1.48l1.11-3.16a1.31 1.31 0 0 1 1.24-.88h11.47c.27.004.535.088.76.24c.219.16.383.383.47.64l1.1 3.12l.43 1.52a2.35 2.35 0 0 1-.47 1.2z"
								/>
							</svg>
						</div>
						<div class="px-3 me-auto">
							<div class="text-secondary">ร้าน {storeName}</div>
							<h5 class="fw-semibold h5 mb-0">{roomName}</h5>
						</div>
						<svg
							class="cursor-pointer"
							width="16"
							height="16"
							viewBox="0 0 21 23"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							on:click={() => {
								stepRoom = 'update';
							}}
						>
							<path
								d="M7.78658 19.1783L8.39538 20.5475C8.57636 20.9551 8.87171 21.3014 9.24561 21.5444C9.61952 21.7875 10.0559 21.9168 10.5019 21.9167C10.9478 21.9168 11.3842 21.7875 11.7581 21.5444C12.132 21.3014 12.4274 20.9551 12.6083 20.5475L13.2171 19.1783C13.4339 18.6924 13.7984 18.2874 14.2588 18.0209C14.7221 17.7536 15.2581 17.6398 15.7901 17.6956L17.2796 17.8542C17.723 17.9011 18.1705 17.8184 18.5679 17.616C18.9652 17.4137 19.2952 17.1004 19.5181 16.7142C19.7412 16.3282 19.8475 15.8857 19.824 15.4405C19.8006 14.9953 19.6485 14.5665 19.3861 14.2061L18.5042 12.9943C18.1901 12.5596 18.0223 12.0363 18.025 11.5C18.0249 10.9652 18.1943 10.4442 18.5088 10.0116L19.3907 8.79981C19.6531 8.43937 19.8052 8.01053 19.8287 7.56533C19.8521 7.12012 19.7458 6.67769 19.5227 6.29171C19.2999 5.90549 18.9698 5.59222 18.5725 5.38986C18.1752 5.1875 17.7277 5.10476 17.2843 5.15166L15.7947 5.31023C15.2627 5.36609 14.7268 5.25225 14.2634 4.98499C13.8021 4.71697 13.4375 4.30979 13.2218 3.8218L12.6083 2.45259C12.4274 2.04501 12.132 1.6987 11.7581 1.45566C11.3842 1.21263 10.9478 1.0833 10.5019 1.08337C10.0559 1.0833 9.61952 1.21263 9.24561 1.45566C8.87171 1.6987 8.57636 2.04501 8.39538 2.45259L7.78658 3.8218C7.57088 4.30979 7.20624 4.71697 6.74492 4.98499C6.2816 5.25225 5.74561 5.36609 5.21367 5.31023L3.71945 5.15166C3.27605 5.10476 2.82856 5.1875 2.43124 5.38986C2.03392 5.59222 1.70385 5.90549 1.48103 6.29171C1.25792 6.67769 1.15164 7.12012 1.17506 7.56533C1.19848 8.01053 1.3506 8.43937 1.61297 8.79981L2.49492 10.0116C2.80944 10.4442 2.97881 10.9652 2.97871 11.5C2.97881 12.0348 2.80944 12.5559 2.49492 12.9885L1.61297 14.2003C1.3506 14.5607 1.19848 14.9896 1.17506 15.4348C1.15164 15.88 1.25792 16.3224 1.48103 16.7084C1.70407 17.0944 2.03418 17.4075 2.43144 17.6098C2.8287 17.8122 3.27608 17.895 3.71945 17.8484L5.20904 17.6899C5.74098 17.634 6.27697 17.7478 6.74029 18.0151C7.20334 18.2824 7.56967 18.6896 7.78658 19.1783Z"
								stroke="#98A2B3"
								stroke-width="1.66667"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M10.5 14.625C12.2259 14.625 13.625 13.2259 13.625 11.5C13.625 9.77415 12.2259 8.37504 10.5 8.37504C8.77411 8.37504 7.375 9.77415 7.375 11.5C7.375 13.2259 8.77411 14.625 10.5 14.625Z"
								stroke="#98A2B3"
								stroke-width="1.66667"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<div
						class="card border-0 text-center p-3 mb-3"
					>
						<div class="d-flex justify-content-between mb-2">
							<span class="text-secondary">สถานะ</span>
							{#if roomLineGroupId}
								<div class="d-flex">
									<span
										class="border text-sm rounded-pill px-2 bg-[#f6fef7] text-success border-success d-flex align-items-center mb-2"
									>
										<svg
											class="me-1"
											width="12"
											height="12"
											viewBox="0 0 12 12"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M6.35378 9.18196L5.64667 9.88907C4.67036 10.8654 3.08745 10.8654 2.11114 9.88907C1.13483 8.91276 1.13483 7.32985 2.11114 6.35354L2.81825 5.64643M9.18221 6.35354L9.88931 5.64643C10.8656 4.67012 10.8656 3.08721 9.88931 2.1109C8.913 1.13458 7.33009 1.13458 6.35378 2.1109L5.64667 2.818M4.25023 7.74997L7.75023 4.24997"
												stroke="#198754"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
										เชื่อมต่อแล้ว
									</span>
								</div>
							{:else}
								<div
									class="border text-sm rounded-pill px-2 bg-[#FEF6F6] text-danger border-danger d-flex align-items-center"
								>
									<div class="me-1">
										<svg
											width="12"
											height="12"
											viewBox="0 0 12 12"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M6.35378 9.18196L5.64667 9.88907C4.67036 10.8654 3.08745 10.8654 2.11114 9.88907C1.13483 8.91276 1.13483 7.32985 2.11114 6.35354L2.81825 5.64643M9.18221 6.35354L9.88931 5.64643C10.8656 4.67012 10.8656 3.08721 9.88931 2.1109C8.913 1.13458 7.33009 1.13458 6.35378 2.1109L5.64667 2.818M4.25023 7.74997L7.75023 4.24997"
												stroke="#F04438"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
									ยังไม่ได้เชื่อมต่อ
								</div>
							{/if}
						</div>
						<div class="d-flex justify-content-between mb-2">
							<span class="text-secondary">เลขที่อ้างอิงสาขา</span>
							<span class="text-dark fw-bold">#{('0000000' + roomId).slice(-6)}</span>
						</div>
						{#if !roomLineGroupId}
							<div class="card border-0 bg-[#FEF3F2] p-3">
								<div class="d-flex">
									<svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
										<g clip-path="url(#clip0_693_99)">
										<path d="M9.99996 6.66669V10M9.99996 13.3334H10.0083M18.3333 10C18.3333 14.6024 14.6023 18.3334 9.99996 18.3334C5.39759 18.3334 1.66663 14.6024 1.66663 10C1.66663 5.39765 5.39759 1.66669 9.99996 1.66669C14.6023 1.66669 18.3333 5.39765 18.3333 10Z" stroke="#D92D20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
										</g>
										<defs>
										<clipPath id="clip0_693_99">
										<rect width="20" height="20" fill="white"/>
										</clipPath>
										</defs>
										</svg>
										
									<span class="text-danger text-start"
										>กรุณาเชื่อมสาขากับ LINE Group โดยใช้ Code และเชิญ SureSure เพื่อตรวจสอบสลิป</span
									>
								</div>
							</div>
						{/if}
					</div>
					<div class="card border-0 text-center p-3 mb-3 text-danger bg-[#F5F8FF]">
						<span class="text-secondary text-start mb-2">Code สำหรับเชื่อมต่อ Line Group</span>
						<div class="position-relative mb-2">
							<input class="form-control" 
							style="padding-right:110px" bind:value={roomVerifyCode} readonly />
								<button
									class="btn {!roomLineGroupId ? "bg-primary":"bg-[#b1cdf6]"} text-white position-absolute end-0 top-0 rounded-start-0"
									on:click={() => {if(!roomLineGroupId){CopyCodeToClipboard(roomVerifyCode)}}}
								>
								{#if !roomLineGroupId}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
										width="16"
										height="16"
										><path
											fill="#ffffff"
											d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"
										/></svg
									>
									คัดลอก
{:else}
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16"
									height="16"
									><path
										fill="#ffffff" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
									ใช้แล้ว
									{/if}
										</button
								>
						</div>
						<small class="text-primary text-start"
							>* 1 กลุ่มต่อ 1 Code เท่านั้น ไม่สามารถเปลี่ยนได้</small
						>
					</div>
					<div class="d-flex cursor-pointer mb-2" on:click={() => (isExpand = !isExpand)}>
						<span class="fw-semibold">วิธีเชื่อมต่อ Line</span>
						<span class="ms-auto text-secondary text-sm mt-1">
							{#if isExpand}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"
									><path
										d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
									/></svg
								>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"
									><path
										d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
									/></svg
								>
							{/if}</span
						>
					</div>
					{#if isExpand}
						<div class="mb-3">
							<div class="text-secondary"><span>1. </span>คัดลอก Code</div>
							<div class="text-secondary">
								<span>2. </span>กดสร้าง LINE Group, เชิญ LINE OA: SureSure กับทีมงาน
								เข้ากลุ่มที่ใช้ตรวจสลิป
							</div>
							<div class="text-secondary">
								<span>3. </span>ส่ง Code ใน LINE Group ที่ต้องการเชื่อมต่อ
							</div>
							<div class="text-secondary">
								<span>4. </span>เชื่อมต่อสำเร็จ เริ่มตรวจสลิปได้ทันที
							</div>
						</div>
					{/if}
					<span class="fw-semibold">บัญชีรับเงินที่เชื่อมต่อ</span>
					{#each listMyBankAccount.filter((e) => e.is_active) as item}
						<div class="card p-3 mb-3">
							<div class="d-flex justify-content-between mb-2">
								<div class="d-flex">
									<img
										src={(item.account_type === 'BANK' ? listBank : listPromptpay).find(
											(e) =>
												e.value ==
												(item.account_type === 'BANK' ? item.bank_code : item.prompt_pay_type)
										)?.imageUrl || ''}
										alt={item.account_type === 'BANK'}
										class="w-11 h-11 mr-2"
									/>
									<div>
										<div>{item.name_th}</div>
										<div>{item.account_no}</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="position-fixed d-flex w-100 p-3 bg-white" style="bottom:0">
			<div class="w-100 pe-1">
				<button
					class="btn bg-outline-secondary text-dark w-100"
					on:click={() => {
						stepRoom = 'list';
					}}>ย้อนกลับ</button
				>
			</div>
			{#if !roomLineGroupId}
				<div class="w-100 ps-1">
					<button class="btn bg-primary text-white w-100" on:click={() => openLineGroupCreation()}
						>สร้าง LINE Group</button
					>
				</div>
			{/if}
		</div>
	</div>
{/if}
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