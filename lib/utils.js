// utils/helpers/formatCountryName.js
export function formatCountryName(slug = '') {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); 
}

// Country code to Currency mapping
export function countryToCurrency(countryCode) {
    const currencyMap = {
        "DE": "EUR", "FR": "EUR", "IT": "EUR", "ES": "EUR", "NL": "EUR", "PT": "EUR", "GR": "EUR",
        "BE": "EUR", "AT": "EUR", "IE": "EUR", "FI": "EUR", "LU": "EUR", "CY": "EUR", "MT": "EUR",
        "SK": "EUR", "SI": "EUR", "EE": "EUR", "LV": "EUR", "LT": "EUR", "HR": "EUR", "US": "USD",
        "CN": "CNY", "JP": "JPY", "IN": "INR", "ID": "IDR", "SG": "SGD", "MY": "MYR", "PH": "PHP",
        "TH": "THB", "KR": "KRW", "VN": "VND", "HK": "HKD", "TW": "TWD", "AU": "AUD", "NZ": "NZD",
        "GB": "GBP", "CA": "CAD", "BR": "BRL", "MX": "MXN", "ZA": "ZAR", "CH": "CHF", "RU": "RUB",
        "AE": "AED", "SA": "SAR"
    };
    return currencyMap[countryCode] || 'USD';
}
