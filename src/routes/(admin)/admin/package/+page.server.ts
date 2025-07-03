import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY } from "$env/static/public";
import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";

// Type สำหรับ Package Data (ใช้ int ตลอด)
export type PackageData = {
    id: number;    
	package_name: string;      
	package_price: number;     
	quota_limit: number;  
	amount: number;
	ordered?: number;
	duration: number;
	is_active: number; // 1 : active, 0 : inactive
	created_date?: string;
	updated_date?: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            apikey: PUBLIC_BACKEND_API_KEY
        }
    };
	
	try {
		// Call api
		const response = await fetch(`${PUBLIC_API_ENDPOINT}/package/get`, config);
		//แปลงเป็น json
		const data = await response.json();
		
		return {
			//retrun to client
			packages: data.data || []
		};
	} catch (error) {
		console.error('Error fetching package data:', error);
		return {
			packages: []
		};
	}
};

export const actions: Actions = {
	createUpdate: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const package_name = formData.get('package_name') as string;
		const package_price = formData.get('package_price') as string;
		const quota_limit = formData.get('quota_limit') as string;
		const amount = formData.get('amount') as string;
		const duration = formData.get('duration') as string;
		const is_active = formData.get('is_active') === 'true' ? 1 : 0;

		// Validation
		if (!package_name || !package_price || !quota_limit || !amount || !duration) {
			return fail(400, { 
				message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
				type: 'error'
			});
		}

		// กำหนด isUpdate และ packageId ให้ชัดเจน
		const isUpdate = id && id.trim() !== '';
		const packageId = isUpdate ? Number(id) : null;

		try {
			const response = await fetch(`${PUBLIC_API_ENDPOINT}/package/${isUpdate ? 'update' : 'create'}`, {
				method: isUpdate ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
					'ngrok-skip-browser-warning': 'true',
					apikey: PUBLIC_BACKEND_API_KEY
				},
				body: JSON.stringify({
					id: packageId,
					package_name: package_name,
					package_price: Number(package_price),
					quota_limit: Number(quota_limit),
					amount: Number(amount),
					duration: Number(duration),
					is_active: is_active
				})
			});

			if (response.ok) {
				return {
					message: `${isUpdate ? 'แก้ไข' : 'เพิ่ม'}แพ็กเกจสำเร็จ`,
					type: 'success'
				};
			} else {
				const errorData = await response.json();
				return fail(400, { 
					message: errorData.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
					type: 'error'
				});
			}
		} catch (error) {
			console.error('Error:', error);
			return fail(500, { 
				message: 'เกิดข้อผิดพลาดในระบบ',
				type: 'error'
			});
		}
	}
};

