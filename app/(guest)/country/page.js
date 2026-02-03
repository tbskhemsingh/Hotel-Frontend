// export async function generateMetadata({ params }) {
//     console.log(params);
//     const rawCountry = params?.country || 'Australia';
//     const country = rawCountry.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
//     return {
//         title: `Hotels in ${country} | Best Accommodation Deals`,
//         description: `Find hotel accommodation across top destinations in ${country}.`
//     };
// }

import CountryDropdown from '@/utils/components/country/CountryDropdown';
import CountryHeroSection from '@/utils/components/herosection/CountryHeroSection';

export default async function CountryPage({ params }) {
    // const rawCountry = params?.country;
    // const { country } = params;
    // if (!rawCountry) {
    //     return null;
    // }

    // const countryName = rawCountry.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    // const countryName = country?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    // const countries = await getCountriesApi();

    return (
        <>
            <CountryHeroSection />
            <section className="container py-3">
                <CountryDropdown />
            </section>
        </>
    );
}
