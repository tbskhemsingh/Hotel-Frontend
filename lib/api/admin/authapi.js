import { fetchClient } from '../public/fetchClient';

export const adminLoginApi = async (userName, password) => {
    const json = await fetchClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ userName, password })
    });
    return json.data;
};
