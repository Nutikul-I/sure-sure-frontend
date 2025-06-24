<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import { getAuth } from 'firebase/auth';
	import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY } from '$env/static/public';
	import './bootstrap.css';
	import './styles.css';
	import '../app.postcss';
	import Swal from 'sweetalert2';

	import { beforeNavigate, afterNavigate } from '$app/navigation';

	let loading = false;
	let profile: { step: number; token: string } | null = null; // กำหนดประเภทให้กับ `profile`

	beforeNavigate(async (nav) => {
		loading = true;
	});

	afterNavigate(async (nav) => {
		const redirect_page = nav.to?.url.searchParams.get("liff.state");
		if(redirect_page){
			localStorage.setItem("redirect_page",redirect_page)
		} 
		try {
			if (nav.to?.url.pathname !== '/report') {
				// ตรวจสอบและดึงข้อมูลโปรไฟล์จาก sessionStorage
				const profileData = localStorage.getItem('profile');
				profile = profileData ? JSON.parse(profileData) : null;
				// ตรวจสอบเงื่อนไขการเปลี่ยนเส้นทาง
				if (profile) {
					await getToken(); 
					if (profile?.user_type === 'merchant') {
						if (nav.to?.url.pathname.includes('/admin')) {
							if (profile.step < 8) {
								window.location.href = '/advice';
								return
							}
							if (profile.step === 99) {
								const redirect_ = localStorage.getItem("redirect_page");
								if (redirect_ === "/profile" || redirect_ === "/package") {
									localStorage.removeItem("redirect_page") 
									window.location.href = redirect_;
									return
								}
								window.location.href = '/dashboard';
								return
							}
						}
						if (nav.to?.url.pathname !== '/advice' && nav.to?.url.pathname !== '/') {
							if (profile.step < 8) {
								window.location.href = '/advice';
								return
							}
						} else if (nav.to?.url.pathname === '/advice' || nav.to?.url.pathname === '/') {
							if (profile.step === 99) {
								const redirect_ = localStorage.getItem("redirect_page");
								if (redirect_ === "/profile" || redirect_ === "/package") {
									localStorage.removeItem("redirect_page") 
									window.location.href = redirect_;
									return
								}
								window.location.href = '/dashboard';
								return
							}else {
								return
							}
						} 
					} else if (profile?.user_type === 'merchant-register') {
						if (nav.to?.url.pathname !== '/advice') {
							if (profile.step < 4) {
								window.location.href = '/advice';
								return
							}
						}
						if (nav.to?.url.pathname === '/advice' || nav.to?.url.pathname === '/') {
							if (profile.step === 99) {
								window.location.href = '/dashboard';
								return
							}
						}
						if (nav.to?.url.pathname.includes('/admin')) {
							if (profile.step < 4) {
								window.location.href = '/advice';
								return
							}
							if (profile.step === 99) {
								window.location.href = '/dashboard';
								return
							}
						}
					} else if (profile?.user_type === 'admin') {
						if (!nav.to?.url.pathname.includes('/admin')) {
							window.location.href = '/admin/dashboard';
							return
						}
					}
				} else if (
					nav.to?.url.pathname !== '/' &&
					nav.to?.url.pathname !== '/login-admin' &&
					nav.to?.url.pathname !== '/login'
				) {
					handleTokenExpired();
				}
			}
		} catch (error) {
			console.error('Error in beforeNavigate:', error);
			if (
				nav.to?.url.pathname !== '/' &&
				nav.to?.url.pathname !== '/login-admin' &&
				nav.to?.url.pathname !== '/login'
			) {
				handleTokenExpired();
			}
		}
		loading = false;
	});

	async function getToken() {
		let config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/user/get/${profile.uid}`, config);
		const data = await result.json();
		if (!data.data) {
			handleTokenExpired();
			return;
		}
	}

	// ฟังก์ชันสำหรับจัดการกรณีโทเค็นหมดอายุ
	function handleTokenExpired() {
		localStorage.removeItem('profile');
		window.location.href = '/';
		return
	}
</script>

<div>
	{#if !loading}
		<slot></slot>
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
		</div>
	{/if}
</div>
