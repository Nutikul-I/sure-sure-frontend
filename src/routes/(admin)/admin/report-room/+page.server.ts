import type { PageServerLoad } from './$types';
import { PUBLIC_API_ENDPOINT, PUBLIC_BACKEND_API_KEY } from '$env/static/public';


export type RoomMerchantData = {
    Id : number ;
	MerchantId : number ;
	MerchantName :string 
	TotalQuotaUsed : number 
	RegisteredAt :string 
	NotiOnValid :string 
	NotiOnInvalid :string 
	NotiOnInvalidReciverBankAccount :string 
	NotiOnInvalidUnverified :string 
	NotiOnInvalidMinAmount :string 
	NotiOnQuotaLimitExceed :string 
	MinAmountReceive : number
	HideSenderDetail :boolean
	HideReciverDetail :boolean
	TransactionSummary :string 
	RoomName :string 
	PackageName :string 
	Index : number 
	TotalCount : number;   

}

export const load: PageServerLoad = async ({ fetch, url }) => {
    const search = url.searchParams.get('search')?.trim() ?? '';

    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            apikey: PUBLIC_BACKEND_API_KEY
        }
    };

    const [roomRes, userRes] = await Promise.all([
        fetch(`${PUBLIC_API_ENDPOINT}/room2/get`, config),
        fetch(`${PUBLIC_API_ENDPOINT}/user/get`, config)
    ]);
    const [roomData, userData] = await Promise.all([
        roomRes.json(),
        userRes.json()
    ]);

    let rooms = roomData?.data || [];
    if (search) {
        rooms = rooms.filter((e: any) =>
            `${e.room_name} ${e.name_th}`.includes(search)
        );
    }

    return {
        rooms,
        users: userData?.data || [],
        search
    };
};


