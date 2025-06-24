<script lang="ts">
	import payment from '$lib/image/thai-qr.png';
	import Swal from 'sweetalert2';
	import Switch from '$lib/components/ui/switch/Switch2.svelte';
	import {
		PUBLIC_API_ENDPOINT,
		PUBLIC_SECRETKEY,
		PUBLIC_BACKEND_API_KEY,
		PUBLIC_PAYSO_DEFAULT_SECRET
	} from '$env/static/public';
	import cookie from 'cookie';

	import { onMount } from 'svelte';
let loading = true;
	let profile: { id: any; } | null = null;

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

	let step: string = 'list';
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

	let listMyBankAccount: any[] = [];

	onMount(async () => {
		profile = localStorage.getItem('profile')
			? JSON.parse(localStorage.getItem('profile') || '')
			: null;
		GetBank();
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
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/bank2/get/${profile?.id ||""}`, config);
		const data = await result.json();
		for (let item of data?.data || []) {
			item.account_no = await DecryptAccountNo(item.account_no);
		}
		listMyBankAccount = data?.data || [];
	}

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
					user_id: profile?.id || "",
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
					imageUrl: 'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
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
				}).then(()=>{
				window.location.reload();
				});
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
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
					imageUrl: 'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
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
				}).then(()=>{
				window.location.reload();
				});
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	}

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
					imageUrl: 'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
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
				})
				GetBank();
			}
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
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
</script>
{#if !loading}
{#if step === 'create-update'}
	<div class="position-relative w-100">
		<div class="row mx-0">
			<div class="col-12 col-md-8 col-lg-6 mx-auto p-3 position-relative">
				<h5 class="fw-semibold h5 mb-2">{accountId && 'แก้ไข'}บัญชีรับเงินร้านค้า</h5>
				<div class="text-secondary mb-2">สำหรับใช้ตรวจสอบสลิปโอนเงิน</div>
				<div class="card px-3 py-4 shadow" style="margin-bottom:100px">
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
									<svg width="60px" height="60px" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M8.25 13.5V25.5M15 13.5V25.5M22.5 13.5V25.5M29.25 13.5V25.5M5.25 27.9L5.25 29.1C5.25 29.9401 5.25 30.3601 5.41349 30.681C5.5573 30.9633 5.78677 31.1927 6.06901 31.3365C6.38988 31.5 6.80992 31.5 7.65 31.5H29.85C30.6901 31.5 31.1101 31.5 31.431 31.3365C31.7132 31.1927 31.9427 30.9633 32.0865 30.681C32.25 30.3601 32.25 29.9401 32.25 29.1V27.9C32.25 27.06 32.25 26.6399 32.0865 26.319C31.9427 26.0368 31.7132 25.8073 31.431 25.6635C31.1101 25.5 30.6901 25.5 29.85 25.5H7.65C6.80992 25.5 6.38988 25.5 6.06901 25.6635C5.78677 25.8073 5.5573 26.0368 5.41349 26.319C5.25 26.6399 5.25 27.06 5.25 27.9ZM18.2294 4.61573L7.12937 7.08239C6.45878 7.23141 6.12348 7.30592 5.8732 7.48623C5.65244 7.64528 5.47909 7.86137 5.37172 8.11138C5.25 8.39482 5.25 8.73829 5.25 9.42524L5.25 11.1C5.25 11.9401 5.25 12.3601 5.41349 12.681C5.5573 12.9633 5.78677 13.1927 6.06901 13.3365C6.38988 13.5 6.80992 13.5 7.65 13.5H29.85C30.6901 13.5 31.1101 13.5 31.431 13.3365C31.7132 13.1927 31.9427 12.9633 32.0865 12.681C32.25 12.3601 32.25 11.9401 32.25 11.1V9.42524C32.25 8.73829 32.25 8.39482 32.1283 8.11138C32.0209 7.86137 31.8476 7.64528 31.6268 7.48624C31.3765 7.30592 31.0412 7.23141 30.3706 7.08239L19.2706 4.61573C19.0763 4.57255 18.9792 4.55096 18.881 4.54236C18.7938 4.53471 18.7062 4.53471 18.619 4.54236C18.5208 4.55096 18.4237 4.57255 18.2294 4.61573Z" stroke="#1353EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
											<span>{selectType === 'bank' ? 'เลือกธนาคาร' : 'เลือกประเภทพร้อมเพย์'}</span>
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
									maxlength="{selectType === 'promptpay' && accountType === 'NATID' ? 13 :accountType === 'MSISDN' ? 10: 100}"
									on:input={(event) => {
										if (event && event.target && accountType !== 'EWALLETID') {
											let inputValue = event.target.value.replace(/[^0-9]/g, '');
											event.target.value = inputValue; 
										}
									}}
									on:blur={() => {
										let size = selectType === 'promptpay' && accountType === 'NATID' ? 13 : accountType === 'MSISDN' ? 10: 100;
										 if (!accountNo || ((accountType === "NATID" || accountType === "MSISDN") && accountNo.length !== size)) {
						
											accountNoError =
												'กรุณากรอกเลขบัญชี' + (selectType === 'promptpay' ? 'พร้อมเพย์' : 'ธนาคาร');
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
		<div class="position-fixed w-100 p-3 bg-white" style="bottom:0">
			<button
				type="submit"
				class="w-100 btn text-white {accountType && accountNo && accountNameTH && accountNameEN
					? 'bg-primary'
					: 'bg-secondary'}"
				style="height:40px;"
				on:click={async() => {
					accountTypeError = '';
					accountNoError = '';
					accountNameTHError = '';
					accountNameENError = '';

					let size = selectType === 'promptpay' && accountType === 'NATID' ? 13 :accountType === 'MSISDN' ? 10: 100;
					if (!accountType) {
						accountTypeError = 'กรุณาเลือกประเภทบัญชี';
					} else if (!accountNo || ((accountType === "NATID" || accountType === "MSISDN") && accountNo.length !== size)) {
						accountNoError =
							'กรุณากรอกเลขบัญชี' + (selectType === 'promptpay' ? 'พร้อมเพย์' : 'ธนาคาร') + 'ให้ครบถ้วน';
					} else if (!accountNameTH) {
						accountNameTHError = 'กรุณากรอกชื่อบัญชีให้ครบถ้วน';
					} else if (!accountNameEN) {
						accountNameENError = 'กรุณากรอกชื่อบัญชีให้ครบถ้วน';
					} else {
						if(accountId){
							await UpdateBank();
						}else{
							await CreateBank();
						}
						GetBank();
						step = "list"
					}
				}}>บันทึกข้อมูล</button
			>
		</div>
	</div>
{:else if step === 'list'}
	<div class="position-relative w-100">
		<div class="row mx-0">
			<div class="col-12 col-md-8 col-lg-6 mx-auto px-3 pt-3 position-relative" style="min-height:100vh;padding-bottom:100px;">
				<h5 class="fw-semibold h5 mb-2">บัญชีรับเงินร้านค้า</h5>
				<div class="text-secondary mb-2">สำหรับใช้ตรวจสอบสลิปโอนเงิน</div>
				<div class="card px-3 py-4 shadow mb-5">
					{#each listMyBankAccount as item}
						<div class="card p-3 mb-3">
							<div class="d-flex justify-content-between mb-2">
								<div class="d-flex">
									<img
										src={(item.account_type === 'BANK' ? listBank : listPromptpay).find(
											(e) => e.value == (item.account_type === 'BANK' ? item.bank_code : item.prompt_pay_type)
										)?.imageUrl || ''}
										alt={item.account_type}
										class="w-9 h-9 mr-2"
									/>
									<div>
										<div class="text-secondary">บัญชี</div>
										<div class="text-dark fw-semibold">
											
											{(item.account_type === 'BANK' ? listBank : listPromptpay).find(
												(e) =>
													e.value == (item.account_type === 'BANK' ? item.bank_code : item.prompt_pay_type)
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
														accountType = item.account_type === 'BANK' ? item.bank_code : item.prompt_pay_type;
														accountNo = item.account_no;
														accountNameTH = item.name_th;
														accountNameEN = item.name_en;
														accountActive = item.is_active;
														sessionStorage.setItem('accountId', accountId);
														step = 'create-update';
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
			<button
				class="btn bg-primary text-white w-100"
				on:click={() => {
					accountId = '';
					selectType = 'bank';
					accountType = '';
					accountNo = '';
					accountNameTH = '';
					accountNameEN = '';
					accountActive = true;
					sessionStorage.removeItem('accountId');
					step = 'create-update';
				}}>เพิ่มบัญชี</button
			>
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