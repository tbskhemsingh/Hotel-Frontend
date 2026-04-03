'use client';

import CityCategoryDetails from './CityCategoryDetails';

export default function CityCategoryRouteApp({
    citySlug = '',
    categorySlug = '',
    resolvedCategoryId = null,
    resolvedCityId = null,
    resolvedCityName = ''
}) {
    return (
        <CityCategoryDetails
            citySlug={citySlug}
            categorySlug={categorySlug}
            resolvedCategoryId={resolvedCategoryId}
            resolvedCityId={resolvedCityId}
            resolvedCityName={resolvedCityName}
        />
    );
}
