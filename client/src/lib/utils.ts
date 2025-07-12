import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Apartment, RawApartmentResponse } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Transform raw API response to normalized apartment format
export function transformRawApartmentResponse(raw: RawApartmentResponse, id: number): Apartment {
  // Extract values from nested arrays, handling empty arrays gracefully
  const extractInnerText = (arr: Array<{ innerText: string }>) => 
    arr.length > 0 ? arr[0].innerText : '';
  
  const extractSrcValue = (arr: Array<{ src: { name: string; value: string } }>) => 
    arr.map(item => item.src.value);

  // Parse numeric values
  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[\$,]/g, '');
    return parseInt(cleaned) || 0;
  };

  const parseBedrooms = (bedStr: string): number => {
    const match = bedStr.match(/(\d+)\s*bed/i);
    return match ? parseInt(match[1]) : 0;
  };

  const parseBathrooms = (bathStr: string): number => {
    const match = bathStr.match(/(\d+(?:\.\d+)?)\s*bath/i);
    return match ? parseFloat(match[1]) : 0;
  };

  const parseSquareFeet = (sqftStr: string): number | undefined => {
    const match = sqftStr.match(/(\d+)\s*ft²/i);
    return match ? parseInt(match[1]) : undefined;
  };
  const rawBoroText = extractInnerText(raw.boro);
  const boroText = rawBoroText.replace('RENTAL UNIT IN ', '').replace(/\b\w/g, char => char.toUpperCase());
  return {
    id,
    price: parsePrice(extractInnerText(raw.price)),
    bedrooms: parseBedrooms(extractInnerText(raw.beds)),
    bathrooms: parseBathrooms(extractInnerText(raw.baths)),
    squareFeet: parseSquareFeet(extractInnerText(raw.sqft)),
    location: boroText,
    address: raw.general.length > 0 ? raw.general[0].address : '',
    images: extractSrcValue(raw.imageUrls),
    isAvailable: true,
    listingUrl: raw.general.length > 0 ? raw.general[0].listingUrl.value : undefined,
    listedBy: extractInnerText(raw.listedBy),
    leaseTerm: raw.leaseTerm.length > 0 ? extractInnerText(raw.leaseTerm) : undefined,
    netEffective: raw.netEffective.length > 0 ? extractInnerText(raw.netEffective) : undefined,
  };
}

// Function to fetch and transform Supabase apartment data
export async function fetchSupabaseApartments(): Promise<Apartment[]> {
  try {
    console.log("Trying to fetch supabase entries");
    const response = await fetch('/api/listings');
    if (!response.ok) {
      throw new Error('Failed to fetch Supabase apartments');
    }
    const apartmentData: Apartment[] = await response.json();
    
    return apartmentData;
  } catch (error) {
    console.error('Error fetching Supabase apartments:', error);
    return [];
  }
}

export const exampleApartments: Apartment[] = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    description: "A stylish loft in the heart of downtown.",
    price: 2200,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 950,
    location: "Downtown",
    address: "123 Main St, Cityville",
    latitude: "40.7128",
    longitude: "-74.0060",
    images: [
      "https://photos.zillowstatic.com/fp/e5b8ce37137b31884017355f061ba30f-se_large_800_400.webp",
      "https://photos.zillowstatic.com/fp/9f7dafe3786e3cc4411bd07636e14bff-se_large_800_400.webp",
    ],
    amenities: ["Washer/Dryer", "Balcony", "Gym"],
    isAvailable: true,
    createdById: 42,
    distance: "1.2 miles",
  },
  {
    id: 2,
    title: "Cozy Suburban Home",
    price: 1800,
    bedrooms: 3,
    bathrooms: 2,
    location: "Suburbia",
    address: "456 Elm St, Suburbia",
    latitude: "40.7357",
    longitude: "-74.1724",
    images: [
      "https://photos.zillowstatic.com/fp/d95390447576b321cf414aba76dcf272-se_large_800_400.webp",
    ],
    isAvailable: true,
  },
  {
    id: 3,
    title: "Luxury High-Rise Apartment",
    description: "Breathtaking views and luxury amenities.",
    price: 3500,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    location: "Uptown",
    address: "789 Park Ave, Uptown",
    latitude: "40.7488",
    longitude: "-73.9857",
    images: [
      "https://photos.zillowstatic.com/fp/9f1b3b3f0fa1c4790917caeadec57a4f-se_large_800_400.webp",
      "https://photos.zillowstatic.com/fp/1f128e2e4a81f578fb98461571493753-se_large_800_400.webp",
    ],
    amenities: ["Pool", "Concierge", "Pet Friendly"],
    isAvailable: false,
    distance: "0.8 miles",
  },
  {
    id: 4,
    title: "Charming Studio Apartment",
    description: "Compact and efficient living space in a great location.",
    price: 1450,
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 550,
    location: "Midtown",
    address: "101 Center St, Midtown",
    latitude: "40.7392",
    longitude: "-73.9903",
    images: [
      "https://photos.zillowstatic.com/fp/e5b8ce37137b31884017355f061ba30f-se_large_800_400.webp",
    ],
    amenities: ["Laundry", "Rooftop Access"],
    isAvailable: true,
    distance: "1.5 miles",
  },
  {
    id: 5,
    title: "Renovated Brownstone Unit",
    description: "Classic charm with modern updates in historic district.",
    price: 2650,
    bedrooms: 1,
    bathrooms: 1.5,
    squareFeet: 850,
    location: "Historic District",
    address: "35 Heritage Ave, Historic District",
    latitude: "40.7255",
    longitude: "-74.0134",
    images: [
      "https://photos.zillowstatic.com/fp/d95390447576b321cf414aba76dcf272-se_large_800_400.webp",
      "https://photos.zillowstatic.com/fp/9f7dafe3786e3cc4411bd07636e14bff-se_large_800_400.webp",
    ],
    amenities: ["Hardwood Floors", "Fireplace", "Bay Windows"],
    isAvailable: true,
    createdById: 39,
    distance: "0.9 miles",
  },
  {
    id: 6,
    title: "Waterfront Condo",
    description: "Stunning water views and contemporary finishes.",
    price: 3100,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1050,
    location: "Harbor District",
    address: "500 Marina Way, Harbor District",
    latitude: "40.7021",
    longitude: "-74.0156",
    images: [
      "https://photos.zillowstatic.com/fp/9f1b3b3f0fa1c4790917caeadec57a4f-se_large_800_400.webp",
      "https://photos.zillowstatic.com/fp/1f128e2e4a81f578fb98461571493753-se_large_800_400.webp",
    ],
    amenities: ["Waterfront", "Parking", "Doorman"],
    isAvailable: true,
    distance: "2.3 miles",
  },
  {
    id: 7,
    title: "Garden Level Apartment",
    description: "Peaceful retreat with private garden access.",
    price: 1950,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 700,
    location: "Green Hills",
    address: "42 Ivy Lane, Green Hills",
    latitude: "40.7530",
    longitude: "-73.9787",
    images: [
      "https://photos.zillowstatic.com/fp/d95390447576b321cf414aba76dcf272-se_large_800_400.webp",
    ],
    amenities: ["Private Garden", "In-unit Laundry"],
    isAvailable: true,
    distance: "1.7 miles",
  },
];
