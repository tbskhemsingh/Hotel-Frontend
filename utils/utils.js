// utils/helpers/formatCountryName.js
export function formatCountryName(slug = '') {
    return slug
        .split('-') // united-states
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); // United States
}
