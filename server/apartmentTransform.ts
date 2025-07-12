// Define the raw response type locally to avoid client imports
export interface RawApartmentResponse {
  beds: Array<{ innerText: string }>;
  boro: Array<{ innerText: string }>;
  sqft: Array<{ innerText: string }>;
  baths: Array<{ innerText: string }>;
  price: Array<{ innerText: string }>;
  general: Array<{
    address: string;
    listingUrl: {
      name: string;
      value: string;
    };
  }>;
  listedBy: Array<{ innerText: string }>;
  imageUrls: Array<{
    src: {
      name: string;
      value: string;
    };
  }>;
  leaseTerm: Array<any>;
  netEffective: Array<any>;
}

import type { Apartment } from "../shared/schema";

// Transform raw API response to normalized apartment format
export function transformRawApartmentResponse(raw: RawApartmentResponse, id: number): Omit<Apartment, 'createdById'> {
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

  const parseSquareFeet = (sqftStr: string): number | null => {
    const match = sqftStr.match(/(\d+)\s*ft²/i);
    return match ? parseInt(match[1]) : null;
  };

  return {
    id,
    title: null, // Will be derived from address or set to null
    description: null,
    price: parsePrice(extractInnerText(raw.price)),
    bedrooms: parseBedrooms(extractInnerText(raw.beds)),
    bathrooms: parseBathrooms(extractInnerText(raw.baths)),
    squareFeet: parseSquareFeet(extractInnerText(raw.sqft)),
    location: extractInnerText(raw.boro),
    address: raw.general.length > 0 ? raw.general[0].address : '',
    latitude: null,
    longitude: null,
    images: extractSrcValue(raw.imageUrls),
    amenities: null,
    isAvailable: true,
    distance: null,
    listingUrl: raw.general.length > 0 ? raw.general[0].listingUrl.value : null,
    listedBy: extractInnerText(raw.listedBy) || null,
    leaseTerm: raw.leaseTerm.length > 0 ? extractInnerText(raw.leaseTerm) : null,
    netEffective: raw.netEffective.length > 0 ? extractInnerText(raw.netEffective) : null,
  };
}