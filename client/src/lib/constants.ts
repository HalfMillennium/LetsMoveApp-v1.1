// Apartment mock data
export const APARTMENT_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1464890100898-a385f744067f",
  "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1",
];

export const BUILDING_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118",
  "https://images.unsplash.com/photo-1523192193543-6e7296d960e4",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
];

export const AMENITY_IMAGES = [
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1621293954908-907159247fc8",
  "https://images.unsplash.com/photo-1574186708839-3c0ec9ecc1d5",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
];

export const NEIGHBORHOOD_IMAGES = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
  "https://images.unsplash.com/photo-1444723121867-7a241cacace9",
  "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
  "https://images.unsplash.com/photo-1467987506553-8f3916508521",
];

// List of possible amenities
export const AMENITIES = [
  "In-unit laundry",
  "Dishwasher",
  "Gym",
  "Balcony",
  "Elevator",
  "Doorman",
  "Rooftop",
  "Fitness center",
  "Pet friendly",
  "Swimming pool",
  "Central AC",
  "Hardwood floors",
  "Parking",
  "Storage",
  "Concierge",
];

// Price ranges for filtering
export interface PriceRange {
  label: string;
  min: number;
  max: number | null;
}

export const PRICE_RANGES: PriceRange[] = [
  { label: "$500-$1000", min: 500, max: 1000 },
  { label: "$1000-$1500", min: 1000, max: 1500 },
  { label: "$1500-$2000", min: 1500, max: 2000 },
  { label: "$2000-$3000", min: 2000, max: 3000 },
  { label: "$3000+", min: 3000, max: null },
];

// Bedroom options
export const BEDROOM_OPTIONS = [
  { label: "Studio", value: 0 },
  { label: "1+ Bedrooms", value: 1 },
  { label: "2+ Bedrooms", value: 2 },
  { label: "3+ Bedrooms", value: 3 },
];

// Distance options
export const DISTANCE_OPTIONS = [
  { label: "Within 0.5 miles", value: 0.5 },
  { label: "Within 1 mile", value: 1 },
  { label: "Within 2 miles", value: 2 },
  { label: "Within 5 miles", value: 5 },
];

// Default user for development
export const DEFAULT_USER = {
  id: 1,
  username: "user123",
  email: "user@example.com",
  fullName: "Demo User",
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
};

// Colors (matching the design)
export const COLORS = {
  cream: "#FFF5E6",
  coral: "#E9927E",
  teal: "#1A4A4A",
  mint: "#C9DAD0",
  lightCream: "#FFF9F2",
};

// API related
export const API_BASE_URL = "/api";

// Location defaults
export const DEFAULT_COORDINATES = {
  latitude: 40.7128, // New York City latitude
  longitude: -74.006, // New York City longitude
};

export enum MapStyleTypes {
  NEUTRAL = "neutral",
  VIBRANT = "vibrant",
}

const NEUTRAL_MAP_COLORS = [
  {
    stylers: [
      {
        saturation: -100,
      },
      {
        gamma: 1,
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.business",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.business",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.place_of_worship",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.place_of_worship",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "water",
    stylers: [
      {
        visibility: "on",
      },
      {
        saturation: 50,
      },
      {
        gamma: 0,
      },
      {
        hue: "#50a5d1",
      },
    ],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#333333",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text",
    stylers: [
      {
        weight: 0.5,
      },
      {
        color: "#333333",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.icon",
    stylers: [
      {
        gamma: 1,
      },
      {
        saturation: 50,
      },
    ],
  },
];

const VIBRANT_MAP_COLORS = [
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
      {
        color: "#f49f53",
      },
    ],
  },
  {
    featureType: "landscape",
    stylers: [
      {
        color: "#f9ddc5",
      },
      {
        lightness: -7,
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 43,
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        color: "#645c20",
      },
      {
        lightness: 38,
      },
    ],
  },
  {
    featureType: "water",
    stylers: [
      {
        color: "#1994bf",
      },
      {
        saturation: -69,
      },
      {
        gamma: 0.99,
      },
      {
        lightness: 43,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#f19f53",
      },
      {
        weight: 1.3,
      },
      {
        visibility: "on",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "poi.park",
    stylers: [
      {
        color: "#645c20",
      },
      {
        lightness: 39,
      },
    ],
  },
  {
    featureType: "poi.school",
    stylers: [
      {
        color: "#a95521",
      },
      {
        lightness: 35,
      },
    ],
  },
  {
    featureType: "poi.medical",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 38,
      },
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    stylers: [
      {
        color: "#9e5916",
      },
      {
        lightness: 32,
      },
    ],
  },
  {
    featureType: "poi.government",
    stylers: [
      {
        color: "#9e5916",
      },
      {
        lightness: 46,
      },
    ],
  },
  {
    featureType: "transit.station",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.line",
    stylers: [
      {
        color: "#813033",
      },
      {
        lightness: 22,
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        lightness: 38,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#f19f53",
      },
      {
        lightness: -10,
      },
    ],
  },
];

export const MAP_STYLES = {
  [MapStyleTypes.NEUTRAL]: NEUTRAL_MAP_COLORS,
  [MapStyleTypes.VIBRANT]: VIBRANT_MAP_COLORS,
};
