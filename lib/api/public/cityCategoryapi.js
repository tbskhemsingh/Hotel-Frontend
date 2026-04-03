import { fetchClient } from './fetchClient';
import { getSidebarData } from '../sidebarapi';
import { getCityHotels } from './cityapi';
import { resolveSlug } from './countryapi';
import { buildSidebarSections } from '@/lib/mappers/sidebarMapper';

const cityIdCache = new Map();
const cityContextCache = new Map();
const categoryListCache = new Map();
const globalCategoryCache = {
    loaded: false,
    categories: []
};

const PROPERTY_TYPE_HEADER_SUFFIX = 'Apartments, Suites and Family Hotels';

export function toSlug(value = '') {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
}

export function getFirstDefined(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return null;
}

export function normalizeCategoryUrlSlug(urlName = '') {
    const cleaned = decodeURIComponent(String(urlName || '').trim())
        .replace(/\.htm$/i, '')
        .replace(/\/+$/, '');

    return cleaned.split('/').filter(Boolean).pop() || '';
}

export function normalizeCategoryResponse(response) {
    const payload = response?.data ?? response ?? {};
    const hotels = Array.isArray(payload.hotels)
        ? payload.hotels
        : Array.isArray(payload.hotelData)
            ? payload.hotelData
            : Array.isArray(payload.items)
                ? payload.items
                : [];
    const categories = Array.isArray(payload.categories)
        ? payload.categories
        : Array.isArray(payload.categoryData)
            ? payload.categoryData
            : Array.isArray(payload.categoryList)
                ? payload.categoryList
                : [];

    return {
        categories,
        hotels,
        totalCount: Number(payload.totalCount ?? payload.count ?? hotels?.[0]?.totalCount ?? hotels.length ?? 0),
        pageNo: Number(payload.pageNo ?? payload.pageNumber ?? 1),
        pageSize: Number(payload.pageSize ?? 10),
        raw: payload
    };
}

export async function getCityCategoryHotels({ cityID, categoryId, pageNo = 1, pageSize = 10 } = {}) {
    const response = await fetchClient('/api/cities/category-hotels', {
        method: 'POST',
        body: JSON.stringify({
            cityID,
            categoryId,
            pageNo,
            pageSize
        })
    });

    return normalizeCategoryResponse(response);
}

function formatCityName(slug = '') {
    return String(slug || '')
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getSidebarCategoryLabel(item = {}) {
    return String(item?.categoryName ?? item?.name ?? item?.label ?? '').trim();
}

function buildPropertyTypeHeader(cityName = '') {
    return cityName ? `${cityName} ${PROPERTY_TYPE_HEADER_SUFFIX}` : 'Property Type';
}

function buildCategorySlugFromDisplayLabel(label = '', { sectionId = '', citySlug = '' } = {}) {
    const normalizedLabel = toSlug(label);
    const normalizedCitySlug = toSlug(citySlug);

    if (!normalizedLabel) return '';

    if (sectionId === 'property-type' && normalizedCitySlug) {
        return `${normalizedCitySlug}-${normalizedLabel}`;
    }

    return normalizedLabel;
}

function buildSidebarSectionsForCity(sidebarData = {}, citySlug = '', cityName = '') {
    return buildSidebarSections(sidebarData, {
        contextName: cityName || formatCityName(citySlug),
        propertyTypeHeader: buildPropertyTypeHeader(cityName || formatCityName(citySlug))
    });
}

function buildSidebarCategoryIndex(sidebarData = {}, citySlug = '', cityName = '') {
    const sections = buildSidebarSectionsForCity(sidebarData, citySlug, cityName);
    const entries = [];

    for (const section of sections) {
        for (const item of Array.isArray(section?.items) ? section.items : []) {
            const label = getSidebarCategoryLabel(item);
            const categoryID = getFirstDefined(item?.categoryID, item?.CategoryID, item?.id);
            const generatedSlug = buildCategorySlugFromDisplayLabel(label, {
                sectionId: section.sectionId,
                citySlug
            });

            if (!label || categoryID === null || categoryID === undefined || categoryID === '') {
                continue;
            }

            entries.push({
                ...item,
                sectionId: section.sectionId,
                displayLabel: label,
                categoryID: Number(categoryID),
                categoryName: label,
                categorySlug: generatedSlug,
                href: generatedSlug ? `/${encodeURIComponent(toSlug(citySlug))}/${encodeURIComponent(generatedSlug)}` : ''
            });
        }
    }

    return entries;
}

export function buildCategorySidebarSections(sidebarData = {}, { citySlug = '', cityName = '', activeCategorySlug = '' } = {}) {
    const sections = buildSidebarSectionsForCity(sidebarData, citySlug, cityName);
    const normalizedCitySlug = toSlug(citySlug);
    const normalizedActiveSlug = toSlug(categorySlugFromAny(activeCategorySlug));

    return sections.map((section) => ({
        ...section,
        items: (section.items || []).map((item) => {
            const label = getSidebarCategoryLabel(item);
            const categorySlug = buildCategorySlugFromDisplayLabel(label, {
                sectionId: section.sectionId,
                citySlug: normalizedCitySlug
            });

            if (!categorySlug) {
                return item;
            }

            return {
                ...item,
                href: `/${encodeURIComponent(normalizedCitySlug)}/${encodeURIComponent(categorySlug)}`,
                isActive: categorySlug === normalizedActiveSlug
            };
        })
    }));
}

function categorySlugFromAny(value = '') {
    return normalizeCategoryUrlSlug(value || '').replace(/[^a-z0-9-]+/gi, '-');
}

export async function resolveCityContextFromSlug(citySlug = '') {
    const normalizedCitySlug = toSlug(citySlug);
    if (!normalizedCitySlug) return null;

    if (cityContextCache.has(normalizedCitySlug)) {
        return cityContextCache.get(normalizedCitySlug);
    }

    let resolvedContext = null;

    try {
        const hotels = await getCityHotels(normalizedCitySlug, 1, 1);
        const firstHotel = Array.isArray(hotels) ? hotels[0] : null;
        const cityID = getFirstDefined(firstHotel?.cityID, firstHotel?.cityId, firstHotel?.CityID);

        if (cityID !== null && cityID !== undefined && cityID !== '') {
            resolvedContext = {
                cityID: Number(cityID),
                cityName: String(firstHotel?.cityName ?? firstHotel?.city ?? formatCityName(normalizedCitySlug)).trim() || formatCityName(normalizedCitySlug)
            };
        }
    } catch (error) {
        console.error('Error resolving city context from hotels:', error);
    }

    if (!resolvedContext) {
        const attempts = [`/${normalizedCitySlug}`, `/city/${normalizedCitySlug}`];

        for (const slug of attempts) {
            try {
                const response = await resolveSlug(slug);
                const cityID = getFirstDefined(response?.data?.cityID, response?.data?.cityId, response?.data?.entityID);

                if (cityID !== null && cityID !== undefined && cityID !== '') {
                    resolvedContext = {
                        cityID: Number(cityID),
                        cityName: formatCityName(normalizedCitySlug)
                    };
                    break;
                }
            } catch (error) {
                console.error('Error resolving city context from slug:', error);
            }
        }
    }

    cityContextCache.set(normalizedCitySlug, resolvedContext);

    if (resolvedContext?.cityID) {
        cityIdCache.set(normalizedCitySlug, resolvedContext.cityID);
    }

    return resolvedContext;
}

export async function resolveCityIdFromSlug(citySlug = '') {
    const context = await resolveCityContextFromSlug(citySlug);
    return context?.cityID || null;
}

export function getCachedCategories(cityID) {
    return categoryListCache.get(String(cityID)) || null;
}

export function setCachedCategories(cityID, categories) {
    if (cityID === null || cityID === undefined || cityID === '') return;
    categoryListCache.set(String(cityID), Array.isArray(categories) ? categories : []);
}

export function normalizeCategoryItems(categories = []) {
    return (Array.isArray(categories) ? categories : [])
        .filter((item) => {
            const name = String(item?.categoryName ?? item?.categoryTitle ?? item?.name ?? '').trim();
            const urlName = String(item?.categoryUrlName ?? item?.urlName ?? '').trim();
            return Boolean(name && urlName);
        })
        .map((item) => ({
            ...item,
            categoryID: getFirstDefined(item?.categoryID, item?.CategoryID, item?.id),
            categoryName: String(item?.categoryName ?? item?.CategoryName ?? item?.name ?? '').trim(),
            categoryTitle: String(item?.categoryTitle ?? item?.CategoryTitle ?? item?.title ?? '').trim(),
            categoryUrlName: String(item?.categoryUrlName ?? item?.CategoryUrlName ?? item?.urlName ?? '').trim()
        }));
}

export function getSelectedCategoryFromSlug(categories = [], categorySlug = '') {
    const normalizedSlug = toSlug(categorySlug);

    return normalizeCategoryItems(categories).find((item) => normalizeCategoryUrlSlug(item.categoryUrlName).toLowerCase() === normalizedSlug) || null;
}

function normalizeCategoryMatchText(value = '') {
    return String(value || '')
        .toLowerCase()
        .replace(/\.htm$/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\b(hotel|hotels|with|and|or|the|of|city|cbd)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function singularizeWord(value = '') {
    const cleaned = normalizeCategoryMatchText(value);
    return cleaned
        .split(' ')
        .map((word) => (word.endsWith('s') && word.length > 3 ? word.slice(0, -1) : word))
        .join(' ')
        .trim();
}

function buildGlobalCategoryIndex(data = {}) {
    const buckets = [data?.data?.amenities, data?.data?.propertyTypes, data?.data?.brands].filter(Array.isArray);
    const flattened = buckets.flat();

    return flattened
        .map((item) => ({
            ...item,
            categoryID: item?.categoryId ?? item?.categoryID ?? item?.propertyTypeId ?? item?.brandId ?? item?.id ?? null,
            categoryName: String(item?.categoryName ?? item?.propertyTypeName ?? item?.brandName ?? '').trim()
        }))
        .filter((item) => item.categoryID !== null && item.categoryID !== undefined && item.categoryID !== '' && item.categoryName);
}

function scoreCategoryMatch(slug, categoryName) {
    const slugText = singularizeWord(slug);
    const categoryText = singularizeWord(categoryName);

    if (!slugText || !categoryText) return 0;
    if (slugText === categoryText) return 100;
    if (slugText.includes(categoryText)) return 80;
    if (categoryText.includes(slugText)) return 70;

    const slugTokens = new Set(slugText.split(' ').filter(Boolean));
    const categoryTokens = categoryText.split(' ').filter(Boolean);
    if (!categoryTokens.length) return 0;

    const matches = categoryTokens.filter((token) => slugTokens.has(token)).length;
    return Math.round((matches / categoryTokens.length) * 60);
}

export async function getGlobalCategories() {
    if (globalCategoryCache.loaded && globalCategoryCache.categories.length) {
        return globalCategoryCache.categories;
    }

    const response = await fetchClient('/categories', { method: 'GET' });
    const indexed = buildGlobalCategoryIndex(response);

    globalCategoryCache.loaded = true;
    globalCategoryCache.categories = indexed;

    return indexed;
}

export async function resolveCategoryIdFromSlug(categorySlug = '', citySlug = '') {
    const resolved = await resolveCategoryFromSlug(categorySlug, citySlug);
    return resolved?.categoryID || null;
}

export async function resolveCategoryFromSlug(categorySlug = '', citySlug = '') {
    const normalizedCitySlug = toSlug(citySlug);
    const normalizedCategorySlug = toSlug(categorySlugFromAny(categorySlug));

    if (!normalizedCitySlug || !normalizedCategorySlug) {
        return null;
    }

    const cityContext = await resolveCityContextFromSlug(normalizedCitySlug);
    if (!cityContext?.cityID) {
        return null;
    }

    const sidebarData = await getSidebarData({ cityId: cityContext.cityID });
    const indexedCategories = buildSidebarCategoryIndex(sidebarData, normalizedCitySlug, cityContext.cityName);

    const exactMatch = indexedCategories.find((item) => item.categorySlug === normalizedCategorySlug);
    if (exactMatch) {
        return {
            categoryID: exactMatch.categoryID,
            categoryName: exactMatch.categoryName,
            cityID: cityContext.cityID,
            cityName: cityContext.cityName
        };
    }

    const categories = await getGlobalCategories();
    const allowedCategoryIds = new Set(indexedCategories.map((item) => Number(item.categoryID)).filter(Boolean));

    const scored = categories
        .filter((item) => allowedCategoryIds.has(Number(item.categoryID)))
        .map((item) => ({
            ...item,
            score: scoreCategoryMatch(normalizedCategorySlug.replace(/-/g, ' '), item.categoryName)
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

    const best = scored[0];
    return best
        ? {
              categoryID: Number(best.categoryID),
              categoryName: best.categoryName,
              cityID: cityContext.cityID,
              cityName: cityContext.cityName
          }
        : null;
}
