export const RULE_FIELDS = [
    { label: 'GeoNode', value: 'Geo containment' },
    { label: 'Star Rating', value: 'StarRating' },
    { label: 'Review Score', value: 'ReviewScore' },
    { label: 'Amenities', value: 'Amenities' },
    { label: 'Chain', value: 'Chain' },
    { label: 'Intent Tag', value: 'IntentTag' },
    { label: 'Distance radius', value: 'Distance radius' },
    { label: 'Price Band', value: 'PriceBand' },
    { label: 'Property Type', value: 'PropertyType' },
    { label: 'Brand', value: 'Brand' },
    { label: 'Booking.com', value: 'Booking.com' },
    { label: 'Custom internal tags', value: 'Custom internal tags' }
];

export const RULE_OPERATORS = [
    { label: '=', value: '=' },
    { label: '!=', value: '!=' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: 'IN', value: 'IN' },
    { label: 'LIKE', value: 'LIKE' }
];

export const RULE_VALUE_OPTIONS = {
    StarRating: ['1', '2', '3', '4', '5'],
    ReviewScore: ['6', '7', '8', '9', '9.5'],
    PriceBand: ['Budget', 'Mid', 'Upscale', 'Luxury'],
    PropertyType: ['Hotel', 'Resort', 'Apartment', 'Villa', 'Hostel', 'Boutique Hotel'],
    IntentTag: ['Family', 'Luxury', 'Business', 'Romantic', 'Eco Friendly', 'Beachfront'],
    Amenities: ['Pool', 'Spa', 'Gym', 'Free WiFi', 'Parking', 'Pet Friendly', 'Airport Shuttle'],
    Chain: ['Hilton', 'Marriott', 'Hyatt', 'Accor', 'IHG'],
    Brand: ['Hilton Garden Inn', 'JW Marriott', 'Sofitel', 'Holiday Inn', 'Park Hyatt'],
    BookingRating: ['7+', '8+', '8.5+', '9+'],
    CustomInternalTags: ['Top Seller', 'High Margin', 'Preferred Partner', 'Contracted'],
    GeoContainment: [],
    DistanceRadius: []
};
export const COLLECTION_STATUS_OPTIONS = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Live', value: 'Live' },
    { label: 'Expired', value: 'Expired' },
    { label: 'Published', value: 'Published' }
];
