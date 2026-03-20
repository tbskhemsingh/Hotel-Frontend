'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdOutlineStarPurple500 } from 'react-icons/md';
import { FaMapMarkerAlt, FaCamera, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getHotelByUrl } from '@/lib/api/public/hotelapi';

export default function HotelDetails({ city, hotel }) {
    const [hotelData, setHotelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    const openPhotoModal = (index = 0) => {
        setCurrentPhotoIndex(index);
        setShowPhotoModal(true);
    };

    const closePhotoModal = () => {
        setShowPhotoModal(false);
    };

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % allPhotos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    };

    // Fetch hotel data from API
    useEffect(() => {
        const loadHotel = async () => {
            try {
                setLoading(true);
                const urlName = `/${city}/${hotel}`;

                const response = await getHotelByUrl(urlName);

                if (response?.status === 'success' && response?.data?.hotel) {
                    setHotelData(response.data);
                } else {
                    setError('Hotel not found');
                }
            } catch (err) {
                console.error('Error loading hotel:', err);
                setError('Failed to load hotel data');
            } finally {
                setLoading(false);
            }
        };

        if (hotel) {
            loadHotel();
        }
    }, [hotel]);

    function getRatingText(score) {
        if (score >= 9) return 'Exceptional';
        if (score >= 8) return 'Excellent';
        if (score >= 7) return 'Very good';
        if (score >= 6) return 'Good';
        return 'Pleasant';
    }

    // Get facility icon based on facility name
    function getFacilityIcon(facilityName) {
        const name = facilityName.toLowerCase();
        if (name.includes('wifi') || name.includes('internet')) return 'fa-wifi';
        if (name.includes('parking')) return 'fa-square-parking';
        if (name.includes('restaurant') || name.includes('food') || name.includes('breakfast')) return 'fa-utensils';
        if (name.includes('room service')) return 'fa-bell-concierge';
        if (name.includes('front desk') || name.includes('24-hour')) return 'fa-headset';
        if (name.includes('air conditioning') || name.includes('a/c')) return 'fa-snowflake';
        if (name.includes('pool') || name.includes('swim')) return 'fa-person-swimming';
        if (name.includes('fitness') || name.includes('gym')) return 'fa-dumbbell';
        if (name.includes('spa')) return 'fa-spa';
        if (name.includes('bar')) return 'fa-martini-glass';
        if (name.includes('laundry')) return 'fa-soap';
        if (name.includes('airport')) return 'fa-plane';
        if (name.includes('elevator') || name.includes('lift')) return 'fa-elevator';
        return 'fa-check';
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="skeleton-text mb-2" style={{ width: '150px', height: '20px' }}></div>
                <div className="skeleton-title" style={{ width: '300px', height: '40px' }}></div>
            </div>
        );
    }

    if (error || !hotelData?.hotel) {
        return (
            <>
                <CountryHeroSection />
                <div className="container py-5 text-center">
                    <h3>{error || 'Hotel not found'}</h3>
                    <Link href="/" className="theme-button-orange rounded-1 mt-3 d-inline-block">
                        Back to Home
                    </Link>
                </div>
            </>
        );
    }

    const hotelInfo = hotelData.hotel;
    const hotelPhotos = hotelData.hotelPhotos || [];
    const hotelFacilities = hotelData.hotelFacilities || [];
    const hotelReviews = hotelData.hotelReviews || [];

    // Get main photo
    const mainPhoto = hotelInfo.mainPhoto || '/image/property-img.webp';

    // All photos for modal
    const allPhotos = [mainPhoto, ...hotelPhotos.map(p => p.photo)];

    return (
        <>
            <CountryHeroSection />

            {/* Breadcrumb */}
            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/" className="text-dark text-decoration-none">Home</Link>
                        <span className="mx-2 text-muted">•</span>
                        <Link href={`/${hotelInfo.city?.toLowerCase()}`} className="text-dark text-decoration-none">{hotelInfo.city}</Link>
                        <span className="mx-2 text-muted">•</span>
                        <span className="fw-semibold text-decoration-none text-primary">{hotelInfo.hotelName}</span>
                    </div>
                </div>
            </div>

            {/* Hotel Header Info - Above Images */}
            <section className="container py-3">
                <div className="d-flex align-items-start flex-column flex-md-row mb-3">
                    <div className="me-auto">
                        <h1 className="fw-bold mb-2" style={{ fontSize: '28px' }}>{hotelInfo.hotelName}</h1>
                        <div className="text-warning d-flex align-items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <MdOutlineStarPurple500
                                    key={i}
                                    size={18}
                                    color={i < hotelInfo.stars ? "#f0831e" : "#ddd"}
                                />
                            ))}
                        </div>
                        <p className="text-muted mb-0">
                            <FaMapMarkerAlt className="text-primary me-2" />
                            {hotelInfo.address}
                        </p>
                    </div>

                    {/* Review Score Box */}
                    <div className="d-flex align-items-start mt-3 mt-md-0">
                        <div
                            className="d-flex flex-column align-items-center justify-content-center p-2"
                            style={{ background: '#003580', borderRadius: '12px 12px 12px 0', minWidth: '70px' }}
                        >
                            <span className="text-white fw-bold fs-4">{hotelInfo.reviewScore}</span>
                        </div>
                        <div className="ms-2 d-flex flex-column justify-content-center">
                            <span className="fw-bold">{getRatingText(hotelInfo.reviewScore)}</span>
                            <span className="text-muted small">{hotelInfo.reviewCount} reviews</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery with Carousel */}
            <section className="container py-3">
                <div className="row g-2">
                    {/* Main image with carousel */}
                    <div className="col-md-8">
                        <div
                            id="hotelCarousel"
                            className="carousel slide rounded-4 overflow-hidden"
                            data-bs-ride="carousel"
                            style={{ height: '400px' }}
                        >
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#hotelCarousel" data-bs-slide-to="0" className="active"></button>
                                {hotelPhotos.slice(0, 4).map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        data-bs-target="#hotelCarousel"
                                        data-bs-slide-to={idx + 1}
                                    ></button>
                                ))}
                            </div>
                            <div className="carousel-inner h-100">
                                <div className="carousel-item active h-100">
                                    <img
                                        src={mainPhoto}
                                        className="d-block w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        alt={hotelInfo.hotelName}
                                    />
                                </div>
                                {hotelPhotos.slice(0, 4).map((photo, idx) => (
                                    <div key={idx} className="carousel-item h-100">
                                        <img
                                            src={photo.photo}
                                            className="d-block w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                            alt={`${hotelInfo.hotelName} photo ${idx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Carousel controls */}
                            <button className="carousel-control-prev" type="button" data-bs-target="#hotelCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#hotelCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>

                    {/* Side images grid */}
                    <div className="col-md-4">
                        <div className="row g-2 h-100">
                            {hotelPhotos.slice(0, 4).map((photo, idx) => (
                                <div key={idx} className="col-6">
                                    <div
                                        className="rounded-4 overflow-hidden position-relative photo-hover-container"
                                        style={{ height: '100%', minHeight: '190px', cursor: 'pointer' }}
                                        onClick={() => openPhotoModal(idx + 1)}
                                    >
                                        <img
                                            src={photo.photo}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                            alt={`${hotelInfo.hotelName} photo ${idx + 1}`}
                                        />
                                        <div className="photo-hover-overlay d-flex align-items-center justify-content-center">
                                            <span className="btn btn-light border rounded-pill px-3 py-1">
                                                <FaCamera className="me-1" /> View
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* View all photos button */}
                <div className="mt-2">
                    <button
                        className="btn btn-light border rounded-pill px-4 py-2 shadow-sm view-photos-btn"
                        onClick={() => openPhotoModal()}
                    >
                        <FaCamera className="me-2" />
                        View all {hotelPhotos.length + 1} photos
                    </button>
                </div>
            </section>

            {/* Tabs Section */}
            <section className="container py-4">
                {/* Tab Navigation */}
                <div className="border-bottom mb-4">
                    <ul className="nav nav-tabs border-0" role="tablist">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'overview' ? 'active' : ''} border-0`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <span className="fw-bold">Overview</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''} border-0`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                <span className="fw-bold">Reviews</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'facilities' ? 'active' : ''} border-0`}
                                onClick={() => setActiveTab('facilities')}
                            >
                                <span className="fw-bold">Facilities</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'policies' ? 'active' : ''} border-0`}
                                onClick={() => setActiveTab('policies')}
                            >
                                <span className="fw-bold">Hotel Policy</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'askPrice' ? 'active' : ''} border-0`}
                                onClick={() => setActiveTab('askPrice')}
                            >
                                <span className="fw-bold">Ask for Prices</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'writeReview' ? 'active' : ''} border-0`}
                                onClick={() => setActiveTab('writeReview')}
                            >
                                <span className="fw-bold">Write a Review</span>
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        {activeTab === 'overview' && (
                            <div className="tab-content">
                                {/* Description */}
                                <div className="mb-4">
                                    <p className="text-muted" style={{ lineHeight: '1.8' }}>{hotelInfo.description}</p>
                                </div>

                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-content">
                                <div className="mb-4">
                                    {hotelReviews.length > 0 ? (
                                        <div className="row">
                                            {hotelReviews.map((review, idx) => (
                                                <div key={idx} className="col-12 mb-3">
                                                    <div className="border rounded p-3">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <div
                                                                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3"
                                                                style={{ width: '50px', height: '50px', fontSize: '20px' }}
                                                            >
                                                                {review.travellerName ? review.travellerName.charAt(0).toUpperCase() : 'G'}
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-bold" style={{ fontSize: '16px' }}>{review.travellerName || 'Guest'}</p>
                                                                <p className="mb-0 text-muted small">{review.reviewType || 'Solo traveler'}</p>
                                                            </div>
                                                            <div className="ms-auto">
                                                                <div className="d-flex align-items-center">
                                                                    <MdOutlineStarPurple500 className="text-warning me-1" />
                                                                    <span className="fw-bold">{review.reviewStar || hotelInfo.reviewScore || '0'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {(review.positive || review.negative) && (
                                                            <div>
                                                                <p className="mb-0 text-muted">{review.positive || review.negative}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border rounded p-4 text-center">
                                            <p className="text-muted mb-0">No reviews available yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'facilities' && (
                            <div className="tab-content">
                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">All Facilities</h5>
                                    <div className="row g-3">
                                        {hotelFacilities.length > 0 ? (
                                            hotelFacilities.map((facility, idx) => (
                                                <div key={idx} className="col-6 col-md-4">
                                                    <div className="d-flex align-items-center p-3 border rounded h-100">
                                                        <i className={`fa-solid ${getFacilityIcon(facility.facilityName)} text-success me-3 fs-5`}></i>
                                                        <span>{facility.facilityName}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12">
                                                <div className="border rounded p-4 text-center">
                                                    <p className="text-muted mb-0">No facilities information available.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}

                        {activeTab === 'policies' && (
                            <div className="tab-content">
                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">Hotel Policies</h5>
                                    <div className="border rounded p-4">
                                        <p className="mb-0 text-muted" >
                                            {hotelInfo.hotelPolicy || 'No special policies listed.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">Check-in / Check-out</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="border rounded p-4">
                                                <p className="mb-2 fw-bold text-primary" style={{ fontSize: '18px' }}>Check-in</p>
                                                <p className="mb-0 text-muted">
                                                    From {hotelInfo.checkIn ? hotelInfo.checkIn.slice(0, 5) : '00:00'} to 23:59
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="border rounded p-4">
                                                <p className="mb-2 fw-bold text-primary" style={{ fontSize: '18px' }}>Check-out</p>
                                                <p className="mb-0 text-muted">
                                                    Until {hotelInfo.checkOut ? hotelInfo.checkOut.slice(0, 5) : '11:00'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'askPrice' && (
                            <div className="tab-content">
                                <div className="row">
                                    {/* Left Column - Hotel Info Card */}
                                    <div className="col-lg-4 mb-4">
                                        <div className="border rounded p-4">
                                            <h5 className="fw-bold mb-3">{hotelInfo.hotelName}</h5>
                                            <div className="text-warning d-flex align-items-center mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <MdOutlineStarPurple500
                                                        key={i}
                                                        size={16}
                                                        color={i < hotelInfo.stars ? "#f0831e" : "#ddd"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-muted small mb-2">
                                                <FaMapMarkerAlt className="text-primary me-1" />
                                                {hotelInfo.address}, {hotelInfo.city}
                                            </p>
                                            <hr />
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Review Score</span>
                                                <span className="fw-bold">{hotelInfo.reviewScore}/10</span>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Review Count</span>
                                                <span className="fw-bold">{hotelInfo.reviewCount} reviews</span>
                                            </div>
                                            <hr />
                                            <p className="text-muted small mb-0">
                                                <i className="fa-solid fa-tag me-2"></i>
                                                Best price guarantee
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column - Contact Form */}
                                    <div className="col-lg-8">
                                        <div className="border rounded p-4">
                                            <h5 className="fw-bold mb-3">Ask for Prices</h5>
                                            <p className="text-muted mb-4">
                                                Looking for the best deal? Send us your requirements and we will get back to you with the best available prices.
                                            </p>
                                            <form onSubmit={(e) => { e.preventDefault(); alert('Price request sent!'); }}>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Your Name"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="Your Email"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            placeholder="Phone Number"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <textarea
                                                            className="form-control"
                                                            rows="4"
                                                            placeholder="Your requirements (number of rooms, guests, special requests, etc.)"
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="submit" className="btn btn-primary px-5 py-2">
                                                            Send Request
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'writeReview' && (
                            <div className="tab-content">
                                <div className="row">
                                    {/* Left Column - Hotel Info Card */}
                                    <div className="col-lg-4 mb-4">
                                        <div className="border rounded p-4">
                                            <h5 className="fw-bold mb-3">{hotelInfo.hotelName}</h5>
                                            <div className="text-warning d-flex align-items-center mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <MdOutlineStarPurple500
                                                        key={i}
                                                        size={16}
                                                        color={i < hotelInfo.stars ? "#f0831e" : "#ddd"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-muted small mb-2">
                                                <FaMapMarkerAlt className="text-primary me-1" />
                                                {hotelInfo.address}, {hotelInfo.city}
                                            </p>
                                            <hr />
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Review Score</span>
                                                <span className="fw-bold">{hotelInfo.reviewScore}/10</span>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="text-muted">Review Count</span>
                                                <span className="fw-bold">{hotelInfo.reviewCount} reviews</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Review Form */}
                                    <div className="col-lg-8">
                                        <div className="border rounded p-4">
                                            <h5 className="fw-bold mb-3">Write a Review</h5>
                                            <p className="text-muted mb-4">
                                                Your review helps other travelers make informed decisions about their stay.
                                            </p>
                                            <form onSubmit={(e) => { e.preventDefault(); alert('Review submitted!'); }}>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Your Name"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                    <select className="form-select" required>
                                                        <option value="">Select Travel Type</option>
                                                        <option value="solo">Solo traveler</option>
                                                        <option value="couple">Couple</option>
                                                        <option value="family">Family</option>
                                                        <option value="business">Business</option>
                                                        <option value="friends">Friends</option>
                                                    </select>
                                                </div>
                                                <div className="col-12">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-bold">Your Rating</label>
                                                        <div className="d-flex align-items-center">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <MdOutlineStarPurple500
                                                                    key={star}
                                                                    className="text-warning"
                                                                    style={{ fontSize: '32px', cursor: 'pointer' }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        placeholder="What did you like most?"
                                                    ></textarea>
                                                </div>
                                                <div className="col-12">
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        placeholder="What could be improved?"
                                                    ></textarea>
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-primary px-5 py-2">
                                                        Submit Review
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Photo Modal */}
            {showPhotoModal && (
                <div className="photo-modal-overlay" onClick={closePhotoModal}>
                    <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="photo-modal-header">
                            <h3 className="photo-modal-title">{hotelInfo.hotelName}</h3>
                            <span className="photo-modal-counter">{currentPhotoIndex + 1} of {allPhotos.length}</span>
                            <button className="photo-modal-close" onClick={closePhotoModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="photo-modal-body">
                            <button className="photo-modal-nav photo-modal-prev" onClick={prevPhoto}>
                                <FaChevronLeft />
                            </button>
                            <img
                                src={allPhotos[currentPhotoIndex]}
                                alt={`Photo ${currentPhotoIndex + 1}`}
                                className="photo-modal-image"
                            />
                            <button className="photo-modal-nav photo-modal-next" onClick={nextPhoto}>
                                <FaChevronRight />
                            </button>
                        </div>
                        <div className="photo-modal-footer">
                            {allPhotos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={photo}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className={`photo-thumbnail ${currentPhotoIndex === idx ? 'active' : ''}`}
                                    onClick={() => setCurrentPhotoIndex(idx)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .view-photos-btn:hover {
                    background-color: #ff7a00 !important;
                    border-color: #ff7a00 !important;
                    color: white !important;
                }
                .photo-hover-container:hover .photo-hover-overlay {
                    opacity: 1;
                }
                .photo-hover-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .photo-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(28, 28, 28, 0.95);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .photo-modal-content {
                    position: relative;
                    width: 90%;
                    max-width: 1000px;
                    background: #1a1a1a;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                }
                .photo-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 24px;
                    background: #262626;
                    border-bottom: 1px solid #404040;
                }
                .photo-modal-title {
                    color: white;
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0;
                }
                .photo-modal-counter {
                    color: #999;
                    font-size: 14px;
                }
                .photo-modal-close {
                    background: #404040;
                    border: none;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: white;
                    font-size: 18px;
                    transition: background 0.2s;
                }
                .photo-modal-close:hover {
                    background: #555;
                }
                .photo-modal-body {
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 500px;
                }
                .photo-modal-image {
                    max-width: 100%;
                    max-height: 70vh;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .photo-modal-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 18px;
                    color: #333;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: all 0.2s;
                }
                .photo-modal-nav:hover {
                    background: #f5f5f5;
                    transform: translateY(-50%) scale(1.1);
                }
                .photo-modal-prev {
                    left: 20px;
                }
                .photo-modal-next {
                    right: 20px;
                }
                .photo-modal-footer {
                    padding: 16px 24px;
                    background: #262626;
                    border-top: 1px solid #404040;
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                .photo-thumbnail {
                    width: 60px;
                    height: 45px;
                    border-radius: 6px;
                    object-fit: cover;
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.2s, transform 0.2s;
                    border: 2px solid transparent;
                }
                .photo-thumbnail:hover {
                    opacity: 0.8;
                }
                .photo-thumbnail.active {
                    opacity: 1;
                    border-color: #ff7a00;
                }
            `}</style>
        </>
    );
}
