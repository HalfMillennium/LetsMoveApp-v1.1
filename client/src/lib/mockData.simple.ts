import type { 
  User, 
  Apartment, 
  Favorite, 
  SearchParty, 
  SearchPartyMember, 
  SearchPartyListing
} from "@shared/schema";

// Example Users (5 users)
export const exampleUsers: User[] = [
  {
    id: 1,
    username: "janesmith",
    password: "hashedpassword123",
    email: "jane@example.com",
    fullName: "Jane Smith",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    username: "johndoe",
    password: "hashedpassword456",
    email: "john@example.com",
    fullName: "John Doe",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 3,
    username: "emilyjohnson",
    password: "hashedpassword789",
    email: "emily@example.com",
    fullName: "Emily Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 4,
    username: "michaelwilson",
    password: "hashedpassword012",
    email: "michael@example.com",
    fullName: "Michael Wilson",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 5,
    username: "sarahdavis",
    password: "hashedpassword345",
    email: "sarah@example.com",
    fullName: "Sarah Davis",
    profileImage: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

// Example Apartments (10 apartments)
export const exampleApartments: Apartment[] = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    description: "Spacious loft with industrial finishes",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    location: "Downtown",
    address: "123 Main St, Downtown",
    latitude: "40.7128",
    longitude: "-74.0060",
    images: ["https://photos.zillowstatic.com/fp/e5b8ce37137b31884017355f061ba30f-se_large_800_400.webp"],
    amenities: ["Washer/Dryer", "Gym", "Rooftop"],
    isAvailable: true,
    createdById: null,
    distance: "0.5 miles"
  },
  {
    id: 2,
    title: "Cozy Uptown Studio",
    description: "Charming studio in the heart of Uptown",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    location: "Uptown",
    address: "456 Oak St, Uptown",
    latitude: "40.7258",
    longitude: "-74.0111",
    images: ["https://photos.zillowstatic.com/fp/9f7dafe3786e3cc4411bd07636e14bff-se_large_800_400.webp"],
    amenities: ["Dishwasher", "Central AC"],
    isAvailable: true,
    createdById: null,
    distance: "1.2 miles"
  },
  {
    id: 3,
    title: "Luxury Midtown Apartment",
    description: "High-end finishes in prestigious building",
    price: 3500,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    location: "Midtown",
    address: "789 Maple Ave, Midtown",
    latitude: "40.7358",
    longitude: "-73.9911",
    images: ["https://photos.zillowstatic.com/fp/d95390447576b321cf414aba76dcf272-se_large_800_400.webp"],
    amenities: ["Doorman", "Pool", "Fitness Center"],
    isAvailable: true,
    createdById: null,
    distance: "0.8 miles"
  },
  {
    id: 4,
    title: "Compact East Side Studio",
    description: "Efficient living space with great views",
    price: 1600,
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 500,
    location: "East Side",
    address: "101 Pine St, East Side",
    latitude: "40.7198",
    longitude: "-73.9801",
    images: ["https://photos.zillowstatic.com/fp/9f1b3b3f0fa1c4790917caeadec57a4f-se_large_800_400.webp"],
    amenities: ["Elevator", "Laundry in Building"],
    isAvailable: true,
    createdById: null,
    distance: "1.5 miles"
  },
  {
    id: 5,
    title: "Historic Brownstone",
    description: "Classic architectural details with modern updates",
    price: 2800,
    bedrooms: 2,
    bathrooms: 1.5,
    squareFeet: 1300,
    location: "Historic District",
    address: "222 Cedar Rd, Historic District",
    latitude: "40.7418",
    longitude: "-74.0060",
    images: ["https://photos.zillowstatic.com/fp/1f128e2e4a81f578fb98461571493753-se_large_800_400.webp"],
    amenities: ["Fireplace", "Hardwood Floors", "Garden Access"],
    isAvailable: true,
    createdById: null,
    distance: "2.1 miles"
  },
  {
    id: 6,
    title: "Waterfront Luxury Condo",
    description: "Breathtaking water views from floor-to-ceiling windows",
    price: 4200,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2000,
    location: "Harbor",
    address: "333 Shore Dr, Harbor",
    latitude: "40.7028",
    longitude: "-74.0200",
    images: ["https://photos.zillowstatic.com/fp/e5b8ce37137b31884017355f061ba30f-se_large_800_400.webp"],
    amenities: ["Balcony", "Concierge", "Valet Parking"],
    isAvailable: true,
    createdById: null,
    distance: "1.7 miles"
  },
  {
    id: 7,
    title: "Garden Apartment",
    description: "Ground floor unit with private garden access",
    price: 2200,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 900,
    location: "West End",
    address: "444 Willow Lane, West End",
    latitude: "40.7458",
    longitude: "-74.0260",
    images: ["https://photos.zillowstatic.com/fp/9f7dafe3786e3cc4411bd07636e14bff-se_large_800_400.webp"],
    amenities: ["Private Garden", "Pet Friendly", "Storage"],
    isAvailable: true,
    createdById: null,
    distance: "2.5 miles"
  },
  {
    id: 8,
    title: "Suburban Townhouse",
    description: "Modern townhouse on quiet street",
    price: 2600,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1600,
    location: "Suburbs",
    address: "555 Elm Court, Suburbs",
    latitude: "40.7558",
    longitude: "-74.0360",
    images: ["https://photos.zillowstatic.com/fp/d95390447576b321cf414aba76dcf272-se_large_800_400.webp"],
    amenities: ["Garage", "Backyard", "Finished Basement"],
    isAvailable: true,
    createdById: null,
    distance: "3.2 miles"
  },
  {
    id: 9,
    title: "Midtown Penthouse",
    description: "Exclusive top floor with private terrace",
    price: 5000,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2200,
    location: "Midtown",
    address: "666 Heights Blvd, Midtown",
    latitude: "40.7318",
    longitude: "-73.9921",
    images: ["https://photos.zillowstatic.com/fp/9f1b3b3f0fa1c4790917caeadec57a4f-se_large_800_400.webp"],
    amenities: ["Private Terrace", "Panoramic Views", "Wine Cellar"],
    isAvailable: true,
    createdById: null,
    distance: "0.6 miles"
  },
  {
    id: 10,
    title: "Downtown Micro-Apartment",
    description: "Innovative design maximizes small space",
    price: 1400,
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 350,
    location: "Downtown",
    address: "777 Tiny Lane, Downtown",
    latitude: "40.7148",
    longitude: "-74.0080",
    images: ["https://photos.zillowstatic.com/fp/1f128e2e4a81f578fb98461571493753-se_large_800_400.webp"],
    amenities: ["Murphy Bed", "Compact Appliances"],
    isAvailable: true,
    createdById: null,
    distance: "0.3 miles"
  }
];

// Example Favorites (7 favorites)
export const exampleFavorites: Favorite[] = [
  {
    id: 1,
    userId: 1,
    apartmentId: 1
  },
  {
    id: 2,
    userId: 1,
    apartmentId: 3
  },
  {
    id: 3,
    userId: 2,
    apartmentId: 2
  },
  {
    id: 4,
    userId: 3,
    apartmentId: 5
  },
  {
    id: 5,
    userId: 4,
    apartmentId: 6
  },
  {
    id: 6,
    userId: 5,
    apartmentId: 4
  },
  {
    id: 7,
    userId: 2,
    apartmentId: 7
  }
];

// Example Search Parties (5 search parties)
export const exampleSearchParties: SearchParty[] = [
  {
    id: 1,
    name: "Downtown Adventure",
    createdById: 1,
    createdAt: new Date("2025-03-01T12:00:00Z")
  },
  {
    id: 2,
    name: "Family Home Hunt",
    createdById: 2,
    createdAt: new Date("2025-03-05T14:30:00Z")
  },
  {
    id: 3,
    name: "Luxury Living",
    createdById: 3,
    createdAt: new Date("2025-03-10T09:15:00Z")
  },
  {
    id: 4,
    name: "Budget Friendly",
    createdById: 4,
    createdAt: new Date("2025-03-15T16:45:00Z")
  },
  {
    id: 5,
    name: "Historic District Search",
    createdById: 5,
    createdAt: new Date("2025-03-20T10:00:00Z")
  }
];

// Example Search Party Members (10 members)
export const exampleSearchPartyMembers: SearchPartyMember[] = [
  {
    id: 1,
    searchPartyId: 1,
    userId: 1,
    role: "owner"
  },
  {
    id: 2,
    searchPartyId: 1,
    userId: 3,
    role: "member"
  },
  {
    id: 3,
    searchPartyId: 1,
    userId: 5,
    role: "member"
  },
  {
    id: 4,
    searchPartyId: 2,
    userId: 2,
    role: "owner"
  },
  {
    id: 5,
    searchPartyId: 2,
    userId: 4,
    role: "member"
  },
  {
    id: 6,
    searchPartyId: 3,
    userId: 3,
    role: "owner"
  },
  {
    id: 7,
    searchPartyId: 3,
    userId: 1,
    role: "member"
  },
  {
    id: 8,
    searchPartyId: 4,
    userId: 4,
    role: "owner"
  },
  {
    id: 9,
    searchPartyId: 5,
    userId: 5,
    role: "owner"
  },
  {
    id: 10,
    searchPartyId: 5,
    userId: 2,
    role: "member"
  }
];

// Example Search Party Listings (10 listings)
export const exampleSearchPartyListings: SearchPartyListing[] = [
  {
    id: 1,
    searchPartyId: 1,
    apartmentId: 1,
    addedById: 1,
    addedAt: new Date("2025-03-02T14:25:00Z"),
    notes: "Great downtown option with modern style"
  },
  {
    id: 2,
    searchPartyId: 1,
    apartmentId: 3,
    addedById: 3,
    addedAt: new Date("2025-03-03T09:15:00Z"),
    notes: "Luxurious option but at a premium price"
  },
  {
    id: 3,
    searchPartyId: 1,
    apartmentId: 4,
    addedById: 5,
    addedAt: new Date("2025-03-04T16:30:00Z"),
    notes: "Compact but efficient and well-located"
  },
  {
    id: 4,
    searchPartyId: 2,
    apartmentId: 2,
    addedById: 2,
    addedAt: new Date("2025-03-06T11:45:00Z"),
    notes: "Perfect suburban home for a family"
  },
  {
    id: 5,
    searchPartyId: 2,
    apartmentId: 5,
    addedById: 4,
    addedAt: new Date("2025-03-07T13:20:00Z"),
    notes: "Beautiful historic brownstone with character"
  },
  {
    id: 6,
    searchPartyId: 3,
    apartmentId: 3,
    addedById: 3,
    addedAt: new Date("2025-03-11T10:05:00Z"),
    notes: "Top luxury pick with great views"
  },
  {
    id: 7,
    searchPartyId: 3,
    apartmentId: 6,
    addedById: 1,
    addedAt: new Date("2025-03-12T15:40:00Z"),
    notes: "Stunning waterfront property"
  },
  {
    id: 8,
    searchPartyId: 4,
    apartmentId: 4,
    addedById: 4,
    addedAt: new Date("2025-03-16T09:30:00Z"),
    notes: "Affordable studio in a good location"
  },
  {
    id: 9,
    searchPartyId: 4,
    apartmentId: 7,
    addedById: 4,
    addedAt: new Date("2025-03-17T14:15:00Z"),
    notes: "Great value with garden access"
  },
  {
    id: 10,
    searchPartyId: 5,
    apartmentId: 5,
    addedById: 5,
    addedAt: new Date("2025-03-21T11:25:00Z"),
    notes: "Classic brownstone in the historic district"
  }
];

// Helper function to generate more apartments for a total of 100
export const generateMoreApartments = (): Apartment[] => {
  const additionalApartments: Apartment[] = [];
  
  // Generate apartments with IDs from 11 to 100
  for (let i = 11; i <= 100; i++) {
    // Alternate between different styles and types
    const type = ['Apartment', 'Condo', 'Studio', 'Loft', 'House'][i % 5];
    const area = ['Downtown', 'Midtown', 'Uptown', 'Suburbs', 'Historic District', 'Harbor', 'West End', 'East Side'][i % 8];
    const bedrooms = (i % 4) + 1; // 1-4 bedrooms
    const bathrooms = Math.floor((i % 5) / 2) + 1; // 1-3 bathrooms
    const price = 1000 + (i * 50); // Prices from $1550 to $6000
    
    const apartment: Apartment = {
      id: i,
      title: `${area} ${type} #${i}`,
      description: `A beautiful ${bedrooms} bedroom ${type.toLowerCase()} in ${area}.`,
      price: price,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      squareFeet: 600 + (i * 10),
      location: area,
      address: `${100 + i} ${['Main', 'Oak', 'Maple', 'Pine', 'Cedar'][i % 5]} St, ${area}`,
      latitude: (40.7 + (i * 0.001)).toString(),
      longitude: (-74.0 + (i * 0.001)).toString(),
      images: [
        "https://photos.zillowstatic.com/fp/e5b8ce37137b31884017355f061ba30f-se_large_800_400.webp",
        "https://photos.zillowstatic.com/fp/9f7dafe3786e3cc4411bd07636e14bff-se_large_800_400.webp"
      ],
      amenities: [
        "Washer/Dryer", 
        "Balcony", 
        "Gym"
      ],
      isAvailable: i % 7 !== 0, // Some apartments unavailable
      createdById: null,
      distance: `${(i % 5) + 0.1} miles`
    };
    
    additionalApartments.push(apartment);
  }
  
  return [...exampleApartments, ...additionalApartments];
};