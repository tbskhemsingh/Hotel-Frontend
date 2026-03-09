import CountryHeroSection from '@/components/sections/CountryHeroSection';
import RegionFilterSidebar from './RegionFilterSidebar';
import { getCountryByUrlName } from '@/lib/api/public/countryapi';
import { formatCountryName } from '@/lib/utils';
import Link from 'next/link';

export default async function RegionDetails({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || [];
    const countrySlug = slug[0];
    const regionSlug = slug[1];

    const countryName = formatCountryName(countrySlug);
    const regionName = formatCountryName(regionSlug);

    return (
        <>
            <CountryHeroSection />

            {/* BREADCRUMB */}
            <div className="bg-light py-2">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item">
                                <Link href="/destinations">All Countries</Link>
                            </li>

                            <li className="breadcrumb-item">
                                <Link href={`/${countrySlug}`}>{countryName}</Link>
                            </li>

                            <li className="breadcrumb-item active">{regionName}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <section className="container py-4">
                <div className="row">
                    {/* LEFT FILTER */}
                    <div className="col-lg-3">
                        <RegionFilterSidebar />
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="col-lg-9">
                        <h4>Featured Properties in {regionName}</h4>
                    </div>
                </div>
            </section>
        </>
    );
}
