'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import HotelCard from '@/components/ui/HotelCard';

export default function CountryHotelCarousel({}) {
    const hotels = [
        {
            name: 'The Gums Anchorage',
            address: '97 Sylvan Beach Esplanade Bellara 4507',
            images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
        },

        {
            name: 'The Gums Anchorage',
            address: '97 Sylvan Beach Esplanade Bellara 4507',
            images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
        },

        {
            name: 'The Gums Anchorage',
            address: '97 Sylvan Beach Esplanade Bellara 4507',
            images: ['/image/property-img.webp', '/image/property-img.webp', '/image/property-img.webp']
        }
    ];

    return (
        <section className="py-5">
            <div className="container">
                <h2 className="heading text-center mb-5">
                    A Selection of the <span>Best Hotels</span>
                </h2>

                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={25}
                    slidesPerView={3}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 }
                    }}
                >
                    {hotels.map((hotel, index) => (
                        <SwiperSlide key={index}>
                            <div className="justify-content-center">
                                <HotelCard hotel={hotel} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
