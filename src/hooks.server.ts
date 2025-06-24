import { redirect } from '@sveltejs/kit';
export const handle = async ({ resolve, event }) => {
	 
		return await resolve(event);
};
