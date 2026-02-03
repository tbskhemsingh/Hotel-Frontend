import axiosInstance from './axiosInstance';

export const getCountriesApi = async () => {
    const res = await axiosInstance.get('/country/list');
    return res.data.data;
};
