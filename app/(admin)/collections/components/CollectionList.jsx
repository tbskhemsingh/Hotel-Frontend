'use client';

import { getCollectionList } from '@/lib/api/admin/collectionapi';
import { COLLECTION_STATUS_OPTIONS } from '@/lib/constants/ruleConfig';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CollectionList() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchCollections();
    }, [statusFilter]);

    const fetchCollections = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getCollectionList(statusFilter);
            setCollections(res?.data || []);
        } catch (err) {
            if (err.status === 404) {
                setCollections([]);
                setError(null);
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    if (error) return <div className="text-danger text-center py-5">{error}</div>;

    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Hotel Collections</h5>
                <button className="btn btn-outline-dark btn-sm " onClick={() => router.push('/collections/create')}>
                    Create New Collection
                </button>
            </div>

            <div className="card-body">
                <div className="d-flex justify-content-start align-items-center mb-3 gap-3">
                    <div>
                        <select
                            className="form-select"
                            style={{ width: '200px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>

                            {COLLECTION_STATUS_OPTIONS.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                        <select
                            className="form-select"
                            style={{ width: '200px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">GeoNode</option>

                            {COLLECTION_STATUS_OPTIONS.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            style={{ width: '200px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">City</option>

                            {COLLECTION_STATUS_OPTIONS.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                </div>

                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Collection Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Hotels</th>
                            <th>Publish Date</th>
                            <th>URL</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Loading collections...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="6" className="text-danger text-center py-4">
                                    {error}
                                </td>
                            </tr>
                        ) : collections.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">
                                    {statusFilter ? `No ${statusFilter} collections found` : 'No collections found'}
                                </td>
                            </tr>
                        ) : (
                            collections.map((item) => (
                                <tr key={item.collectionID}>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <span className="badge bg-success">{item.status}</span>
                                    </td>
                                    <td>{item.hotelCount}</td>
                                    <td>{item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                        <button className="btn btn-sm btn-outline-secondary me-2">Clone</button>
                                        <button className="btn btn-sm btn-outline-secondary">Preview</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                    {/* <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Loading collections...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="6" className="text-danger text-center py-4">
                                    {error}
                                </td>
                            </tr>
                        ) : collections.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No collections found
                                </td>
                            </tr>
                        ) : (
                            collections.map((item) => (
                                <tr key={item.collectionID}>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <span className="badge bg-success">{item.status}</span>
                                    </td>
                                    <td>{item.hotelCount}</td>
                                    <td>{item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                        <button className="btn btn-sm btn-outline-secondary me-2">Clone</button>
                                        <button className="btn btn-sm btn-outline-secondary">Preview</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody> */}
                </table>

                <div className="text-end">
                    <button className="btn btn-outline-danger btn-sm me-2">Retire</button>
                    <button className="btn btn-outline-dark btn-sm">Retire & Redirect</button>
                </div>
            </div>
        </div>
    );
}
