import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import { BACKEND_API_KEY } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export type PackageData = {
  Id?: number;
  Name: string;
  Price: number;
  QuotaLimit?: number;
  Status: string;
  TotalCount: number;
  Visibility: boolean;
  AmountLimit: number;
  Index: number;
  DaysDueDuration: number;
};

// ฟังก์ชันดึงข้อมูลแพ็กเกจ
export async function load({ fetch }: RequestEvent) {
  try {
    const res = await fetch(`${PUBLIC_API_ENDPOINT}/package/get`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: BACKEND_API_KEY
      }
    });

    if (!res.ok) {
      throw new Error('Error fetching data from API');
    }

    const data = await res.json();
    
    // ตรวจสอบการตอบกลับจาก API
    if (!data || !data.data) {
      throw new Error('Invalid data received');
    }

    const listPackages: PackageData[] = (data?.data ?? []).map((item: any) => ({
      Id: item.Id,
      Name: item.Name,
      Price: item.Price,
      QuotaLimit: item.QuotaLimit,
      Status: item.Status,
      TotalCount: item.TotalCount,
      Visibility: item.Visibility,
      AmountLimit: item.AmountLimit,
      Index: item.Index,
      DaysDueDuration: item.DaysDueDuration
    }));

    return { listPackages };
  } catch (err) {
    console.error(err);
    throw error(500, 'Server Error');
  }
}

// ฟังก์ชันสำหรับการสร้างหรืออัปเดตแพ็กเกจ
export const actions = {
  createOrUpdate: async ({ request }: RequestEvent) => {
    const formData = await request.formData();

    const payload = {
      id: formData.get('id') || null,
      package_name: formData.get('package_name'),
      package_price: formData.get('package_price'),
      quota_limit: formData.get('quota_limit'),
      amount: formData.get('amount'),
      duration: formData.get('duration'),
      is_active: formData.get('is_active') === 'on' ? 1 : 0
    };

    try {
      const res = await fetch(`${PUBLIC_API_ENDPOINT}/package/${payload.id ? 'update' : 'create'}`, {
        method: payload.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: BACKEND_API_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to create or update package');
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'เกิดข้อผิดพลาด' };
    }
  }
};
