<script lang="ts">
	import { onMount } from 'svelte';
	import paysoLogo from '$lib/image/SURE2copy.jpg';
	import Swal from 'sweetalert2';
	import {
		PUBLIC_API_ENDPOINT,
		PUBLIC_BACKEND_API_KEY,
		PUBLIC_DOMAIN,
		PUBLIC_LINE_CLIENT_ID,
		PUBLIC_LINE_CLIENT_SECRET
	} from '$env/static/public';

	let loading = true;
	const redirectToLineLogin = () => {
		window.location.replace(
			`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${PUBLIC_LINE_CLIENT_ID}&redirect_uri=${PUBLIC_DOMAIN}&state=sure-sure-login&scope=openid%20profile%20real_name%20gender%20birthdate%20phone%20address%20email`
		);
	};

	onMount(async () => {
		var status = 0;
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const returnedState = urlParams.get('state');
		const redirect_page = urlParams.get('liff.state');
		if (redirect_page) {
			localStorage.setItem('redirect_page', redirect_page);
		} else {
			localStorage.removeItem('redirect_page');
		}

		if (code) {
			try {
				status = 1;
				// เชื่อมต่อ LINE
				const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: new URLSearchParams({
						grant_type: 'authorization_code',
						code: code,
						redirect_uri: PUBLIC_DOMAIN,
						client_id: PUBLIC_LINE_CLIENT_ID,
						client_secret: PUBLIC_LINE_CLIENT_SECRET
					})
				});
				const tokenData = await tokenResponse.json();

				status = 2;
				const profileResponse = await fetch('https://api.line.me/v2/profile', {
					headers: { Authorization: `Bearer ${tokenData.access_token}` }
				});
				const profileData = await profileResponse.json();

				status = 3;
				const parts = tokenData?.id_token ? tokenData?.id_token?.split('.') : [];
				status = 4;
				var decodedPayload = null;
				try{
					decodedPayload = parts && parts[1] ? JSON.parse(atob(parts[1])) : null;
				}catch(e){
					console.log(e);
				}
				status = 5;
				if (profileData.message === 'invalid token') {
					// loading = false;
					return Swal.fire({
						width: '26em',
						imageUrl: 'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
						imageWidth: 72,
						imageHeight: 72,
						imageAlt: 'Custom image',
						showCloseButton: true,
						title: 'เกิดข้อผิดพลาด',
						text: 'กรุณาลองใหม่อีกครั้ง 1',
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
						window.location.href = '/';
					});
				}
				// Login Merchant
				if (returnedState === 'sure-sure-login') {
					if (profileData.userId) {
						try {
							status = 6;
							const config: RequestInit = {
								method: 'POST',
								headers: { 'Content-Type': 'application/json', apikey: PUBLIC_BACKEND_API_KEY },
								body: JSON.stringify({
									user_type: 'merchant',
									name_th: profileData.displayName,
									name_en: profileData.displayName,
									user_role: 'merchant',
									picture: profileData.pictureUrl,
									username: profileData.userId,
									password: profileData.userId,
									email: decodedPayload?.email || ''
								})
							};
							const datalogin = await fetch(`${PUBLIC_API_ENDPOINT}/login`, config)
								.then((response) => response.json())
								.catch((error) => console.error(error));

							status = 7;
							if (datalogin?.data) {
								localStorage.setItem('profile', JSON.stringify(datalogin.data));
								status = 8;
								if (datalogin?.data?.step < 10) {
									status = 9;
									window.location.href = `/advice?step=${datalogin.data.step}`;
									return;
								} else {
									status = 10;
									const redirect_ = localStorage.getItem('redirect_page');
									if (redirect_ === '/profile' || redirect_ === '/package') {
										localStorage.removeItem('redirect_page');
										window.location.href = redirect_;
										return;
									} else {
										window.location.href = '/dashboard';
										return;
									}
								}
							} else {
								// loading = false;
								return Swal.fire({
									width: '26em',
									imageUrl: 'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
									imageWidth: 72,
									imageHeight: 72,
									imageAlt: 'Custom image',
									showCloseButton: true,
									title: 'เกิดข้อผิดพลาด',
									text: 'กรุณาลองใหม่อีกครั้ง 2',
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
									window.location.href = '/';
								});
							}
						} catch (e) {
							// loading = false;
							return Swal.fire({
								width: '26em',
								imageUrl: 'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
								imageWidth: 72,
								imageHeight: 72,
								imageAlt: 'Custom image',
								showCloseButton: true,
								title: 'เกิดข้อผิดพลาด',
								text: 'กรุณาลองใหม่อีกครั้ง 3 STATUS: '+ status + ' : ' + e,
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
								window.location.href = '/';
							});
						}
					}
				}
			} catch (error) {
				// loading = false;
				return Swal.fire({
					width: '26em',
					imageUrl: 'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'เกิดข้อผิดพลาด',
					text: 'กรุณาลองใหม่อีกครั้ง 4 STATUS: '+ status + ' : ' + error,
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
					window.location.href = '/';
				});
			}
		} else {
			redirectToLineLogin();
		}
	});
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
					<button
						class="btn btn-success text-white w-100 mb-3 d-flex align-items-between py-0 px-1"
						type="button"
						on:click={redirectToLineLogin}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="36"
							height="36"
							viewBox="0 0 48 48"
							class="me-2"
						>
							<path
								fill="#00c300"
								d="M12.5,42h23c3.59,0,6.5-2.91,6.5-6.5v-23C42,8.91,39.09,6,35.5,6h-23C8.91,6,6,8.91,6,12.5v23C6,39.09,8.91,42,12.5,42z"
							></path>
							<path
								fill="#fff"
								d="M37.113,22.417c0-5.865-5.88-10.637-13.107-10.637s-13.108,4.772-13.108,10.637c0,5.258,4.663,9.662,10.962,10.495c0.427,0.092,1.008,0.282,1.155,0.646c0.132,0.331,0.086,0.85,0.042,1.185c0,0-0.153,0.925-0.187,1.122c-0.057,0.331-0.263,1.296,1.135,0.707c1.399-0.589,7.548-4.445,10.298-7.611h-0.001C36.203,26.879,37.113,24.764,37.113,22.417z M18.875,25.907h-2.604c-0.379,0-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687c0.379,0,0.687,0.308,0.687,0.687v4.521h1.917c0.379,0,0.687,0.308,0.687,0.687C19.562,25.598,19.254,25.907,18.875,25.907z M21.568,25.219c0,0.379-0.308,0.688-0.687,0.688s-0.687-0.308-0.687-0.688V20.01c0-0.379,0.308-0.687,0.687-0.687s0.687,0.308,0.687,0.687V25.219z M27.838,25.219c0,0.297-0.188,0.559-0.47,0.652c-0.071,0.024-0.145,0.036-0.218,0.036c-0.215,0-0.42-0.103-0.549-0.275l-2.669-3.635v3.222c0,0.379-0.308,0.688-0.688,0.688c-0.379,0-0.688-0.308-0.688-0.688V20.01c0-0.296,0.189-0.558,0.47-0.652c0.071-0.024,0.144-0.035,0.218-0.035c0.214,0,0.42,0.103,0.549,0.275l2.67,3.635V20.01c0-0.379,0.309-0.687,0.688-0.687c0.379,0,0.687,0.308,0.687,0.687V25.219z M32.052,21.927c0.379,0,0.688,0.308,0.688,0.688c0,0.379-0.308,0.687-0.688,0.687h-1.917v1.23h1.917c0.379,0,0.688,0.308,0.688,0.687c0,0.379-0.309,0.688-0.688,0.688h-2.604c-0.378,0-0.687-0.308-0.687-0.688v-2.603c0-0.001,0-0.001,0-0.001c0,0,0-0.001,0-0.001v-2.601c0-0.001,0-0.001,0-0.002c0-0.379,0.308-0.687,0.687-0.687h2.604c0.379,0,0.688,0.308,0.688,0.687s-0.308,0.687-0.688,0.687h-1.917v1.23H32.052z"
							></path>
						</svg>
						<span class="mx-auto">Sign up with Line</span>
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
