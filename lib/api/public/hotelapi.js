import { fetchClient } from './fetchClient';

export const getHotelsByCollection = async (collectionId, { pageNumber, pageSize, searchTerm = '' } = {}) => {
    const query = new URLSearchParams();

    if (pageNumber !== undefined && pageNumber !== null) query.append('pageNumber', pageNumber);
    if (pageSize !== undefined && pageSize !== null) query.append('pageSize', pageSize);
    if (searchTerm) query.append('searchTerm', searchTerm);

    const queryString = query.toString();

    return fetchClient(`/collections/${collectionId}/hotels${queryString ? `?${queryString}` : ''}`, {
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
