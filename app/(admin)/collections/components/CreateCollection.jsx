'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCitiesByCountryOrRegion, getGeoNodes, getHotelsByCity, upsertCollection } from '@/lib/api/admin/collectionapi';
import { RULE_FIELDS, RULE_OPERATORS, RULE_VALUE_OPTIONS } from '@/lib/constants/ruleConfig';

export default function CreateCollection() {
    const router = useRouter();
    const [rules, setRules] = useState([]);
    const [ruleField, setRuleField] = useState('');
    const [ruleOperator, setRuleOperator] = useState('=');
    const [ruleValue, setRuleValue] = useState('');
    const [hotelSearch, setHotelSearch] = useState('');
    const [pinnedHotels, setPinnedHotels] = useState([]);
    const [excludeSearch, setExcludeSearch] = useState('');
    const [excludeReason, setExcludeReason] = useState('');
    const [excludedHotels, setExcludedHotels] = useState([]);
    const [activeTab, setActiveTab] = useState('Basics');
    const [selectedCity, setSelectedCity] = useState('');
    const [geoNodes, setGeoNodes] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingHotels, setLoadingHotels] = useState(false);
    const [pinnedOptions, setPinnedOptions] = useState([]);
    const [excludeOptions, setExcludeOptions] = useState([]);
    const [showPinnedDropdown, setShowPinnedDropdown] = useState(false);
    const [showExcludeDropdown, setShowExcludeDropdown] = useState(false);

    const pinnedRef = useRef(null);
    const excludeRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        geoNodeId: '',
        parentCollectionId: '',
        type: '',
        status: 'Draft',
        expiryDate: '',
        mode: 'Hybrid',
        geoRule: '',
        tagRule: '',
        ratingRule: '',
        maxHotels: '',
        excludedChain: '',
        excludedHotels: [],
        pinnedHotels: [],
        changedBy: 'Admin',
        isDebug: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pinnedRef.current && !pinnedRef.current.contains(event.target)) {
                setShowPinnedDropdown(false);
            }

            if (excludeRef.current && !excludeRef.current.contains(event.target)) {
                setShowExcludeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (publishType = 'Draft') => {
        const collectionObject = {
            GeoNodeId: Number(formData.geoNodeId),
            ParentCollectionId: formData.parentCollectionId ? Number(formData.parentCollectionId) : null,
            Name: formData.name,
            Slug: formData.slug,
            Type: formData.mode.toLowerCase(),
            Status: publishType.toLowerCase(),
            PublishDate: publishType === 'Published' ? new Date().toISOString().split('T')[0] : null,
            ExpiryDate: formData.expiryDate || null,
            MaxHotels: Number(formData.maxHotels),
            DefaultSort: 'StarRating DESC'
        };

        const payload = {
            collectionId: null,
            collectionJson: JSON.stringify(collectionObject),

            rulesJson: JSON.stringify(rules),

            pinnedJson: JSON.stringify(
                pinnedHotels.map((h, i) => ({
                    HotelId: Number(h.id),
                    Position: i + 1
                }))
            ),

            excludeJson: JSON.stringify(
                excludedHotels.map((h) => ({
                    HotelId: Number(h.id),
                    Reason: h.reason
                }))
            ),

            changedBy: formData.changedBy,
            isDebug: formData.isDebug
        };

        await upsertCollection(payload);
        router.push('/admin/collections');
    };

    const moveHotel = (index, direction) => {
        const updated = [...pinnedHotels];
        const target = index + direction;
        if (target < 0 || target >= updated.length) return;

        [updated[index], updated[target]] = [updated[target], updated[index]];
        setPinnedHotels(updated);
    };

    const addRule = () => {
        if (!ruleField || !ruleValue) return;

        setRules([
            ...rules,
            {
                Field: ruleField,
                Operator: ruleOperator,
                Value: ruleValue
            }
        ]);

        setRuleField('');
        setRuleOperator('=');
        setRuleValue('');
    };

    const removeRule = (index) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    useEffect(() => {
        loadGeoNodes();
    }, []);

    const loadGeoNodes = async () => {
        try {
            const res = await getGeoNodes();
            setGeoNodes(res?.data?.countries || []);
        } catch (err) {
            console.error('GeoNode load error', err);
        }
    };

    useEffect(() => {
        if (formData.geoNodeId) {
            loadCities(formData.geoNodeId);
        } else {
            setCities([]);
            setSelectedCity('');
        }
    }, [formData.geoNodeId]);

    const loadCities = async (countryId) => {
        try {
            const res = await getCitiesByCountryOrRegion({
                countryId
            });

            setCities(res?.data || []);
        } catch (err) {
            if (err?.status === 404) {
                setCities([]);
            } else {
                console.error('City load error', err);
            }
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (hotelSearch.length >= 2) {
                loadHotels(hotelSearch, 'pinned');
                setShowPinnedDropdown(true);
            } else {
                setPinnedOptions([]);
                setShowPinnedDropdown(false);
            }

            if (excludeSearch.length >= 2) {
                loadHotels(excludeSearch, 'exclude');
                setShowExcludeDropdown(true);
            } else {
                setExcludeOptions([]);
                setShowExcludeDropdown(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [hotelSearch, excludeSearch, selectedCity]);

    // const loadHotels = async (search, type) => {
    //     try {
    //         setLoadingHotels(true);

    //         const payload = {
    //             search
    //         };

    //         // Only add cityId if selected
    //         if (selectedCity) {
    //             payload.cityId = selectedCity;
    //         }

    //         const res = await getHotelsByCity(payload);
    //         const results = res?.data?.slice(0, 50) || [];

    //         if (type === 'pinned') {
    //             setPinnedOptions(results || []);
    //         } else {
    //             setExcludeOptions(results || []);
    //         }
    //     } catch (err) {
    //         console.error('Hotel load error', err);

    //         if (type === 'pinned') {
    //             setPinnedOptions([]);
    //         } else {
    //             setExcludeOptions([]);
    //         }
    //     } finally {
    //         setLoadingHotels(false);
    //     }
    // };

    const loadHotels = async (search, type) => {
        try {
            setLoadingHotels(true);

            const payload = {
                search
            };

            // Add cityId only if selected
            if (selectedCity) {
                payload.cityId = selectedCity;
            }

            const res = await getHotelsByCity(payload);

            // ✅ LIMIT RESULTS (Prevents UI lag if API returns 500+ hotels)
            const results = res?.data?.slice(0, 50) || [];

            if (type === 'pinned') {
                setPinnedOptions(results);
                setShowPinnedDropdown(true);
            } else if (type === 'exclude') {
                setExcludeOptions(results);
                setShowExcludeDropdown(true);
            }
        } catch (err) {
            console.error('Hotel load error', err);

            if (type === 'pinned') {
                setPinnedOptions([]);
                setShowPinnedDropdown(false);
            } else if (type === 'exclude') {
                setExcludeOptions([]);
                setShowExcludeDropdown(false);
            }
        } finally {
            setLoadingHotels(false);
        }
    };

    const addExcludedHotel = () => {
        if (!excludeSearch || !excludeReason) return;

        setExcludedHotels([
            ...excludedHotels,
            {
                id: Date.now(),
                name: excludeSearch,
                reason: excludeReason
            }
        ]);

        setExcludeSearch('');
        setExcludeReason('');
    };

    const addPinnedHotel = () => {
        if (!hotelSearch) return;

        setPinnedHotels([...pinnedHotels, { id: Date.now(), name: hotelSearch }]);

        setHotelSearch('');
    };
    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h5 className="mb-0">Create Collection</h5>
            </div>

            <div className="card-body">
                <ul className="nav nav-tabs mb-4">
                    {['Basics', 'Content', 'Rules', 'Curation', 'Preview'].map((tab) => (
                        <li className="nav-item" key={tab}>
                            <button
                                type="button"
                                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>

                {activeTab === 'Basics' && (
                    <>
                        {/* ================= BASIC SECTION ================= */}
                        <div className="row">
                            <div className="col-12 col-lg-6 mb-3">
                                <label className="form-label">Collection Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Collection Name"
                                />
                            </div>

                            <div className="col-12 col-lg-6 mb-3">
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="Collection slug"
                                />
                            </div>

                            {/* GeoNode */}
                            <div className="col-12 col-lg-6 mb-3">
                                <label className="form-label">GeoNode</label>
                                <select className="form-select" name="geoNodeId" value={formData.geoNodeId} onChange={handleChange}>
                                    <option value="">Select GeoNode</option>
                                    {geoNodes.map((node) => (
                                        <option key={node.countryID} value={node.countryID}>
                                            {node.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* City */}
                            <div className="col-12 col-lg-6 mb-3">
                                <label className="form-label">City</label>
                                <select
                                    className="form-select"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    disabled={!formData.geoNodeId}
                                >
                                    <option value="">Select City</option>

                                    {cities.length === 0 && formData.geoNodeId && (
                                        <option value="" disabled>
                                            No cities found
                                        </option>
                                    )}

                                    {cities.map((city) => (
                                        <option key={city.cityID} value={city.cityID}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-lg-6 mb-3">
                                <label className="form-label">Template</label>
                                <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                                    <option value="">Select Type</option>
                                    <option value="Family">Family</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>

                            <div className="col-12 col-lg-6 mb-3">
                                <label className="form-label">Status</label>
                                <div>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Draft"
                                        checked={formData.status === 'Draft'}
                                        onChange={handleChange}
                                    />{' '}
                                    Draft{' '}
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Published"
                                        checked={formData.status === 'Published'}
                                        onChange={handleChange}
                                    />{' '}
                                    Published
                                </div>
                            </div>

                            <div className="col-12 col-lg-6 mb-3">
                                <label className="form-label">Expiry Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <hr />

                        {/* ================= MODE & RULES ================= */}

                        <div className="row g-3">
                            {/* <div className="col-md-6"> */}
                            <div className="col-12 col-xl-6">
                                <h6>Mode</h6>
                                <div className="form-control bg-light">Hybrid (Rules + Pinned)</div>
                                <h6>Rules</h6>

                                <div className="border p-3 rounded-2 mb-3">
                                    {/* <div className="row g-2 mb-3 align-items-end"> */}
                                    <div className="row g-2">
                                        {/* <div className="col-12 col-lg-4"> */}
                                        <div className="col-12 col-md-4">
                                            <select
                                                className="form-select"
                                                value={ruleField}
                                                onChange={(e) => setRuleField(e.target.value)}
                                            >
                                                <option value="">Select Field</option>
                                                {RULE_FIELDS.map((field) => (
                                                    <option key={field.value} value={field.value}>
                                                        {field.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* <div className="col-12 col-lg-4"> */}
                                        <div className="col-12 col-md-3">
                                            <select
                                                className="form-select"
                                                value={ruleOperator}
                                                onChange={(e) => setRuleOperator(e.target.value)}
                                            >
                                                {RULE_OPERATORS.map((op) => (
                                                    <option key={op.value} value={op.value}>
                                                        {op.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* <div className="col-12 col-lg-4"> */}
                                        <div className="col-12 col-md-3">
                                            {RULE_VALUE_OPTIONS[ruleField] ? (
                                                <select
                                                    className="form-select"
                                                    value={ruleValue}
                                                    onChange={(e) => setRuleValue(e.target.value)}
                                                >
                                                    <option value="">Select Value</option>
                                                    {RULE_VALUE_OPTIONS[ruleField].map((val) => (
                                                        <option key={val} value={val}>
                                                            {val}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter value"
                                                    value={ruleValue}
                                                    onChange={(e) => setRuleValue(e.target.value)}
                                                />
                                            )}
                                        </div>

                                        {/* <div className="col-12 col-lg-2 "> */}
                                        <div className="col-12 col-md-2">
                                            <button className="theme-button-orange rounded-1 w-100" onClick={addRule}>
                                                + Add
                                            </button>
                                        </div>
                                    </div>

                                    {rules.map((r, index) => (
                                        <div key={index} className="d-flex justify-content-between border-bottom py-2">
                                            <div>
                                                {r.Field} {r.Operator} {r.Value}
                                            </div>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeRule(index)}>
                                                ❌
                                            </button>
                                        </div>
                                    ))}

                                    <div className="mt-3">
                                        <label className="form-label">Max Hotels</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            name="maxHotels"
                                            value={formData.maxHotels}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* <div className="col-12 col-lg-3"> */}
                            <div className="col-12 col-md-6 col-xl-3">
                                <h6>Excluded Hotels</h6>

                                <div className="border p-3 rounded-2">
                                    <div className="position-relative" ref={excludeRef}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Hotel"
                                            value={excludeSearch}
                                            onChange={(e) => setExcludeSearch(e.target.value)}
                                        />

                                        {/* {excludeOptions.length > 0 && ( */}
                                        {showExcludeDropdown && excludeOptions.length > 0 && (
                                            <div
                                                className="position-absolute bg-white border w-100 mt-1 rounded shadow-sm"
                                                style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                                            >
                                                {excludeOptions.map((hotel) => (
                                                    <div
                                                        key={hotel.id}
                                                        className="p-2"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (!excludeReason) return;

                                                            setExcludedHotels([
                                                                ...excludedHotels,
                                                                {
                                                                    id: hotel.id,
                                                                    name: hotel.name,
                                                                    reason: excludeReason
                                                                }
                                                            ]);

                                                            setExcludeSearch('');
                                                            setExcludeOptions([]);
                                                            setShowExcludeDropdown(false);
                                                        }}
                                                    >
                                                        {hotel.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-12 ">
                                        <button className="theme-button-orange rounded-1" onClick={addExcludedHotel}>
                                            Exclude
                                        </button>
                                    </div>

                                    {excludedHotels.map((hotel, index) => (
                                        <div
                                            key={hotel.id}
                                            className="d-flex justify-content-between align-items-center border-bottom py-2 mt-2"
                                        >
                                            <div>
                                                {hotel.name} — {hotel.reason}
                                            </div>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setExcludedHotels(excludedHotels.filter((_, i) => i !== index))}
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ================= PINNED ================= */}

                            {/* <div className="col-md-3"> */}
                            <div className="col-12 col-md-6 col-xl-3">
                                <h6>Pinned Hotels</h6>

                                <div className="border p-3 rounded-2">
                                    <div className="position-relative w-100" ref={pinnedRef}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Hotel"
                                            value={hotelSearch}
                                            onChange={(e) => setHotelSearch(e.target.value)}
                                        />

                                        {/* {pinnedOptions.length > 0 && ( */}
                                        {showPinnedDropdown && pinnedOptions.length > 0 && (
                                            <div
                                                className="position-absolute bg-white border w-100 mt-1 rounded shadow-sm"
                                                style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                                            >
                                                {/* {hotelOptions.map((hotel) => ( */}
                                                {pinnedOptions.map((hotel) => (
                                                    <div
                                                        key={hotel.id}
                                                        className="p-2 hover-bg cursor-pointer"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setPinnedHotels([...pinnedHotels, { id: hotel.id, name: hotel.name }]);
                                                            setHotelSearch('');
                                                            setPinnedOptions([]);
                                                            setShowPinnedDropdown(false);
                                                        }}
                                                    >
                                                        {hotel.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {pinnedHotels.map((hotel, index) => (
                                        <div
                                            key={hotel.id}
                                            className="d-flex justify-content-between align-items-center border-bottom py-2"
                                        >
                                            <div>
                                                {index + 1}. {hotel.name}
                                            </div>
                                            <div>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                    onClick={() => moveHotel(index, -1)}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                    onClick={() => moveHotel(index, 1)}
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => setPinnedHotels(pinnedHotels.filter((_, i) => i !== index))}
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="d-flex mb-3">
                                        <button className="theme-button-orange rounded-1" onClick={addPinnedHotel}>
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ================= ACTION BUTTONS ================= */}

                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-outline-secondary" onClick={() => router.back()} type="button">
                                Cancel
                            </button>

                            {/* <button className="btn btn-outline-dark" onClick={() => handleSubmit('Draft')} type="button">
                                Save Draft
                            </button> */}

                            <button className=" theme-button-orange rounded-1" onClick={() => handleSubmit('Published')} type="button">
                                Publish
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
