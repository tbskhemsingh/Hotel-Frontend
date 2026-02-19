import { fetchClient } from '../public/fetchClient';

export const upsertCollection = async (payload) => {
    return fetchClient('/collection/upsert', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};

export const getCollectionList = async (status, geoNodeId) => {
    const query = new URLSearchParams();

    if (status) {
        query.append('status', status);
    }

    if (geoNodeId) {
        query.append('geoNodeId', geoNodeId);
    }

    const url = query.toString() ? `/collection/list?${query.toString()}` : `/collection/list`;

    const res = await fetchClient(url);
    return res;
};
