<script lang="ts">
	import Swal from 'sweetalert2';
	import Switch from '$lib/components/ui/switch/Switch2.svelte';
	import { PUBLIC_oauth_KEY } from '$env/static/public';
	import dowlaod from '$lib/image/downloads.png';
	import payment from '$lib/image/Payment.png';
	import {
		PUBLIC_API_ENDPOINT,
		PUBLIC_PAYSO_DEFAULT_SECRET,
		PUBLIC_BACKEND_API_KEY,
		PUBLIC_DOMAIN,
		PUBLIC_PAYMENT_URL,
		PUBLIC_PAYMENT_MERCHANT,
		PUBLIC_ORDER_APIKEY,
		PUBLIC_ORDER_SECRETKEY,
		PUBLIC_ORDER_MID,
		PUBLIC_ORDER_URL
	} from '$env/static/public';
	import cookie from 'cookie';
	import { onMount } from 'svelte';

	let loading = false;
	let profile = null;

	let listCategory: any[] = [];
	let listPackages: any[] = [];

	let currentStep = -1;
	let MerchantName: string = '';

	// STEP 1
	let pdpa_1 = false;
	let pdpa_2 = false;

	// STEP 2
	let selectPackage: {
		package_name: string;
		package_price: number;
		quota_limit: number;
		amount: number;
		ordered: number;
		duration: number;
		is_active: boolean;
		created_date: string;
		updated_date: string;
	} | null = null;

	let refNo = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
	let packageData: any = null;
	let paymentData: any = null;
	let countDown: any = '';
	let timeInterval: any = null;

	// STEP 4
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
		},{ label: 'e-Wallet ID', value: 'EWALLETID', imageUrl: 'https://play-lh.googleusercontent.com/dVr2IZFMqilCP3pixPfH1djP_BPhwfjkQyNAjhhzhsFtKfXXh3BomzR3aGg2QMvhya4=w240-h480-rw' },
		// { label: 'บัญชีธนาคาร', value: 'BANKAC', imageUrl: '/src/lib/image/bg-people.png' }
	];
	let isExpand: boolean = true; //เปิดปิดเมนู
	let isOpen: boolean = false; //เปิดปิดเมนู
	let accountId: string = ''; //รหัสบัญชี
	let selectType: string = 'bank'; //ประเภทบัญชี
	let accountType: string = ''; //ประเภทบัญชี
	let accountTypeError: string = ''; //ประเภทบัญชี
	let accountNo: string = ''; //เลขบัญชี
	let accountNoError: string = ''; //เลขบัญชี
	let accountNameTH: string = ''; //ชื่อ-นามสกุล (ไทย)
	let accountNameTHError: string = ''; //ชื่อ-นามสกุล (ไทย)
	let accountNameEN: string = ''; //ชื่อ-นามสกุล (อังกฤษ)
	let accountNameENError: string = ''; //ชื่อ-นามสกุล (อังกฤษ)
	let accountActive: boolean = false; //สถานะ

	// STEP 5
	let listMyBankAccount: any[] = [];

	// STEP 6
	let storeName: string = '';
	let storeNameError: string = '';
	let storeType: string = '';
	let storeTypeError: string = '';
	let storePhone: string = '';
	let storePhoneError: string = '';
	let storeEmail: string = '';
	let storeEmailError: string = '';

	// STEP 7
	let listRoom: any[] = [];
	let listBankRoom: any[] = [];
	let stepRoom: string = '';
	let roomId: number = -1;
	let roomLineGroupId: string = '';
	let roomVerifyCode: string = '';
	let roomName: string = '';
	let roomNameError: string = '';
	let MinAmountReceive: number = 0;
	let HideSenderDetail: boolean = false;
	let HideReceiverDetail: boolean = false;

	onMount(async () => {
		loading = true;
		clearInterval(timeInterval);
		profile = localStorage.getItem('profile')
			? JSON.parse(localStorage.getItem('profile') || '')
			: null;
		if (profile) {
			await Promise.all([GetProfile(), GetBank(), GetPackage(), GetCategory()]);
			await GetRoom();

			if (profile.user_type === 'merchant-register' && profile.step === 4) {
				await UpdateStepMerchant(99);
			}
			if (listRoom.find((e) => e.line_group_id) || profile.step === 99) {
				await UpdateStepMerchant(99);
			}
			const urlParams = new URLSearchParams(window.location.search);
			const step = urlParams.get('step');
			currentStep = Number(step) || 0;
			if (currentStep < profile.step) {
				currentStep = profile.step;
			}
			MerchantName = profile.name_th;

			storeName = profile.store_name;
			storeType = profile.store_category_type;
			storePhone = profile.store_phone;
			storeEmail = profile.store_email;

			try {
				packageData = JSON.parse(localStorage.getItem('packageData')) || null;
			} catch (e) {}
			selectPackage = JSON.parse(localStorage.getItem('selectPackage')) || selectPackage;
			refNo = localStorage.getItem('refNo') || refNo;
			if (currentStep === 2 && packageData) {
				timeInterval = setInterval(Countdown, 1000);
			}
		}

		loading = false;
	});

	// GET
	async function GetProfile() {
		let config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/user/get/${profile.uid}`, config);
		const data = await result.json();
		if (!data) {
			localStorage.removeItem('profile');
			Swal.fire({
				width: '26em',
				imageUrl:
					'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'โทเค็นหมดอายุ',
				text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
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
			window.location.href = '/';
			return;
		}
		profile = data.data;
		localStorage.setItem('profile', JSON.stringify(data.data));
	}
	async function GetBank() {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/bank2/get/${profile.id}`, config);
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
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/room2/get/${profile.id}`, config);
		const data = await result.json();
		listRoom = data.data || [];
		if (data.data && data.data.length === 1) {
			roomId = data.data[0].id;
			listBankRoom = JSON.parse(data.data[0].list_bank) || [];
			roomLineGroupId = data.data[0].line_group_id;
			roomName = data.data[0].room_name;
			roomVerifyCode = data.data[0].qr_token;
			MinAmountReceive = data.data[0].min_receive;
			HideSenderDetail = data.data[0].show_recipient;
			HideReceiverDetail = data.data[0].show_transferor;
			listMyBankAccount = listMyBankAccount.map((e) => {
				return { ...e, is_active: data.data[0].list_bank && data.data[0].list_bank.includes(e.id) };
			});
		} else if (data.data && data.data.length > 1) {
			stepRoom = 'list';
		}
	}
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
		listPackages = data?.data?.filter((e) => e.amount > 0) || [];
	}
	async function GetCategory() {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/user/category/get`, config);
		const data = await result.json();
		listCategory = data.data;
	}
	async function GetStatusPayment() {
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
			// UpdateMerchantPackage();
			await UpdateStepMerchant(3);
		}
	}

	// CREATE
	async function CreateBank() {
		const encryptedAccountNo = await EncryptAccountNo(accountNo.toString());
		try {
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/bank2/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'ngrok-skip-browser-warning': 'true',
					apikey: PUBLIC_BACKEND_API_KEY
				},
				body: JSON.stringify({
					user_id: profile.id,
					bank_code: selectType === 'bank' ? accountType : '',
					prompt_pay_type: selectType === 'bank' ? '' : accountType,
					account_no: encryptedAccountNo,
					account_type: selectType === 'bank' ? 'BANK' : 'PP',
					name_th: accountNameTH,
					name_en: accountNameEN
				})
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
					text: 'เพิ่มบัญชีธนาคารสำเร็จ',
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
					UpdateStepMerchant(5);
				});
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
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
				user_id: profile.id,
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
				UpdateStepMerchant(7);
			});
		}
	}

	// UPDATE
	async function UpdateStep(step: number) {
		if (step === 0) {
			loading = true;
			// PDPA
			if (!pdpa_1) {
				Swal.fire({
					width: '26em',
					imageUrl:
						'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'กรุณาตรวจสอบข้อมูล',
					text: 'กรุณายอมรับข้อตกลงก่อนทำการสมัครสมาชิก',
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
			UpdateStepMerchant(1);
		} else if (step === 1) {
			loading = true;
			// Configurations
			const packagePrice = Number(selectPackage?.package_price) || 0;
			const packageName = selectPackage?.package_name || '';
			const packageId = Number(selectPackage?.id) || '';
			const email = profile?.email || '';
			const merchantId = profile?.id;
			const status = packagePrice === 0 ? 'SUCCESS' : 'PENDING';
			const headers = {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true'
			};

			// Fetch Data
			try {
				[packageData, paymentData] = await Promise.all([
					packagePrice > 0 &&
						fetch(
							`${PUBLIC_PAYMENT_URL}?merchantID=${PUBLIC_PAYMENT_MERCHANT}&productDetail=${packageName}&customerEmail=${email}&customerName=${profile.name_th}&total=${packagePrice}&referenceNo=${refNo}`,
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
					loading = false;
					throw new Error(
						paymentData?.message?.includes('duplicate')
							? 'รายการนี้ถูกสร้างไปแล้ว'
							: 'ไม่สามารถซื้อแพ็กเกจได้ กรุณาลองใหม่อีกครั้ง'
					);
				}
			} catch (error) {
				loading = false;
				Swal.fire({
					width: '26em',
					imageUrl:
						'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'กรุณาตรวจสอบข้อมูล',
					text: error.message,
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
				return;
			}
			// Finalize
			localStorage.setItem('packageData', JSON.stringify(packageData));
			localStorage.setItem('selectPackage', JSON.stringify(selectPackage));

			if (packagePrice > 0) {
				localStorage.setItem('refNo', refNo);
				timeInterval = setInterval(Countdown, 1000);
			} else {
				localStorage.removeItem('refNo');
				localStorage.removeItem('packageData');
				localStorage.removeItem('selectPackage');
				// await UpdateMerchantPackage();
			}
			UpdateStepMerchant(packagePrice === 0 ? 4 : 2);
		} else if (step === 3) {
			loading = true;
			UpdateStepMerchant(4);
		} else if (step === 4) {
			// สร้างบัญชีธนาคาร
			accountTypeError = '';
			accountNoError = '';
			accountNameTHError = '';
			accountNameENError = '';
			let size = selectType === 'promptpay' && accountType === 'NATID' ? 13 : accountType === 'MSISDN' ? 10: 100;
			if (!accountType) {
				accountTypeError = 'กรุณาเลือกประเภทบัญชี';
				return;
			} else if (!accountNo || ((accountType === "NATID" || accountType === "MSISDN") && accountNo.length !== size)) {
				accountNoError =
					'กรุณากรอกเลขบัญชี' +
					(selectType === 'promptpay' ? 'พร้อมเพย์' : 'ธนาคาร') +
					'ให้ครบถ้วน';
				return;
			} else if (!accountNameTH) {
				accountNameTHError = 'กรุณากรอกชื่อบัญชีให้ครบถ้วน';
				return;
			} else if (!accountNameEN) {
				accountNameENError = 'กรุณากรอกชื่อบัญชีให้ครบถ้วน';
				return;
			} else {
				loading = true;
				sessionStorage.removeItem('accountId');
				if (accountId) {
					await UpdateBank();
				} else {
					await CreateBank();
				}
				GetBank();
				loading = false;
			}
		} else if (step === 5) {
			loading = true;
			UpdateStepMerchant(6);
		} else if (step === 6) {
			if (!storeName || !storeType || !storePhone || !storeEmail) {
				Swal.fire({
					width: '26em',
					imageUrl:
						'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'กรุณาตรวจสอบข้อมูล',
					text: !storeName
						? 'กรุณาระบุชื่อร้าน'
						: !storeType
							? 'กรุณาระบุประเภทธุรกิจ'
							: !storePhone
								? 'กรุณาระบุเบอร์โทรศัพท์'
								: !storeEmail
									? 'กรุณาระบุอีเมล'
									: '',
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
				return;
			} else {
				loading = true;
				let update_profile = await UpdateProfile();
				if (update_profile) {
					GetProfile();
					roomName = 'สาขาหลัก';
					MinAmountReceive = 0;
					HideSenderDetail = false;
					HideReceiverDetail = false;
					await CreateRoom();
					GetRoom();
				}
				loading = false;
			}
		}
	}
	async function UpdateMerchantPackage() {
		const updatedPackageChangeDate = new Date(profile.package_change_date);
		updatedPackageChangeDate.setDate(
			updatedPackageChangeDate.getDate() + (Number(selectPackage?.duration) || 0)
		);

		let config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			},
			body: JSON.stringify({
				package_id: parseInt(selectPackage?.id || '', 10),
				id: parseInt(profile?.id, 10),
				quota_left: profile.quota_left + selectPackage?.quota_limit,
				quota_all: profile.quota_all + selectPackage?.quota_limit,
				package_change_date: updatedPackageChangeDate
			})
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/user/update`, config);

		const data = await result.json();
		return data;
	}
	async function UpdateStepMerchant(step) {
		try {
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/user/update`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'ngrok-skip-browser-warning': 'true',
					apikey: PUBLIC_BACKEND_API_KEY
				},
				body: JSON.stringify({
					id: profile.id,
					step: step
				})
			});
			if (step === 99) {
				window.location.href = `/dashboard`;
			} else {
				window.location.href = `/advice?step=${step}`;
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}
	async function UpdateProfile() {
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
			return true;
		} else if (data.message === 'Duplicate Request') {
			Swal.fire({
				width: '26em',
				imageUrl:
					'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'กรุณาตรวจสอบข้อมูล',
				text: 'ข้อมูลร้านค้านี้มีอยู่แล้วในระบบ',
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
			return false;
		} else {
			Swal.fire({
				width: '26em',
				imageUrl:
					'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'กรุณาตรวจสอบข้อมูล',
				text: 'ไม่สามารถแก้ไขข้อมูลได้',
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
			return false;
		}
	}
	async function UpdateBank() {
		try {
			const encryptedAccountNo = await EncryptAccountNo(accountNo.toString());
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/bank2/update`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'ngrok-skip-browser-warning': 'true',
					apikey: PUBLIC_BACKEND_API_KEY
				},
				body: JSON.stringify({
					id: accountId,
					bank_code: selectType === 'bank' ? accountType : '',
					prompt_pay_type: selectType === 'bank' ? '' : accountType,
					account_no: encryptedAccountNo,
					account_type: selectType === 'bank' ? 'BANK' : 'PP',
					name_th: accountNameTH,
					name_en: accountNameEN
				})
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
					text: 'แก้ไขบัญชีธนาคารสำเร็จ',
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
					UpdateStepMerchant(5);
				});
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
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

	// DELETE
	async function DeleteBank() {
		try {
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/bank2/delete/${accountId}`, {
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
					text: 'ลบบัญชีธนาคารสำเร็จ',
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
				GetBank();
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
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
			console.error('เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ:', error);
			alert('ไม่สามารถดาวน์โหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
		}
	}

	// FUNCTION
	async function Countdown() {
		const now = new Date();
		const endDate = new Date(packageData.data.expiredate);
		const timeRemaining = endDate.getTime() - now.getTime();
		if (Math.floor(timeRemaining / 1000) % 10 === 0) {
			GetStatusPayment();
		}
		if (timeRemaining <= 0) {
			localStorage.removeItem('packageData');
			localStorage.removeItem('selectPackage');
			clearInterval(timeInterval);

			localStorage.removeItem('refNo');
			await UpdateOrderPackage('CANCEL');
			await UpdateStepMerchant(1);

			return Swal.fire({
				width: '26em',
				imageUrl:
					'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
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
			});
		}

		const minutes = String(Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))).padStart(
			2,
			'0'
		);
		const seconds = String(Math.floor((timeRemaining % (1000 * 60)) / 1000)).padStart(2, '0');

		countDown = `${minutes}:${seconds}`;
	}
	async function EncryptAccountNo(accountNo: string): Promise<string> {
		const encoder = new TextEncoder();
		const plaintextBytes = encoder.encode(accountNo);

		const nonce = new Uint8Array(16);
		window.crypto.getRandomValues(nonce);
		const key = encoder.encode(PUBLIC_PAYSO_DEFAULT_SECRET);
		const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: 'AES-CTR' }, false, [
			'encrypt'
		]);

		const ciphertext = await window.crypto.subtle.encrypt(
			{ name: 'AES-CTR', counter: nonce, length: 128 },
			cryptoKey,
			plaintextBytes
		);

		const combined = new Uint8Array(nonce.length + ciphertext.byteLength);
		combined.set(nonce);
		combined.set(new Uint8Array(ciphertext), nonce.length);

		return btoa(String.fromCharCode(...combined));
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
			await fetch(`${PUBLIC_API_ENDPOINT}/room2/howto/${roomId}/${profile?.username}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${PUBLIC_oauth_KEY}`,
						apikey: PUBLIC_BACKEND_API_KEY
					}
				});
			// เปิดแอป LINE ตามแพลตฟอร์ม
			if (isIOS || isAndroid) {
				
				window.location.href = 'line://oaMessage/@suresure';
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
	function formatDate(isoDate: string) {
		const date = new Date(isoDate);

		// Format to DD/MM/YYYY
		const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

		return formattedDate;
	}
</script>

<div class="w-100">
	{#if currentStep === 0}
		<div class="row mx-0">
			<div
				class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative"
				style="height:100%;min-height:100vh;"
			>
				<div class="d-flex justify-center mb-3">
					<svg
						width="97"
						height="53"
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
								<use
									xlink:href="#image0_40_6806"
									transform="matrix(0.000961538 0 0 0.00175 0 -0.41)"
								/>
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
				<div class="card py-2 px-3 shadow mb-3">
					<div class="d-flex align-items-center">
						<img
							alt="user"
							src={profile?.picture || 'https://img2.pic.in.th/pic/Avatar9a802c5e3f7f13e6.png'}
							class="rounded-circle me-4"
							width="48px"
							height="48px"
						/>
						<b>{MerchantName}</b>
					</div>
				</div>
				<div class="card py-2 px-3 shadow mb-3 flex-1">
					<div class="py-2 overflow-scroll" style="max-height: calc(100vh - 370px);font-size:14px;">
						<h5 class="fw-bold h5 mb-2">ข้อกำหนดการใช้งาน</h5>
						<h6 class="fw-bold my-3">นโยบายข้อมูลส่วนบุคคลสำหรับผลิตภัณฑ์ SureSure</h6>
						<p style="text-indent:30px">
							<b>บริษัท เพย์ โซลูชั่น จำกัด</b> ("บริษัท") ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้บริการ
							SureSure ซึ่งเป็นบริการตรวจสอบ e-Slip โดยบริษัทจะเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่านตามที่ระบุไว้ในนโยบายฉบับนี้
						</p>
						<h6 class="h6 fw-bold mt-3">คำนิยาม</h6>
						<ol class="list-decimal ms-5">
							<li>
								<b>ข้อมูลส่วนบุคคล :</b> หมายถึง ข้อมูลใด ๆ ที่สามารถใช้ระบุตัวบุคคลได้โดยตรงหรือโดยอ้อมเช่น
								ชื่อ นามสกุล เบอร์โทรศัพท์ อีเมล หรือหมายเลขบัตรประชาชน
							</li>
							<li><b>เจ้าของข้อมูล :</b> หมายถึง บุคคลธรรมดาที่ข้อมูลส่วนบุคคลนั้นเกี่ยวข้อง</li>
							<li><b>การประมวลผล :</b> หมายถึง การเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล</li>
							<li>
								<b>ผู้เยาว์ :</b> หมายถึง บุคคลที่มีอายุต่ำกว่า 20 ปี ยกเว้นกรณีที่สมรสแล้วตามกฎหมาย
							</li>
							<li>
								<b>ผู้เสมือนไร้ความสามารถและผู้ไร้ความสามารถ :</b> หมายถึง บุคคลที่ศาลสั่งให้มีผู้อนุบาลหรือผู้พิทักษ์ดูแลตามกฎหมาย
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">1. การเก็บรวบรวมข้อมูลส่วนบุคคล</h6>
						<p>บริษัทอาจเก็บรวบรวมข้อมูลส่วนบุคคลจากช่องทางดังต่อไปนี้:</p>
						<ul class="ms-5 list-disc">
							<li>
								<b>โดยตรง :</b> จากการติดต่อหรือสื่อสารผ่านช่องทางต่าง ๆ เช่น โทรศัพท์ อีเมล หรือ LINE
							</li>
							<li>
								<b>โดยอ้อม :</b> ผ่านบุคคลที่สาม เช่น พันธมิตรทางธุรกิจ หรือบุคคลที่ได้รับอนุญาตจากท่าน
							</li>
							<li>
								<b>อัตโนมัติ :</b> ผ่านเทคโนโลยี เช่น เว็บไซต์ แอปพลิเคชัน หรือการใช้คุกกี้ (Cookies)
								เพื่อการติดตามและบันทึกพฤติกรรมการใช้งาน
							</li>
						</ul>
						<h6 class="h6 fw-bold mt-3">2. ประเภทของข้อมูลส่วนบุคคลที่เก็บรวบรวม</h6>
						<ul class="ms-5 list-disc">
							<li>
								<b>ข้อมูลส่วนบุคคลพื้นฐาน :</b> ชื่อ-นามสกุล วันเดือนปีเกิด และข้อมูลบัตรประชาชนหรือเอกสารแสดงตนอื่น
								ๆ ข้อมูลการติดต่อ: เบอร์โทรศัพท์ อีเมล LINE ID และที่อยู่
							</li>
							<li>
								<b>ข้อมูลธุรกรรม :</b> รายละเอียดเกี่ยวกับการทำธุรกรรม เช่น หมายเลขบัญชี ข้อมูล e-Slip
								และวันที่ทำธุรกรรม
							</li>
							<li><b>ข้อมูลทางเทคนิค :</b> เช่น IP Address, Cookies, และข้อมูลการเข้าถึงระบบ</li>
						</ul>
						<h6 class="h6 fw-bold mt-3">3. วัตถุประสงค์ในการใช้ข้อมูลส่วนบุคคล</h6>
						<ol class="list-decimal ms-5">
							<li>
								<b>การให้บริการ :</b> เพื่อดำเนินการตรวจสอบ -Slip และสนับสนุนการใช้งานของลูกค้า
							</li>
							<li>
								<b>การบริหารจัดการ :</b> สำหรับจัดทำเอกสารบัญชี การประเมินผล และการวิเคราะห์การดำเนินธุรกิจ
							</li>
							<li>
								<b>การปรับปรุงบริการ :</b> เพื่อพัฒนาประสบการณ์การใช้งานและเพิ่มประสิทธิภาพของบริการ
							</li>
							<li>
								<b>การปฏิบัติตามกฎหมาย :</b> เพื่อปฏิบัติตามข้อกำหนดทางกฎหมายที่เกี่ยวข้อง เช่น การจัดทำรายงานทางบัญชีและภาษี
							</li>
							<li>
								<b>การสื่อสารทางการตลาด :</b> การประชาสัมพันธ์ข่าวสารหรือโปรโมชั่นต่าง ๆ (ภายใต้ความยินยอมจากท่าน)
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">4. การเปิดเผยข้อมูลส่วนบุคคล</h6>
						<p>บริษัทอาจเปิดเผยข้อมูลส่วนบุคคลแก่บุคคลหรือหน่วยงานดังต่อไปนี้:</p>
						<ol class="list-decimal ms-5">
							<li>
								<b>ผู้ให้บริการที่เกี่ยวข้อง :</b> เช่น ผู้ให้บริการระบบคลาวด์ ที่ปรึกษา หรือบริษัทพันธมิตรที่ช่วยสนับสนุนการดำเนินงาน
							</li>
							<li>
								<b>หน่วยงานของรัฐ :</b> ตามข้อกำหนดทางกฎหมาย เช่น ศาลหรือหน่วยงานราชการที่เกี่ยวข้อง
							</li>
							<li>
								<b>คู่ค้าและพันธมิตรทางธุรกิจ :</b> ในกรณีที่จำเป็นสำหรับการให้บริการ เช่น ระบบชำระเงินหรือบริการที่เกี่ยวข้อง
							</li>
							<li>
								<b>กรณีธุรกรรมพิเศษ :</b> เช่น การควบรวมกิจการหรือการโอนสิทธิการดำเนินงาน บริษัทอาจเปิดเผยข้อมูลแก่ผู้ที่เกี่ยวข้อง
								โดยแจ้งให้เจ้าของข้อมูลทราบล่วงหน้า
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">5. ระยะเวลาในการจัดเก็บข้อมูลส่วนบุคคล</h6>
						<p>บริษัทจะเก็บข้อมูลส่วนบุคคลตามความจำเป็น:</p>
						<ul class="ms-5 list-disc">
							<li>ระยะเวลาที่ให้บริการ</li>
							<li>ตามข้อกำหนดทางกฎหมาย</li>
							<li>จนกว่าท่านจะถอนความยินยอม</li>
						</ul>
						<h6 class="h6 fw-bold mt-3">6. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h6>
						<ol class="list-decimal ms-5">
							<li>
								<b>สิทธิในการเข้าถึง :</b> ท่านมีสิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลของท่าน
							</li>
							<li>
								<b>สิทธิในการแก้ไข :</b> ท่านมีสิทธิขอให้แก้ไขข้อมูลส่วนบุคคลที่ไม่ถูกต้องหรือไม่สมบูรณ์
							</li>
							<li>
								<b>สิทธิในการลบ :</b> ท่านสามารถขอให้ลบข้อมูลส่วนบุคคลของท่านได้ในกรณีที่ไม่จำเป็นต้องใช้ข้อมูลดังกล่าวอีกต่อไป
							</li>
							<li>
								<b>สิทธิในการคัดค้าน :</b> ท่านสามารถคัดค้านการประมวลผลข้อมูลส่วนบุคคลของท่านในบางกรณีได้
							</li>
							<li>
								<b>สิทธิในการโอนย้ายข้อมูล:</b> ท่านสามารถขอให้โอนย้ายข้อมูลส่วนบุคคลของท่านไปยังผู้ให้บริการรายอื่น
							</li>
							<li>
								<b>สิทธิในการระงับ :</b> ท่านมีสิทธิขอให้ระงับการประมวลผลข้อมูลส่วนบุคคลชั่วคราว
							</li>
							<li>
								<b>สิทธิในการถอนความยินยอม :</b> ท่านสามารถถอนความยินยอมในการประมวลผลข้อมูลส่วนบุคคลได้ตลอดเวลา
							</li>
							<li>
								<b>สิทธิในการร้องเรียน :</b> ท่านสามารถยื่นข้อร้องเรียนต่อหน่วยงานที่กำกับดูแล หากพบว่าบริษัทละเมิดสิทธิข้อมูลส่วนบุคคลของท่าน
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">
							7. ข้อมูลส่วนบุคคลของผู้เยาว์ ผู้เสมือนไร้ความสามารถ และผู้ไร้ความสามารถ
						</h6>
						<ol class="list-decimal ms-5">
							<li>
								<b>ข้อมูลผู้เยาว์ :</b> หากผู้ให้ข้อมูลเป็นผู้เยาว์ (ต่ำกว่า 20 ปี) บริษัทจะขอความยินยอมจากผู้ปกครองตามที่กฎหมายกำหนดก่อนดำเนินการเก็บรวบรวมใช้
								หรือเปิดเผยข้อมูลส่วนบุคคลของผู้เยาว์
							</li>
							<li>
								<b>ข้อมูลผู้เสมือนไร้ความสามารถและผู้ไร้ความสามารถ :</b> บริษัทจะดำเนินการเก็บรวบรวม
								ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของบุคคลดังกล่าวโดยได้รับความยินยอมจากผู้อนุบาลหรือผู้พิทักษ์ตามที่กฎหมายกำหนด
							</li>
							<li>
								<b>การปฏิบัติตามกฎหมาย :</b> บริษัทรับรองว่าจะดำเนินการตามมาตรฐานที่กำหนดโดยกฎหมายคุ้มครองข้อมูลส่วนบุคคลและกฎหมายอื่น
								ๆ ที่เกี่ยวข้อง
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">8. มาตรการรักษาความปลอดภัย</h6>
						<p style="text-indent:30px">
							บริษัทใช้มาตรการป้องกันการเข้าถึง การเปลี่ยนแปลง และการเปิดเผยข้อมูลโดยไม่ได้รับอนุญาต
						</p>
						<h6 class="h6 fw-bold mt-3">9. การใช้คุกกี้ (Cookies)</h6>
						<p style="text-indent:30px">
							บริษัทใช้คุกกี้และเทคโนโลยีที่คล้ายกันเพื่อพัฒนาประสบการณ์การใช้งานของท่าน
							รวมถึงการจดจำการตั้งค่า การวิเคราะห์พฤติกรรมการใช้งาน และการนำเสนอเนื้อหาที่เหมาะสม
							ท่านสามารถตั้งค่าเบราว์เซอร์เพื่อปฏิเสธคุกกี้หรือลบคุกกี้ได้
							แต่การปฏิเสธคุกกี้อาจส่งผลต่อการใช้งานบางส่วนของบริการ
						</p>
						<h6 class="h6 fw-bold mt-3">10. การแจ้งเหตุละเมิดข้อมูลส่วนบุคคล</h6>
						<p style="text-indent:30px">
							ในกรณีที่เกิดเหตุละเมิดข้อมูลส่วนบุคคล
							บริษัทจะดำเนินการแจ้งเหตุให้สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลทราบภายใน 72
							ชั่วโมงหลังจากพบเหตุละเมิด
							และในกรณีที่การละเมิดอาจส่งผลกระทบต่อสิทธิหรือเสรีภาพของท่าน
							บริษัทจะแจ้งให้ท่านทราบทันทีพร้อมทั้งเสนอแนวทางการเยียวยาผ่านช่องทางที่เหมาะสม เช่น
							อีเมล โทรศัพท์ หรือประกาศผ่านเว็บไซต์
						</p>
						<h6 class="h6 fw-bold mt-3">11. การเปลี่ยนแปลงนโยบาย</h6>
						<p style="text-indent:30px">
							บริษัทขอสงวนสิทธิ์ในการปรับปรุง แก้ไข
							หรือเปลี่ยนแปลงนโยบายข้อมูลส่วนบุคคลฉบับนี้ได้ตลอดเวลา ทั้งนี้
							บริษัทจะแจ้งให้ท่านทราบล่วงหน้าผ่านช่องทางที่เหมาะสม เช่น เว็บไซต์ของบริษัท หรืออีเมล
							โดยนโยบายฉบับที่มีการเปลี่ยนแปลงจะมีผลบังคับใช้หลังการแจ้งให้ทราบ
						</p>
						<h6 class="h6 fw-bold mt-3">12. การติดต่อบริษัท</h6>
						<p>หากมีข้อสงสัยเกี่ยวกับนโยบายนี้ ท่านสามารถติดต่อได้ที่:</p>
						<ul class="ms-5 list-disc mb-3">
							<li>ชื่อบริษัท: บริษัท เพย์ โซลูชั่น จำกัด</li>
							<li>
								ที่อยู่: 90 อาคารซีดับเบิ้ลยู ทาวเวอร์ อาคาร บี ชั้น 25 ยูนิต B2502 ถนนรัชดาภิเษก
								แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310
							</li>
							<li>อีเมล: pdpasupport@tarad.com</li>
							<li>เบอร์โทรศัพท์: 02-821-6163 หรือ 095-372-2154</li>
						</ul>
						<hr />
						<h6 class="fw-bold my-3">
							เงื่อนไขการให้บริการ SureSure ของบริษัท เพย์ โซลูชั่น จำกัด
						</h6>
						<h6 class="h6 fw-bold mt-3">บทนำ</h6>
						<p style="text-indent:30px">
							บริการ SureSure Slip Verification API (“บริการ”) ของบริษัท เพย์ โซลูชั่น จำกัด
							(“ผู้ให้บริการ”) เป็นบริการที่ช่วยตรวจสอบความถูกต้องของหลักฐานการชำระเงิน (Slip)
							ผ่านช่องทาง API โดยการใช้บริการนี้ถือว่าผู้ใช้บริการ (“ลูกค้า”)
							ยอมรับและตกลงปฏิบัติตามข้อตกลงนี้ รวมถึงกฎหมายที่เกี่ยวข้อง
							และการเปลี่ยนแปลงในอนาคตที่อาจเกิดขึ้น
						</p>
						<h6 class="h6 fw-bold mt-3">1. การใช้งาน API และความรับผิดชอบของผู้ใช้บริการ</h6>
						<p style="text-indent:30px">
							ลูกค้าจะได้รับรหัส API Key หรือ Access Token เพื่อเข้าถึงบริการ Slip Verification API
							หลังจากสมัครสมาชิก การเชื่อมต่อระบบ API ใช้เพื่อรับ-ส่งคำสั่ง รายงาน
							และผลการตรวจสอบหลักฐานการชำระเงิน
						</p>
						<p style="text-indent:30px">
							ทั้งนี้ลูกค้าต้องรักษา API Key ให้ปลอดภัย หากเกิดการละเมิด
							ลูกค้าต้องรับผิดชอบต่อความเสียหายที่เกิดขึ้น ข้อมูลที่ส่งเข้าระบบต้องถูกต้องและครบถ้วน
							โดยทุกธุรกรรมที่ใช้บริการ API จะถูกนับและหักจากโควต้าตามแพ็กเกจที่ลูกค้าเลือก
						</p>
						<h6 class="h6 fw-bold mt-3">2. เงื่อนไขการใช้งาน</h6>
						<ol class="list-decimal ms-5">
							<li>
								การบริการเปิดให้ใช้งานทุกวันตลอด 24 ชั่วโมง
								ยกเว้นช่วงเวลาซ่อมบำรุงหรือเหตุขัดข้องอื่นที่จำเป็น
							</li>
							<li>ผู้ใช้บริการต้องรับผิดชอบการติดตั้งและการเชื่อมต่อ API ด้วยตนเอง</li>
							<li>
								การใช้ API ต้องมีวัตถุประสงค์เพื่อการตรวจสอบ Slip ชำระเงินเท่านั้น
								ห้ามใช้งานในทางที่ผิดกฎหมายหรือก่อให้เกิดความเสียหายต่อระบบ
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">3. ระบบสมาชิกและค่าบริการ</h6>
						<ol class="list-decimal ms-5">
							<li>การสมัครสมาชิกต้องผ่านกระบวนการยืนยันตัวตน</li>
							<li>การเติมเครดิตและเลือกแพ็กเกจทำผ่านช่องทางที่ผู้ให้บริการกำหนด เช่น PromptPay</li>
							<li>เมื่อโควต้าหมด ระบบจะระงับการใช้งานจนกว่าจะเติมเครดิตใหม่</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">4. การยกเลิกและการระงับการให้บริการ</h6>
						<ol class="list-decimal ms-5">
							<li>
								ลูกค้าสามารถยกเลิกการเป็นสมาชิกได้ตลอดเวลา โดยค่าบริการที่ชำระแล้วไม่สามารถขอคืนได้
							</li>
							<li>ข้อมูลจะถูกเก็บรักษาไม่เกิน 6 เดือน หรือเป็นไปตามข้อกำหนดทางกฎหมาย</li>
							<li>
								ผู้ให้บริการอาจระงับหรือยกเลิกบริการทันทีในกรณีต่อไปนี้:
								<ul class="ms-5 list-disc mb-3">
									<li>ลูกค้าฝ่าฝืนข้อตกลงการใช้งาน</li>
									<li>ลูกค้าใช้บริการในทางที่ผิดกฎหมายหรือก่อให้เกิดความเสียหายต่อระบบ</li>
									<li>การตรวจพบพฤติกรรมที่อาจเป็นภัยต่อความปลอดภัยของระบบ</li>
								</ul>
							</li>
							<li>
								การระงับหรือยกเลิกการให้บริการมีเป้าหมายเพื่อรักษาความปลอดภัย ความโปร่งใส
								และประสิทธิภาพของระบบ
							</li>
							<li>
								การเปลี่ยนแปลงใด ๆ ในบริการจะมุ่งเน้นเพื่อประสิทธิภาพและความมั่นคงของระบบ
								โดยไม่จำเป็นต้องแจ้งล่วงหน้า
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">5. นโยบายการคืนเงิน</h6>
						<p style="text-indent:30px">ผู้ให้บริการสงวนสิทธิ์ในการไม่คืนค่าบริการในทุกกรณี</p>
						<h6 class="h6 fw-bold mt-3">6. ข้อกำหนดทางกฎหมาย</h6>
						<ol class="list-decimal ms-5">
							<li>ผู้ให้บริการดำเนินการภายใต้กฎหมายไทย รวมถึง พ.ร.บ. ระบบการชำระเงิน พ.ศ. 2560</li>
							<li>
								ลูกค้าต้องปฏิบัติตามกฎหมายและระเบียบที่เกี่ยวข้อง
								รวมถึงการไม่กระทำผิดที่ส่งผลกระทบต่อบุคคลที่สาม
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">7. การติดต่อ</h6>
						<p style="text-indent:30px">สอบถามข้อมูลเพิ่มเติมหรือติดต่อเราได้ผ่านช่องทางดังนี้:</p>
						<ol class="list-decimal ms-5">
							<li>
								<b>ที่อยู่ :</b> เลขที่ 90 อาคารซีดับเบิ้ลยู ทาวเวอร์ อาคาร บี ชั้น 25 ยูนิต B2502 ถนนรัชดาภิเษก
								แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310
							</li>
							<li>
								<b>เว็บไซต์ของบริษัท :</b>
								<a href="https://www.paysolutions.asia/" target="_blank"
									>https://www.paysolutions.asia/</a
								>
							</li>
							<li>
								<b>แจ้งเรื่องออนไลน์ :</b>
								<a href="mailto:pdpasupport@tarad.com" target="_blank">pdpasupport@tarad.com</a>
							</li>
							<li>
								<b>เบอร์โทรศัพท์ :</b> <a href="tel:028216163" target="_blank">02-821-6163</a>
								หรือ
								<a href="tel:0953722154" target="_blank">095-372-2154</a>
							</li>
						</ol>
						<h6 class="h6 fw-bold mt-3">เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล</h6>
						<ol class="list-decimal ms-5">
							<li>
								<b>ที่อยู่ :</b> อาคารซีดับเบิ้ลยู ทาวเวอร์ อาคาร บี ชั้น 25 ยูนิต B2502 เลขที่ 90 ถ.
								รัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310
							</li>
							<li>
								<b>แจ้งเรื่องออนไลน์ :</b>
								<a href="mailto:pdpasupport@tarad.com" target="_blank">pdpasupport@tarad.com</a>
							</li>
						</ol>
						<p style="text-indent:30px">
							เงื่อนไขการให้บริการทั้งหมดนี้มีวัตถุประสงค์เพื่อให้ผู้ใช้บริการมั่นใจในความปลอดภัย
							ความโปร่งใส และประสิทธิภาพของระบบ SureSure ของบริษัท เพย์ โซลูชั่น จำกัด
							หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อเราได้ทันที!
						</p>
					</div>
					<hr />
					<div class="py-2">
						<div class="d-flex align-items-start mb-2">
							<input
								type="checkbox"
								class="mt-1 me-3"
								bind:checked={pdpa_1}
								on:change={() => {
									pdpa_1Error = false;
								}}
							/>
							<span>ฉันรับทราบและยอมรับข้อตกลงตามนโยบายความเป็นส่วนตัวและข้อตกลงการใช้บริการ</span>
						</div>
						<div class="d-flex align-items-start mb-2">
							<input type="checkbox" class="mt-1 me-3" bind:checked={pdpa_2} />
							<span
								>ฉันรับทราบและยินยอมให้เก็บรวบรวม ใช้ และเปิดเผยข้อมูล ส่วนบุคคล
								เพื่อวัตถุประสงค์ทางการตลาด</span
							>
						</div>
						<button
							class={`btn ${pdpa_1 ? 'bg-primary' : 'bg-secondary'} text-white w-100`}
							on:click={() => {
								if (pdpa_1) {
									UpdateStep(0);
								} else {
									Swal.fire({
										width: '26em',
										imageUrl:
											'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
										imageWidth: 72,
										imageHeight: 72,
										imageAlt: 'Custom image',
										showCloseButton: true,
										title: 'กรุณาตรวจสอบข้อมูล',
										text: 'กรุณายอมรับข้อตกลงตามนโยบายความเป็นส่วนตัว',
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
									pdpa_1Error = true;
								}
							}}>สมัครสมาชิก</button
						>
					</div>
				</div>
			</div>
		</div>
	{:else if currentStep === 1}
		<div class="w-100 p-3 pt-5 min-vh-100">
			<h5 class="text-center h5 fw-semibold">ราคาแพ็กเกจ</h5>
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
									<span class="fw-semibold ps-3">{pkg.quota_limit?.toLocaleString() || 0} สลิป</span
									>
								</div>
								{#if pkg.package_price !== 0}
									<div class="d-flex mb-2">
										<div style="width:24px">
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
										</div>
										<span class="ps-3 overflow-hidden text-nowrap text-ellipsis"
											>ราคาเฉลี่ย {(pkg.package_price / pkg.quota_limit).toFixed(2)} บาท / สลิป</span
										>
									</div>
								{/if}
								<div class="d-flex mb-2">
									<div style="width:24px">
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
									</div>
									<span class="ps-3 overflow-hidden text-nowrap text-ellipsis"
										>{pkg.package_price === 0 ? 'ใช้ฟรี' : 'ระยะเวลา'} 30 วัน</span
									>
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
									on:click={() => {
										selectPackage = pkg;
										UpdateStep(1);
									}}>{pkg.package_price === 0 ? 'ทดลองใช้' : 'ซื้อเลย'}</button
								>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if currentStep === 2}
		<div class="row min-vh-100 px-3 py-5 mx-0">
			<div class="col-12 col-md-8 col-lg-6 mx-auto">
				<div class="card px-2 py-4 shadow mb-3">
					<h5 class="font-semibold h5 text-center mb-3">สแกนเพื่อชำระเงิน</h5>
					{#if packageData}
						<div class="flex justify-center">
							<div class="border-2 border-[#113566] rounded-md overflow-hidden w-5/5">
								<div class=" bg-[#113566] flex justify-center">
									<img src={payment} width="120px" height="100px" />
								</div>
								<div class="">
									<img
										src={packageData.data.image}
										class="w-[220px] h-[220px] lg:w-[250px] lg:h-[230px]"
									/>
								</div>
							</div>
						</div>
					{/if}
					<div class="d-flex justify-content-center mt-3 mb-2">
						<span class="text-secondary">แพ็กเกจ :</span>
						<span class="font-semibold">{selectPackage?.package_name}</span>
					</div>
					<div class="d-flex justify-content-center mb-2">
						<span class="text-secondary">จำนวนเงิน :</span>
						<h4 class="font-semibold text-primary h4">
							฿ {selectPackage?.package_price.toLocaleString() || 0}
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
						on:click={() => DownloadImage(packageData.data.image, 'QRcode.png')}
					>
						<img alt="" src={dowlaod} width="18px" height="18px" class="mr-3" />ดาวน์โหลดคิวอาร์โค้ด
					</button>
					<!-- <button
						class="w-100 btn bg-danger text-white"
						on:click={() => {
							localStorage.removeItem('packageData');
							localStorage.removeItem('selectPackage');

							clearInterval(timeInterval);
							UpdateStepMerchant(1);
						}}
					>
						รีเซ็ต
					</button> -->
				</div>
			</div>
		</div>
	{:else if currentStep === 3}
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
						<span class="font-semibold"
							>฿ {(selectPackage?.package_price ?? 0).toLocaleString()}</span
						>
					</div>
					<div class="d-flex justify-content-center">
						<span class="text-secondary me-2">จำนวนตรวจสอบ :</span>
						<span class="font-semibold">{selectPackage?.quota_limit} สลิป</span>
					</div>
					<div class="d-flex justify-content-center">
						<span class="text-secondary me-2">วันที่หมดอายุ :</span>
						<span class="font-semibold">{formatDate(profile?.package_change_date || '')}</span>
					</div>

					<button class="btn bg-primary text-white w-100 mt-3" on:click={() => UpdateStep(3)}
						>เริ่มต้นสร้างร้านค้า</button
					>
				</div>
			</div>
		</div>
	{:else if currentStep === 4}
		<div class="row mx-0 pt-4">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative">
				<h4 class="font-semibold h4 mb-4">สร้างร้านค้าของคุณ</h4>
				<div class="d-flex">
					<div class="w-100 mx-1 text-nowrap text-primary">
						<b class="px-2">1. บัญชีรับเงิน</b>
						<div class="w-100 bg-primary" style="height:3px"></div>
					</div>
					<div class="w-100 mx-1 text-nowrap text-secondary">
						<b class="px-2">2. ร้านค้า</b>
						<div class="w-100 bg-secondary" style="height:3px"></div>
					</div>
					<div class="w-100 mx-1 text-nowrap text-secondary">
						<b class="px-2">3. สาขา</b>
						<div class="w-100 bg-secondary" style="height:3px"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="position-relative w-100">
			<div class="row mx-0">
				<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative">
					<div class="card px-3 py-4 shadow" style="min-height:100vh;margin-bottom:100px">
						<h5 class="fw-semibold h5 mb-2">{accountId && 'แก้ไข'}บัญชีรับเงินร้านค้า</h5>
						<div class="text-secondary mb-2">สำหรับใช้ตรวจสอบสลิปโอนเงิน</div>
						<div class="row">
							<div class="col-6 px-1">
								<div
									class="card p-2 {selectType === 'bank'
										? 'border-2 bg-slate-100 border-primary'
										: 'border border-secondary'}"
									style="height:110px"
									on:click={() => {
										selectType = 'bank';
										accountType = '';
									}}
								>
									<div class="d-flex justify-content-center">
										<!-- <svg
											xmlns="http://www.w3.org/2000/svg"
											width="60px"
											height="60px"
											viewBox="0 0 24 24"
										>
											<path
												fill="#0066ff"
												d="M11.5 1L2 6v2h19V6m-5 4v7h3v-7M2 22h19v-3H2m8-9v7h3v-7m-9 0v7h3v-7z"
											/>
										</svg> -->
										<svg
											width="60px"
											height="60px"
											viewBox="0 0 37 36"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M8.25 13.5V25.5M15 13.5V25.5M22.5 13.5V25.5M29.25 13.5V25.5M5.25 27.9L5.25 29.1C5.25 29.9401 5.25 30.3601 5.41349 30.681C5.5573 30.9633 5.78677 31.1927 6.06901 31.3365C6.38988 31.5 6.80992 31.5 7.65 31.5H29.85C30.6901 31.5 31.1101 31.5 31.431 31.3365C31.7132 31.1927 31.9427 30.9633 32.0865 30.681C32.25 30.3601 32.25 29.9401 32.25 29.1V27.9C32.25 27.06 32.25 26.6399 32.0865 26.319C31.9427 26.0368 31.7132 25.8073 31.431 25.6635C31.1101 25.5 30.6901 25.5 29.85 25.5H7.65C6.80992 25.5 6.38988 25.5 6.06901 25.6635C5.78677 25.8073 5.5573 26.0368 5.41349 26.319C5.25 26.6399 5.25 27.06 5.25 27.9ZM18.2294 4.61573L7.12937 7.08239C6.45878 7.23141 6.12348 7.30592 5.8732 7.48623C5.65244 7.64528 5.47909 7.86137 5.37172 8.11138C5.25 8.39482 5.25 8.73829 5.25 9.42524L5.25 11.1C5.25 11.9401 5.25 12.3601 5.41349 12.681C5.5573 12.9633 5.78677 13.1927 6.06901 13.3365C6.38988 13.5 6.80992 13.5 7.65 13.5H29.85C30.6901 13.5 31.1101 13.5 31.431 13.3365C31.7132 13.1927 31.9427 12.9633 32.0865 12.681C32.25 12.3601 32.25 11.9401 32.25 11.1V9.42524C32.25 8.73829 32.25 8.39482 32.1283 8.11138C32.0209 7.86137 31.8476 7.64528 31.6268 7.48624C31.3765 7.30592 31.0412 7.23141 30.3706 7.08239L19.2706 4.61573C19.0763 4.57255 18.9792 4.55096 18.881 4.54236C18.7938 4.53471 18.7062 4.53471 18.619 4.54236C18.5208 4.55096 18.4237 4.57255 18.2294 4.61573Z"
												stroke="#1353EC"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
									<div class="text-center">บัญชีธนาคาร</div>
								</div>
							</div>
							<div class="col-6 px-1">
								<div
									class="card p-2 {selectType === 'promptpay'
										? 'border-2 bg-slate-100 border-primary'
										: 'border border-secondary'}"
									style="height:110px"
									on:click={() => {
										selectType = 'promptpay';
										accountType = '';
									}}
								>
									<div class="d-flex justify-content-center" style="height:60px">
										<img
											src={payment}
											width="60"
											height="60"
											alt="พร้อมเพย์"
											style="object-fit:contain"
										/>
									</div>
									<div class="text-center">พร้อมเพย์</div>
								</div>
							</div>
							<div class="col-12 mt-4">
								<div class="w-100">
									<div class="position-relative w-100">
										<div
											class="p-2 border rounded-3 cursor-pointer bg-white d-flex align-items-center justify-content-between {accountTypeError &&
												'border-danger'}"
											on:click={() => (isOpen = !isOpen)}
										>
											{#if accountType}
												<img
													src={(selectType === 'bank' ? listBank : listPromptpay).find(
														(e) => e.value == accountType
													).imageUrl || ''}
													alt={accountType}
													class="w-6 h-6 mr-2"
												/>
												<span
													>{(selectType === 'bank' ? listBank : listPromptpay).find(
														(e) => e.value == accountType
													).label || ''}</span
												>
											{:else}
												<span>{selectType === 'bank' ? 'เลือกธนาคาร' : 'เลือกประเภทพร้อมเพย์'}</span
												>
											{/if}
											<span class="ms-auto text-secondary text-sm mt-1"
												>{#if isOpen}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 512 512"
														width="16"
														height="16"
														><path
															d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
														/></svg
													>
												{:else}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 512 512"
														width="16"
														height="16"
														><path
															d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
														/></svg
													>
												{/if}</span
											>
										</div>
										{#if isOpen}
											<div
												class="position-absolute mt-1 bg-white border rounded-3 w-100 shadow-lg max-h-48 overflow-y-auto z-50"
											>
												{#each selectType === 'bank' ? listBank : listPromptpay as option}
													<div
														class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
														on:click={() => {
															accountType = option.value;
															isOpen = false;
															accountTypeError = '';
														}}
													>
														<img src={option.imageUrl} alt={option.label} class="w-6 h-6 me-2" />
														<span>{option.label}</span>
													</div>
												{/each}
											</div>
										{/if}
									</div>
									{#if accountTypeError}
										<div class="text-danger text-sm mt-1">{accountTypeError}</div>
									{/if}
									<input
										class="form-control mt-3 {accountNoError && 'border-danger'}"
										style="height: 40px;"
										maxlength={selectType === 'promptpay' && accountType === 'NATID' ? 13 :accountType === 'MSISDN' ? 10: 100}
										on:input={(event) => {
											if (event && event.target && accountType !== 'EWALLETID') {
												let inputValue = event.target.value.replace(/[^0-9]/g, '');
												event.target.value = inputValue;
											}
										}}
										on:blur={() => {
											let size = selectType === 'promptpay' && accountType === 'NATID' ? 13 :accountType === 'MSISDN' ? 10: 100;
											if (!accountNo || ((accountType === "NATID" || accountType === "MSISDN") && accountNo.length !== size)) {
												accountNoError =
													'กรุณากรอกเลขบัญชี' +
													(selectType === 'promptpay' ? 'พร้อมเพย์' : 'ธนาคาร');
											} else {
												accountNoError = '';
											}
										}}
										placeholder={selectType === 'bank' ? 'เลขบัญชีธนาคาร' : 'เลขบัญชีพร้อมเพย์'}
										bind:value={accountNo}
									/>
									{#if accountNoError}
										<div class="text-danger text-sm mt-1">{accountNoError}</div>
									{/if}
									<div class="fw-semibold my-3">ชื่อบัญชี ภาษาไทย</div>
									<input
										class="form-control {accountNameTHError && 'border-danger'}"
										on:input={(event) => {
											if (event && event.target) {
												let inputValue = event.target.value.replace(/[^ก-๙\s]/g, '');

												event.target.value = inputValue;
											}
										}}
										on:blur={() => {
											if (!accountNameTH) {
												accountNameTHError = 'กรุณากรอกชื่อบัญชีให้ครบถ้วน';
											} else {
												accountNameTHError = '';
											}
										}}
										maxlength="100"
										placeholder="ชื่อภาษาไทย"
										bind:value={accountNameTH}
									/>
									{#if accountNameTHError}
										<div class="text-danger text-sm mt-1">{accountNameTHError}</div>
									{/if}
									<div class="fw-semibold my-3">ชื่อบัญชี ภาษาอังกฤษ</div>
									<input
										class="form-control {accountNameENError && 'border-danger'}"
										on:input={(event) => {
											if (event && event.target) {
												let inputValue = event.target.value.replace(/[^a-zA-Z ]/g, '');
												event.target.value = inputValue;
											}
										}}
										on:blur={() => {
											if (!accountNameEN) {
												accountNameENError = 'กรุณากรอกชื่อบัญชีให้ครบถ้วน';
											} else {
												accountNameENError = '';
											}
										}}
										maxlength="100"
										placeholder="ชื่อภาษาอังกฤษ"
										bind:value={accountNameEN}
									/>{#if accountNameENError}
										<div class="text-danger text-sm mt-1">{accountNameENError}</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="position-fixed w-100 p-3 bg-white d-flex" style="bottom:0">
				{#if accountId}
					<div class="w-100 pe-1">
						<button
							class="btn bg-outline-secondary text-dark w-100"
							on:click={() => {
								currentStep = 5;
							}}>ย้อนกลับ</button
						>
					</div>
				{/if}
				<div class="w-100 ps-1">
					<button
						type="submit"
						class="w-100 btn text-white {accountType && accountNo && accountNameTH && accountNameEN
							? 'bg-primary'
							: 'bg-secondary'}"
						style="height:40px;"
						on:click={() => {
							accountTypeError = '';
							accountNoError = '';
							accountNameTHError = '';
							accountNameENError = '';

							let size = selectType === 'promptpay' && accountType === 'NATID' ? 13 : accountType === 'MSISDN' ? 10: 100;
							if (!accountType) {
								accountTypeError = 'กรุณาเลือกประเภทบัญชี';
							} else if (!accountNo || ((accountType === "NATID" || accountType === "MSISDN") && accountNo.length !== size)) {
								accountNoError =
									'กรุณากรอกเลขบัญชี' +
									(selectType === 'promptpay' ? 'พร้อมเพย์' : 'ธนาคาร') +
									'ให้ครบถ้วน';
							} else if (!accountNameTH) {
								accountNameTHError = 'กรุณากรอกชื่อบัญชีให้ครบถ้วน';
							} else if (!accountNameEN) {
								accountNameENError = 'กรุณากรอกชื่อบัญชีให้ครบถ้วน';
							} else {
								UpdateStep(4);
							}
						}}>บันทึกข้อมูล</button
					>
				</div>
			</div>
		</div>
	{:else if currentStep === 5}
		<div class="row mx-0 pt-4">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative">
				<h4 class="font-semibold h4 mb-4">สร้างร้านค้าของคุณ</h4>
				<div class="d-flex">
					<div class="w-100 mx-1 text-nowrap text-primary">
						<b class="px-2">1. บัญชีรับเงิน</b>
						<div class="w-100 bg-primary" style="height:3px"></div>
					</div>
					<div class="w-100 mx-1 text-nowrap text-secondary">
						<b class="px-2">2. ร้านค้า</b>
						<div class="w-100 bg-secondary" style="height:3px"></div>
					</div>
					<div class="w-100 mx-1 text-nowrap text-secondary">
						<b class="px-2">3. สาขา</b>
						<div class="w-100 bg-secondary" style="height:3px"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="position-relative w-100">
			<div class="row mx-0">
				<div
					class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative"
					style="height:100%;min-height:100vh;"
				>
					<div class="card px-3 py-4 shadow" style="margin-bottom:100px">
						<h5 class="fw-semibold h5 mb-2">บัญชีรับเงินร้านค้า</h5>
						<div class="text-secondary mb-2">สำหรับใช้ตรวจสอบสลิปโอนเงิน</div>
						{#each listMyBankAccount as item}
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
											class="w-9 h-9 mr-2"
										/>
										<div>
											<div class="text-secondary">บัญชี</div>
											<div class="text-dark fw-semibold">
												{(item.account_type === 'BANK' ? listBank : listPromptpay).find(
													(e) =>
														e.value ==
														(item.account_type === 'BANK' ? item.bank_code : item.prompt_pay_type)
												)?.label || ''}
											</div>
										</div>
									</div>
									<div class="d-flex">
										<div class="pe-1 position-relative">
											<svg
												on:click={() => {
													accountId = item.id;
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
											{#if isOpen && accountId === item.id}
												<div
													class="position-absolute mt-1 bg-white border rounded-3 shadow-lgz-50"
													style="width: 148px; right: 0"
												>
													<div
														class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
														on:click={() => {
															accountId = item.id;
															selectType = item.account_type === 'BANK' ? 'bank' : 'promptpay';
															accountType =
																item.account_type === 'BANK'
																	? item.bank_code
																	: item.prompt_pay_type;
															accountNo = item.account_no;
															accountNameTH = item.name_th;
															accountNameEN = item.name_en;
															accountActive = item.is_active;
															sessionStorage.setItem('accountId', accountId);
															currentStep = 4;
															isOpen = false;
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
																	accountId = item.id;
																	DeleteBank();
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
										<Switch
											bind:checked={item.is_active}
											on:change={(e) => {
												item.is_active = e.target.checked;
											}}
										/>
									</div>
								</div>
								<div>{item.name_th}</div>
								<div>{item.account_no}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="position-fixed w-100 p-3 bg-white" style="bottom:0">
				<div class="row">
					<div class="col-6 px-1">
						<button
							class="btn btn-outline-secondary w-100"
							on:click={() => {
								accountId = '';
								selectType = 'bank';
								accountType = '';
								accountNo = '';
								accountNameTH = '';
								accountNameEN = '';
								accountActive = true;
								sessionStorage.removeItem('accountId');
								UpdateStep(3);
							}}>เพิ่มบัญชี</button
						>
					</div>
					<div class="col-6 px-1">
						<button
							class="btn {listMyBankAccount.length != 0
								? 'bg-primary'
								: 'bg-secondary'} text-white w-100"
							on:click={() => {
								if (listMyBankAccount.length != 0) {
									UpdateStep(5);
								} else {
									Swal.fire({
										width: '26em',
										imageUrl:
											'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
										imageWidth: 72,
										imageHeight: 72,
										imageAlt: 'Custom image',
										showCloseButton: true,
										title: 'กรุณาตรวจสอบข้อมูล',
										text: 'กรุณาเพิ่มบัญชีรับเงินร้านค้าอย่างน้อย 1 บัญชี',
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
							}}>ถัดไป</button
						>
					</div>
				</div>
			</div>
		</div>
	{:else if currentStep === 6}
		<div class="row mx-0 pt-4">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative">
				<h4 class="font-semibold h4 mb-4">สร้างร้านค้าของคุณ</h4>
				<div class="d-flex">
					<div class="w-100 mx-1 text-nowrap text-primary">
						<b class="px-2">1. บัญชีรับเงิน</b>
						<div class="w-100 bg-primary" style="height:3px"></div>
					</div>
					<div class="w-100 mx-1 text-nowrap text-primary">
						<b class="px-2">2. ร้านค้า</b>
						<div class="w-100 bg-primary" style="height:3px"></div>
					</div>
					<div class="w-100 mx-1 text-nowrap text-secondary">
						<b class="px-2">3. สาขา</b>
						<div class="w-100 bg-secondary" style="height:3px"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="position-relative w-100">
			<div class="row mx-0">
				<div
					class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative"
					style="height:100%;min-height:100vh;"
				>
					<div class="card px-3 py-4 shadow" style="margin-bottom:100px">
						<h5 class="fw-semibold h5 mb-2">ข้อมูลร้านค้า</h5>
						<div class="text-secondary mb-2">บอกเราเกี่ยวกับร้านค้าของคุณ</div>
						<div class="d-flex align-items-start">
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
							<div class="ps-2 w-100">
								<input
									class="form-control {storeNameError && 'border-danger'}"
									placeholder="ชื่อร้านค้า"
									bind:value={storeName}
									on:blur={() => {
										if (!storeName) {
											storeNameError = 'กรุณากรอกชื่อร้านค้า';
										} else {
											storeNameError = '';
										}
									}}
								/>{#if storeNameError}
									<div class="text-danger text-sm mt-1">{storeNameError}</div>
								{/if}
							</div>
						</div>
						<select
							class="form-select mt-3 {storeTypeError && 'border-danger'}"
							on:change={(e) => {
								storeType = e.target.value;
							}}
							bind:value={storeType}
						>
							<option value="">เลือกประเภทธุรกิจ</option>
							{#each listCategory as item}
								<option value={item.category_name_th}>{item.category_name_th}</option>
							{/each}
						</select>
						{#if storeTypeError}
							<div class="text-danger text-sm mt-1">{storeTypeError}</div>
						{/if}
						<input
							class="form-control mt-3 {storePhoneError && 'border-danger'}"
							placeholder="เบอร์โทรศัพท์"
							bind:value={storePhone}
							on:input={(event) => {
								if (event && event.target) {
									let inputValue = event.target.value.replace(/[^0-9]/g, '').slice(0, 10);
									event.target.value = inputValue;
								}
							}}
							on:blur={() => {
								if (!storePhone || storePhone.length < 10) {
									storePhoneError = 'กรุณากรอกเบอร์โทรศัพท์';
								} else {
									storePhoneError = '';
								}
							}}
						/>{#if storePhoneError}
							<div class="text-danger text-sm mt-1">{storePhoneError}</div>
						{/if}
						<input
							class="form-control mt-3 {storeEmailError && 'border-danger'}"
							placeholder="อีเมล"
							bind:value={storeEmail}
							on:blur={() => {
								const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ตรวจสอบรูปแบบอีเมล
								if (!storeEmail) {
									storeEmailError = 'กรุณากรอกอีเมล';
								} else if (!emailRegex.test(storeEmail)) {
									storeEmailError = 'กรุณากรอกอีเมลให้ถูกต้อง';
								} else {
									storeEmailError = '';
								}
							}}
						/>{#if storeEmailError}
							<div class="text-danger text-sm mt-1">{storeEmailError}</div>
						{/if}
					</div>
				</div>
			</div>
			<div class="position-fixed w-100 p-3 bg-white" style="bottom:0">
				<button
					class="btn text-white w-100 {storeName && storePhone && storeEmail
						? 'bg-primary'
						: 'bg-secondary'}"
					on:click={() => {
						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ตรวจสอบรูปแบบอีเมล
						storeNameError = '';
						storeTypeError = '';
						storePhoneError = '';
						storeEmailError = '';
						if (!storeName) {
							storeNameError = 'กรุณากรอกชื่อร้านค้า';
						} else if (!storeType) {
							storeTypeError = 'กรุณาเลือกประเภทธุรกิจ';
						} else if (!storePhone || storePhone.length < 10) {
							storePhoneError = 'กรุณากรอกเบอร์โทรศัพท์';
						} else if (!storeEmail) {
							storeEmailError = 'กรุณากรอกอีเมล';
						} else if (!emailRegex.test(storeEmail)) {
							storeEmailError = 'กรุณากรอกอีเมลให้ถูกต้อง';
						} else {
							UpdateStep(6);
						}
					}}>ถัดไป</button
				>
			</div>
		</div>
	{:else if currentStep === 7}
		<div class="row mx-0 pt-4">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative">
				<h4 class="font-semibold h4 mb-4">สร้างร้านค้าของคุณ</h4>
				<div class="d-flex">
					<div class="w-100 mx-1 text-nowrap text-primary">
						<b class="px-2">1. บัญชีรับเงิน</b>
						<div class="w-100 bg-primary" style="height:3px"></div>
					</div>
					<div class="w-100 mx-1 text-nowrap text-primary">
						<b class="px-2">2. ร้านค้า</b>
						<div class="w-100 bg-primary" style="height:3px"></div>
					</div>
					<div class="w-100 mx-1 text-nowrap text-primary">
						<b class="px-2">3. สาขา</b>
						<div class="w-100 bg-primary" style="height:3px"></div>
					</div>
				</div>
			</div>
		</div>
		{#if stepRoom === 'list'}
			<div class="position-relative w-100 min-vh-100">
				<div class="row mx-0">
					<div
						class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative"
						style="height:100%;min-height:100vh;"
					>
						<div class="card px-3 py-4 shadow" style="margin-bottom:100px">
							<h5 class="fw-semibold h5 mb-2">สาขาร้านค้า</h5>
							<div class="text-secondary mb-2">เชื่อมต่อสาขากับ LINE Group เพื่อตรวจสลิป</div>
							{#each listRoom as item}
								<div class="card p-3 mb-3 position-relative">
									<div
										class="d-flex justify-content-between mb-2 cursor-pointer"
										on:click={() => {
											stepRoom = '';
											roomId = item.id;
											listBankRoom = JSON.parse(item.list_bank) || [];
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
												<h6 class="fw-semibold h6 mb-1">{item.room_name}</h6>
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
															isOpen = false;
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
																	is_active:
																		item.list_bank && JSON.parse(item.list_bank).includes(e.id)
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
						class="btn bg-white w-100"
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
								stroke="#344054"
								stroke-width="1.66667"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>

						เพิ่มสาขา</button
					>
				</div>
			</div>
		{:else if stepRoom === 'create'}
			<div class="position-relative w-100">
				<div class="row mx-0">
					<div
						class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative"
						style="height:100%;min-height:100vh;"
					>
						<div class="card px-3 py-4 shadow" style="margin-bottom:100px">
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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
											width="16"
											height="16"
											><path
												d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
											/></svg
										>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
											width="16"
											height="16"
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
					{#if listRoom.length > 1}
						<div class="w-100 pe-1">
							<button
								class="btn bg-outline-secondary text-dark w-100"
								on:click={() => {
									stepRoom = 'list';
								}}>ย้อนกลับ</button
							>
						</div>
					{/if}
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
		{:else if stepRoom === 'update'}
			<div class="position-relative w-100">
				<div class="row mx-0">
					<div
						class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative"
						style="height:100%;min-height:100vh;"
					>
						<div class="card px-3 py-4 shadow" style="margin-bottom:100px">
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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
											width="16"
											height="16"
											><path
												d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
											/></svg
										>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
											width="16"
											height="16"
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
				<div class="position-fixed w-100 p-3 bg-white d-flex" style="bottom:0">
					<div class="w-50 pe-1">
						<button
							class="btn bg-outline-secondary text-dark w-100"
							on:click={() => {
								stepRoom = 'list';
							}}>ย้อนกลับ</button
						>
					</div>
					<div class="w-50 ps-1">
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
		{:else}
			<div class="position-relative w-100">
				<div class="row mx-0">
					<div
						class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative"
						style="height:100%;min-height:100vh;"
					>
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
									<input
										class="form-control"
										style="padding-right:110px"
										bind:value={roomVerifyCode}
										readonly
									/>
									<button
										class="btn bg-primary text-white position-absolute end-0 top-0 rounded-start-0"
										on:click={() => CopyCodeToClipboard(roomVerifyCode)}
									>
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
										คัดลอก</button
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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
											width="16"
											height="16"
											><path
												d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
											/></svg
										>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
											width="16"
											height="16"
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
						{#if listRoom.length <= 1}
							<button
								class="btn bg-white w-100 mt-4"
								style="margin-bottom:200px"
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
										stroke="#344054"
										stroke-width="1.66667"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>

								เพิ่มสาขา</button
							>
						{/if}
					</div>
				</div>
				<div class="position-fixed d-flex w-100 p-3 bg-white" style="bottom:0">
					{#if listRoom.length > 1}
						<div class="w-100 pe-1">
							<button
								class="btn bg-outline-secondary text-dark w-100"
								on:click={() => {
									stepRoom = 'list';
								}}>ย้อนกลับ</button
							>
						</div>
					{/if}
					<div class="w-100 ps-1">
						<button class="btn bg-primary text-white w-100" on:click={() => openLineGroupCreation()}
							>สร้าง LINE Group</button
						>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

{#if loading}
	<div
		class="d-flex min-vh-100 w-100 justify-content-center align-items-center position-fixed z-50 top-0 start-0"
		style="background-color:#ffffffdd"
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
