import { fetchClient } from './fetchClient';

export const getHotelsByCollection = async (collectionId, pageNumber = 1, pageSize = 10) => {
    return fetchClient(`/hotels/${collectionId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: 'GET'
    });
};

export const getHotelByUrl = async (urlName) => {
    return fetchClient(`/hotels/slug?urlName=${encodeURIComponent(urlName)}`, {
        method: 'GET'
    });
};

export const getHotelRates = async (payload) => {
    return fetchClient('/hotels/rates', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
