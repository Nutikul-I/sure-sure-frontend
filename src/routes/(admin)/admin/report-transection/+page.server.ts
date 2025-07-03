import type { PageServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const startDate = url.searchParams.get('startDate') ?? '';
    const endDate = url.searchParams.get('endDate') ?? '';
    const name_th = url.searchParams.get('name_th') ?? '';
    const status = url.searchParams.get('status') ?? '';

    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            apikey: PUBLIC_BACKEND_API_KEY
        }
    };

    const [transactionRes, userRes] = await Promise.all([
        fetch(`${PUBLIC_API_ENDPOINT}/transaction/get`, config),
        fetch(`${PUBLIC_API_ENDPOINT}/user/get`, config)
    ]);
    const [transactionData, userData] = await Promise.all([
        transactionRes.json(),
        userRes.json()
    ]);

    let listTransaction = transactionData?.data ?? [];
    if (name_th) listTransaction = listTransaction.filter((e: any) => e.name_th?.includes(name_th));
    if (status) listTransaction = listTransaction.filter((e: any) => e.status === status);
    if (startDate) listTransaction = listTransaction.filter((e: any) => new Date(e.created_date) >= new Date(`${startDate}T00:00:00.000Z`));
    if (endDate) listTransaction = listTransaction.filter((e: any) => new Date(e.created_date) <= new Date(`${endDate}T23:59:59.000Z`));

    return {
        listTransaction,
        listUser: userData?.data ?? [],
        startDate,
        endDate,
        name_th,
        status
    };
};