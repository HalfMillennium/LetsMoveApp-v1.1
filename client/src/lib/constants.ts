// Apartment mock data
export const APARTMENT_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1464890100898-a385f744067f",
  "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1"
];

export const BUILDING_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118",
  "https://images.unsplash.com/photo-1523192193543-6e7296d960e4",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
];

export const AMENITY_IMAGES = [
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
  "https://images.unsplash.com/photo-1621293954908-907159247fc8",
  "https://images.unsplash.com/photo-1574186708839-3c0ec9ecc1d5",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
];

export const NEIGHBORHOOD_IMAGES = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
  "https://images.unsplash.com/photo-1444723121867-7a241cacace9",
  "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
  "https://images.unsplash.com/photo-1467987506553-8f3916508521"
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
  "Concierge"
];

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: "$500-$1000", min: 500, max: 1000 },
  { label: "$1000-$1500", min: 1000, max: 1500 },
  { label: "$1500-$2000", min: 1500, max: 2000 },
  { label: "$2000-$3000", min: 2000, max: 3000 },
  { label: "$3000+", min: 3000, max: null }
];

// Bedroom options
export const BEDROOM_OPTIONS = [
  { label: "Studio", value: 0 },
  { label: "1+ Bedrooms", value: 1 },
  { label: "2+ Bedrooms", value: 2 },
  { label: "3+ Bedrooms", value: 3 }
];

// Distance options
export const DISTANCE_OPTIONS = [
  { label: "Within 0.5 miles", value: 0.5 },
  { label: "Within 1 mile", value: 1 },
  { label: "Within 2 miles", value: 2 },
  { label: "Within 5 miles", value: 5 }
];

// Default user for development
export const DEFAULT_USER = {
  id: 1,
  username: "user123",
  email: "user@example.com",
  fullName: "Demo User",
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
};

// Colors (matching the design)
export const COLORS = {
  cream: "#FFF5E6",
  coral: "#E9927E",
  teal: "#1A4A4A",
  mint: "#C9DAD0",
  lightCream: "#FFF9F2"
};

// API related
export const API_BASE_URL = '/api';

// Location defaults
export const DEFAULT_COORDINATES = {
  latitude: 40.7128,   // New York City latitude
  longitude: -74.0060  // New York City longitude
};
