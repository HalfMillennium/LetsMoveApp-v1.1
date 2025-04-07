import type { 
  User, 
  Apartment, 
  Favorite, 
  SearchParty, 
  SearchPartyMember, 
  SearchPartyListing
} from "@shared/schema";
import { exampleApartments } from "./utils";

// Get a date object from string for mocking
const toDate = (dateStr: string): Date => new Date(dateStr);

// Example Users
export const exampleUsers: User[] = [
  {
    id: 1,
    username: "janesmith",
    password: "hashedpassword123",
    email: "jane@example.com",
    fullName: "Jane Smith",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg"
  } as User,
  {
    id: 2,
    username: "johndoe",
    password: "hashedpassword456",
    email: "john@example.com",
    fullName: "John Doe",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg"
  } as User,
  {
    id: 3,
    username: "emilyjohnson",
    password: "hashedpassword789",
    email: "emily@example.com",
    fullName: "Emily Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg"
  } as User,
  {
    id: 4,
    username: "michaelwilson",
    password: "hashedpassword012",
    email: "michael@example.com",
    fullName: "Michael Wilson",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg"
  } as User,
  {
    id: 5,
    username: "sarahdavis",
    password: "hashedpassword345",
    email: "sarah@example.com",
    fullName: "Sarah Davis",
    profileImage: "https://randomuser.me/api/portraits/women/3.jpg"
  } as User
];

// Example Favorites
export const exampleFavorites: Favorite[] = [
  {
    id: 1,
    userId: 1,
    apartmentId: 1,
    notes: "Love the location and style!"
  },
  {
    id: 2,
    userId: 1,
    apartmentId: 3,
    notes: "Great amenities but a bit pricey"
  },
  {
    id: 3,
    userId: 2,
    apartmentId: 2,
    notes: "Perfect size for family"
  },
  {
    id: 4,
    userId: 3,
    apartmentId: 5,
    notes: "Love the historic charm"
  },
  {
    id: 5,
    userId: 4,
    apartmentId: 6,
    notes: "Amazing waterfront view"
  },
  {
    id: 6,
    userId: 5,
    apartmentId: 4,
    notes: "Compact but efficient space"
  },
  {
    id: 7,
    userId: 2,
    apartmentId: 7,
    notes: "Garden access is a huge plus"
  }
];

// Example Search Parties
export const exampleSearchParties: SearchParty[] = [
  {
    id: 1,
    name: "Downtown Adventure",
    description: "Looking for the perfect downtown apartment with friends",
    createdAt: "2025-03-01T12:00:00Z",
    createdById: 1,
    members: []
  },
  {
    id: 2,
    name: "Family Home Hunt",
    description: "Searching for a family-friendly home in the suburbs",
    createdAt: "2025-03-05T14:30:00Z",
    createdById: 2,
    members: []
  },
  {
    id: 3,
    name: "Luxury Living",
    description: "Exploring high-end apartments with premium amenities",
    createdAt: "2025-03-10T09:15:00Z",
    createdById: 3,
    members: []
  },
  {
    id: 4,
    name: "Budget Friendly",
    description: "Finding affordable apartments with good value",
    createdAt: "2025-03-15T16:45:00Z",
    createdById: 4,
    members: []
  },
  {
    id: 5,
    name: "Historic District Search",
    description: "Looking for charming properties in historic areas",
    createdAt: "2025-03-20T10:00:00Z",
    createdById: 5,
    members: []
  }
];

// Example Search Party Members
export const exampleSearchPartyMembers: SearchPartyMember[] = [
  {
    id: 1,
    searchPartyId: 1,
    userId: 1,
    role: "owner",
    user: exampleUsers[0]
  },
  {
    id: 2,
    searchPartyId: 1,
    userId: 3,
    role: "member",
    user: exampleUsers[2]
  },
  {
    id: 3,
    searchPartyId: 1,
    userId: 5,
    role: "member",
    user: exampleUsers[4]
  },
  {
    id: 4,
    searchPartyId: 2,
    userId: 2,
    role: "owner",
    user: exampleUsers[1]
  },
  {
    id: 5,
    searchPartyId: 2,
    userId: 4,
    role: "member",
    user: exampleUsers[3]
  },
  {
    id: 6,
    searchPartyId: 3,
    userId: 3,
    role: "owner",
    user: exampleUsers[2]
  },
  {
    id: 7,
    searchPartyId: 3,
    userId: 1,
    role: "member",
    user: exampleUsers[0]
  },
  {
    id: 8,
    searchPartyId: 4,
    userId: 4,
    role: "owner",
    user: exampleUsers[3]
  },
  {
    id: 9,
    searchPartyId: 5,
    userId: 5,
    role: "owner",
    user: exampleUsers[4]
  },
  {
    id: 10,
    searchPartyId: 5,
    userId: 2,
    role: "member",
    user: exampleUsers[1]
  }
];

// Attach members to search parties
exampleSearchParties.forEach(searchParty => {
  searchParty.members = exampleSearchPartyMembers.filter(
    member => member.searchPartyId === searchParty.id
  );
});

// Example Search Party Listings
export const exampleSearchPartyListings: SearchPartyListing[] = [
  {
    id: 1,
    searchPartyId: 1,
    apartmentId: 1,
    addedById: 1,
    addedAt: "2025-03-02T14:25:00Z",
    notes: "Great downtown option with modern style",
    apartment: exampleApartments[0]
  },
  {
    id: 2,
    searchPartyId: 1,
    apartmentId: 3,
    addedById: 3,
    addedAt: "2025-03-03T09:15:00Z",
    notes: "Luxurious option but at a premium price",
    apartment: exampleApartments[2]
  },
  {
    id: 3,
    searchPartyId: 1,
    apartmentId: 4,
    addedById: 5,
    addedAt: "2025-03-04T16:30:00Z",
    notes: "Compact but efficient and well-located",
    apartment: exampleApartments[3]
  },
  {
    id: 4,
    searchPartyId: 2,
    apartmentId: 2,
    addedById: 2,
    addedAt: "2025-03-06T11:45:00Z",
    notes: "Perfect suburban home for a family",
    apartment: exampleApartments[1]
  },
  {
    id: 5,
    searchPartyId: 2,
    apartmentId: 5,
    addedById: 4,
    addedAt: "2025-03-07T13:20:00Z",
    notes: "Beautiful historic brownstone with character",
    apartment: exampleApartments[4]
  },
  {
    id: 6,
    searchPartyId: 3,
    apartmentId: 3,
    addedById: 3,
    addedAt: "2025-03-11T10:05:00Z",
    notes: "Top luxury pick with great views",
    apartment: exampleApartments[2]
  },
  {
    id: 7,
    searchPartyId: 3,
    apartmentId: 6,
    addedById: 1,
    addedAt: "2025-03-12T15:40:00Z",
    notes: "Stunning waterfront property",
    apartment: exampleApartments[5]
  },
  {
    id: 8,
    searchPartyId: 4,
    apartmentId: 4,
    addedById: 4,
    addedAt: "2025-03-16T09:30:00Z",
    notes: "Affordable studio in a good location",
    apartment: exampleApartments[3]
  },
  {
    id: 9,
    searchPartyId: 4,
    apartmentId: 7,
    addedById: 4,
    addedAt: "2025-03-17T14:15:00Z",
    notes: "Great value with garden access",
    apartment: exampleApartments[6]
  },
  {
    id: 10,
    searchPartyId: 5,
    apartmentId: 5,
    addedById: 5,
    addedAt: "2025-03-21T11:25:00Z",
    notes: "Classic brownstone in the historic district",
    apartment: exampleApartments[4]
  }
];

// Add a lot more apartments to have a large dataset
export const generateMoreApartments = (): Apartment[] => {
  const additionalApartments: Apartment[] = [];
  
  // Generate 93 more apartments to have a total of 100
  for (let i = 8; i <= 100; i++) {
    // Alternate between different styles and types
    const type = ['Apartment', 'Condo', 'Studio', 'Loft', 'House'][i % 5];
    const area = ['Downtown', 'Midtown', 'Uptown', 'Suburbs', 'Historic District', 'Harbor', 'West End', 'East Side'][i % 8];
    const bedrooms = (i % 4) + 1; // 1-4 bedrooms
    const bathrooms = Math.floor((i % 5) / 2) + 1; // 1-3 bathrooms
    const price = 1000 + (i * 50); // Prices from $1400 to $6000
    const imageIndex = i % 3; // Cycle through available images
    
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
        [
          "https://photos.zillowstatic.com/fp/e5b8ce37137b31884017355f061ba30f-se_large_800_400.webp",
          "https://photos.zillowstatic.com/fp/9f7dafe3786e3cc4411bd07636e14bff-se_large_800_400.webp",
        ],
        [
          "https://photos.zillowstatic.com/fp/d95390447576b321cf414aba76dcf272-se_large_800_400.webp",
        ],
        [
          "https://photos.zillowstatic.com/fp/9f1b3b3f0fa1c4790917caeadec57a4f-se_large_800_400.webp",
          "https://photos.zillowstatic.com/fp/1f128e2e4a81f578fb98461571493753-se_large_800_400.webp",
        ]
      ][imageIndex],
      amenities: [
        ["Washer/Dryer", "Balcony", "Gym"],
        ["Parking", "Pool", "Pet Friendly"],
        ["Hardwood Floors", "Dishwasher", "Central AC"],
        ["Rooftop", "Doorman", "Elevator"],
        ["In-Unit Laundry", "Storage", "Fireplace"]
      ][i % 5],
      isAvailable: i % 7 !== 0, // Some apartments unavailable
      distance: `${(i % 5) + 0.1} miles`,
    };
    
    additionalApartments.push(apartment);
  }
  
  return [...exampleApartments, ...additionalApartments];
};

// Generate additional favorites
export const generateMoreFavorites = (users: User[], apartments: Apartment[]): Favorite[] => {
  const additionalFavorites: Favorite[] = [];
  let idCounter = exampleFavorites.length + 1;
  
  // Generate about 50 more favorites
  users.forEach((user) => {
    // Each user favorites several apartments
    const numFavorites = Math.floor(Math.random() * 10) + 3; // 3-12 favorites per user
    
    for (let i = 0; i < numFavorites; i++) {
      const apartmentIndex = Math.floor(Math.random() * apartments.length);
      
      // Check if this favorite already exists
      const exists = [...exampleFavorites, ...additionalFavorites].some(
        fav => fav.userId === user.id && fav.apartmentId === apartments[apartmentIndex].id
      );
      
      if (!exists) {
        additionalFavorites.push({
          id: idCounter++,
          userId: user.id,
          apartmentId: apartments[apartmentIndex].id,
          notes: `Favorited on ${new Date().toLocaleDateString()}`
        });
      }
    }
  });
  
  return [...exampleFavorites, ...additionalFavorites];
};

// Generate more search party listings
export const generateMoreSearchPartyListings = (searchParties: SearchParty[], apartments: Apartment[]): SearchPartyListing[] => {
  const additionalListings: SearchPartyListing[] = [];
  let idCounter = exampleSearchPartyListings.length + 1;
  
  // For each search party
  searchParties.forEach((searchParty) => {
    // Add 5-15 apartments to each search party
    const numListings = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < numListings; i++) {
      const apartmentIndex = Math.floor(Math.random() * apartments.length);
      const apartment = apartments[apartmentIndex];
      
      // Check if this apartment is already in this search party
      const exists = [...exampleSearchPartyListings, ...additionalListings].some(
        listing => listing.searchPartyId === searchParty.id && listing.apartmentId === apartment.id
      );
      
      if (!exists) {
        // Find a member who added this listing
        const memberIndex = searchParty.members && searchParty.members.length > 0 
          ? Math.floor(Math.random() * searchParty.members.length) 
          : 0;
        const member = searchParty.members && searchParty.members.length > 0 
          ? searchParty.members[memberIndex] 
          : { userId: searchParty.createdById };
        
        // Generate a date in the last month
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        additionalListings.push({
          id: idCounter++,
          searchPartyId: searchParty.id,
          apartmentId: apartment.id,
          addedById: member.userId,
          addedAt: date.toISOString(),
          notes: getRandomNote(),
          apartment: apartment
        });
      }
    }
  });
  
  return [...exampleSearchPartyListings, ...additionalListings];
};

// Helper function for generating random notes
function getRandomNote(): string {
  const notes = [
    "Really like this one!",
    "Good price for the area",
    "Nice amenities",
    "Great location",
    "Spacious layout",
    "Recently renovated",
    "Close to public transit",
    "Beautiful view",
    "Quiet neighborhood",
    "Good natural light",
    "Modern appliances",
    "High ceilings",
    "Pet-friendly",
    "In-unit laundry is a plus",
    "Good storage space",
    "Available now",
    "Parking included",
    "Utilities included",
    "Flexible lease terms",
    "Security deposit negotiable"
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
}