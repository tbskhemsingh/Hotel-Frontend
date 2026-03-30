'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCityHotels } from '@/lib/api/public/cityapi';
import CityHotelList from './CityHotelList';
import { getHotelRates } from '@/lib/api/public/hotelapi';

function toSlug(value = '') {
    if (!value) return '';

    return value.toString().trim().toLowerCase().replace(/\s+/g, '-');
}

const PAGE_SIZE = 10;

export default function CityDetails({ params }) {
    const [citySlug, setCitySlug] = useState('');
    const [hotels, setHotels] = useState([]);
    const [hotelRates, setHotelRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [city, setCity] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    // Initial fetch on mount
    useEffect(() => {
        const initializeCity = async () => {
            try {
                const { slug } = await params;
                const slug0 = slug?.[0] || '';
                setCitySlug(slug0);

                if (slug0) {
                    const data = await getCityHotels(slug0, 1, PAGE_SIZE);

                    if (data && data.length > 0) {
                        const firstHotel = data[0];
                        setCity(firstHotel?.cityName || '');
                        setContent(firstHotel?.content || '');
                        setHotels(data);
                        setTotalCount(firstHotel?.totalCount || data.length);
                        setHasMore(data.length < (firstHotel?.totalCount || data.length));

                        // Fetch rates for initial hotels
                        const bookingIds = data.map((hotel) => hotel.bookingID).filter(Boolean) || [];
                        if (bookingIds.length > 0) {
                            const ratesRes = await getHotelRates({
                                bookingIds,
                                currency: 'USD',
                                rooms: 1,
                                adults: 2,
                                childs: 0,
                                device: 'desktop',
                                checkIn: null,
                                checkOut: null
                            });
                            setHotelRates(ratesRes?.data || []);
                        }
                    }
                    setPage(1);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                console.error('Error initializing city details:', err);
                setError('Failed to load city details');
            } finally {
                setLoading(false);
            }
        };

        initializeCity();
    }, [params]);

    const loadMoreHotels = async () => {
        if (loadingMore || !hasMore || !citySlug) return;

        setLoadingMore(true);
        const nextPage = page + 1;

        try {
            const newHotels = await getCityHotels(citySlug, nextPage, PAGE_SIZE);

            if (newHotels && newHotels.length > 0) {
                // Fetch rates for new hotels
                const bookingIds = newHotels.map((hotel) => hotel.bookingID).filter(Boolean);
                let newRates = [];

                if (bookingIds.length > 0) {
                    const ratesRes = await getHotelRates({
                        bookingIds,
                        currency: 'USD',
                        rooms: 1,
                        adults: 2,
                        childs: 0,
                        device: 'desktop',
                        checkIn: null,
                        checkOut: null
                    });
                    newRates = ratesRes?.data || [];
                }

                setHotels((prev) => [...prev, ...newHotels]);
                setHotelRates((prev) => [...prev, ...newRates]);
                setPage(nextPage);

                // Update hasMore based on total count
                const currentTotal = hotels.length + newHotels.length;
                setHasMore(currentTotal < totalCount);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error loading more hotels:', err);
        } finally {
            setLoadingMore(false);
        }
    };

    const hasData = hotels && hotels.length > 0;
    const citySlugPath = toSlug(city);

    if (loading) {
        return (
            <>
                <CountryHeroSection />
                <section className="container py-5">
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (error) {
        return (
            <>
                <CountryHeroSection />
                <section className="container py-5">
                    <div className="text-center py-5">
                        <h4>{error}</h4>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <CountryHeroSection />

            {hasData && (
                <div className="py-2">
                    <div className="container">
                        <div className="d-flex align-items-center small">
                            <Link href="/destinations" className="text-dark text-decoration-none">
                                All Countries
                            </Link>

                            <span className="mx-2 text-muted">•</span>

                            <Link className="text-primary" href={`/${citySlugPath}`}>
                                {city}
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <section className="container py-5">
                {hasData ? (
                    <>
                        <h2 className="mb-3">Hotel Accommodation in {city}</h2>

                        {content && <div className="text-muted mb-4" dangerouslySetInnerHTML={{ __html: content }} />}

                        <CityHotelList hotels={hotels} hotelRates={hotelRates} />

                        {hasMore && (
                            <div className="text-center mt-4">
                                <button onClick={loadMoreHotels} disabled={loadingMore} className="theme-button-orange rounded-1 px-5 py-2">
                                    {loadingMore ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-5">
                        <h4>No hotels found for this city</h4>
                    </div>
                )}
            </section>
        </>
    );
}
