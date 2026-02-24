import { useRouter } from 'next/navigation';

export default function BasicsTab({ formData, setFormData, onNext }) {
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleCancel = () => {
        router.push('/collections');
    };
    return (
        <>
            <div className="row">
                {/* Collection Name */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Collection Name </label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter collection name"
                        required
                    />
                </div>

                {/* Slug */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Slug </label>
                    <input
                        type="text"
                        className="form-control"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="collection-slug"
                        required
                    />
                </div>

                {/* Template */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Template </label>
                    <select className="form-select" name="template" value={formData.template} onChange={handleChange} required>
                        <option value="">Select Template</option>
                        <option value="Family">Family</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Business">Business</option>
                        <option value="Budget">Budget</option>
                    </select>
                </div>

                {/* Mode */}
                {/* <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Collection Mode *</label>
                    <select className="form-select" name="mode" value={formData.mode} onChange={handleChange}>
                        <option value="Rule">Rule Based</option>
                        <option value="Curated">Curated</option>
                        <option value="Hybrid">Hybrid (Rules + Pinned)</option>
                    </select>
                </div> */}

                {/* Status */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Status</label>
                    <div className="d-flex gap-3">
                        <div>
                            <input type="radio" name="status" value="Draft" checked={formData.status === 'Draft'} onChange={handleChange} />{' '}
                            Draft
                        </div>
                        <div>
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
                </div>

                {/* Expiry Date */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input type="date" className="form-control" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                </div>

                {/* Max Hotels */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Max Hotels</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control"
                        name="maxHotels"
                        value={formData.maxHotels}
                        onChange={handleChange}
                        placeholder="Enter maximum number of hotels"
                    />
                </div>

                {/* <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Debug Mode</label>
                    <div>
                        <input
                            type="checkbox"
                            name="isDebug"
                            checked={formData.isDebug}
                            onChange={(e) => setFormData({ ...formData, isDebug: e.target.checked })}
                        />{' '}
                        Enable Debug
                    </div>
                </div> */}
            </div>

            <hr />

            {/* Next Button */}
            <div className="d-flex justify-content-between">
                <button className="btn btn-outline-secondary" onClick={handleCancel}>
                    Cancel
                </button>
                <button className="theme-button-orange rounded-2" onClick={onNext} type="button">
                    Next
                </button>
            </div>
        </>
    );
}
