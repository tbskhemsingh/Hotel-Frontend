import { fetchClient } from './fetchClient';

export async function getCityHotels(urlName, pageNumber = 1, pageSize = 10) {
    try {
        const encodedUrlName = encodeURIComponent(urlName);
        const response = await fetchClient(`/cities/hotels?urlName=${encodedUrlName}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET'
        });

        const apiData = response?.data;
        if (apiData && apiData.hotelData) {
            const hotels = apiData.hotelData;
            if (hotels.length > 0) {
                hotels[0].totalCount = apiData.totalCount;
            }
            return hotels;
        }
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching city hotels:', error);
        return [];
    }
}
