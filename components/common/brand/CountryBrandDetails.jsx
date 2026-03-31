import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getCountryBrandHotels } from '@/lib/api/public/brandapi';
import Link from 'next/link';
import CountryBrandHotelList from '../hotel/CountryBrandHotelList';

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatBrand(text) {
    return text.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

const PAGE_SIZE = 10;

function resolveTotalCount(hotelsData = []) {
    const reportedTotal = hotelsData?.[0]?.totalCount;

    if (Number.isFinite(Number(reportedTotal)) && Number(reportedTotal) > 0) {
        return Number(reportedTotal);
    }

    return hotelsData.length;
}

export default async function CountryBrandDetails({ params }) {
    let hotels = [];
    let totalCount = 0;
    let country = '';
    let brand = '';

    try {
        const { slug: slugData } = await params;
        const slug = slugData || [];

        if (slug.length >= 2) {
            country = capitalize(slug[0]);
            brand = decodeURIComponent(slug[1]);

            const fullSlug = `/${country}/${brand}`;
            let allHotels = [];
            let pageNumber = 1;
            let hasMore = true;

            while (hasMore) {
                const pageData = await getCountryBrandHotels(fullSlug, pageNumber, PAGE_SIZE);

                if (pageData?.length > 0) {
                    allHotels = allHotels.concat(pageData);

                    if (pageNumber === 1) {
                        totalCount = resolveTotalCount(pageData);
                    }

                    if (allHotels.length >= totalCount || pageData.length < PAGE_SIZE) {
                        hasMore = false;
                    } else {
                        pageNumber++;
                    }
                } else {
                    hasMore = false;
                }
            }

            hotels = allHotels;
        }
    } catch (error) {
        console.error('Error initializing country brand details:', error);
    }

    const formattedBrand = formatBrand(brand);

    return (
        <>
            <CountryHeroSection />
            <div className="breadcrumb-section">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/brands" className="text-dark text-decoration-none">
                            All Brands
                        </Link>

                        <span className="mx-2 text-muted">&bull;</span>

                        <Link href={`/brand/${brand}`} className="text-dark text-decoration-none text-capitalize">
                            {formattedBrand}
                        </Link>

                        <span className="mx-2 text-muted">&bull;</span>

                        <Link href={`/${country}/${brand}`} className="text-decoration-none text-primary text-capitalize">
                            {country}
                        </Link>
                    </div>
                </div>
            </div>

            <section className="container py-5">
                <h3 className="mb-4 text-capitalize">
                    {formattedBrand} {country}
                </h3>
                {hotels.length > 0 ? (
                    <CountryBrandHotelList hotels={hotels} brand={brand} totalCount={totalCount} />
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">No hotels available for this brand in {country}.</p>
                    </div>
                )}
            </section>
        </>
    );
}
