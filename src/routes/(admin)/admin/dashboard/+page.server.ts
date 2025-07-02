import type { PageServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
	// สร้าง config สำหรับ API calls
	const config = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'ngrok-skip-browser-warning': 'true',
			apikey: PUBLIC_BACKEND_API_KEY
		}
	};

	try {
		// เรียก APIs พร้อมกันเพื่อความเร็ว
		const [orderResponse, transactionResponse, userResponse, packageResponse] = await Promise.all([
			fetch(`${PUBLIC_API_ENDPOINT}/order-package/get`, config),
			fetch(`${PUBLIC_API_ENDPOINT}/transaction/get`, config),
			fetch(`${PUBLIC_API_ENDPOINT}/user/get`, config),
			fetch(`${PUBLIC_API_ENDPOINT}/package/get`, config)
		]);

		// แปลงเป็น JSON
		const [orderData, transactionData, userData, packageData] = await Promise.all([
			orderResponse.json(),
			transactionResponse.json(),
			userResponse.json(),
			packageResponse.json()
		]);

		// ส่งข้อมูลไปยัง client
		return {
			orders: orderData?.data || [],
			transactions: transactionData?.data || [],
			users: userData?.data?.filter((e: { user_type: string }) => e.user_type !== "admin") || [],
			packages: packageData?.data || []
		};
	} catch (error) {
		console.error('Error loading dashboard data:', error);
		return {
			orders: [],
			transactions: [],
			users: [],
			packages: []
		};
	}
};
