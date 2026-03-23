import { fetchClient } from './fetchClient';

export const getHotelsByCollection = async (collectionId) => {
    return fetchClient(`/hotels/${collectionId}`, {
        method: 'GET'
    });
};

export const getHotelByUrl = async (urlName) => {
    return fetchClient(`/hotels/slug?urlName=${encodeURIComponent(urlName)}`, {
        method: 'GET'
    });
};
