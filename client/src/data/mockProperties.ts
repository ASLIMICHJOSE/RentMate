import type { Property, PropertyFilters, PropertyImage } from '../types/property';

/**
 * MOCK DATA - Milestone 2 only.
 *
 * These fixtures let the UI, loading/empty/error states and filtering forms be
 * built before the database exists. Milestone 7 replaces this module with real
 * `/api/properties` queries; nothing else in the app should import fixtures.
 */

const imageA: PropertyImage = { id: 'img-1', imageUrl: '/images/property-1.svg', sortOrder: 0 };
const imageB: PropertyImage = { id: 'img-2', imageUrl: '/images/property-2.svg', sortOrder: 1 };
const imageC: PropertyImage = { id: 'img-3', imageUrl: '/images/property-3.svg', sortOrder: 2 };

const allImages = [imageA, imageB, imageC];
const galleryAB = [imageA, imageB];
const galleryBC = [imageB, imageC];
const galleryCB = [imageC, imageB];
const galleryCA = [imageC, imageA];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'a3f1c4d2-1111-4a11-9c11-000000000001',
    title: 'Sunlit 2BHK near Anna University',
    description:
      'Quiet second-floor flat a 10 minute walk from the Anna University gate. Two spacious bedrooms with wardrobes, a modular kitchen and a balcony that catches the morning sun. Water and power backup are included in the rent.',
    rent: 18500,
    deposit: 37000,
    city: 'Chennai',
    locality: 'Guindy',
    address: '4th Cross Street, Guindy, Chennai 600032',
    propertyType: 'APARTMENT',
    bedrooms: 2,
    bathrooms: 2,
    furnished: true,
    areaSqft: 980,
    availableFrom: '2026-10-01',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'KITCHEN', 'AC', 'POWER_BACKUP', 'WATER_SUPPLY', 'PARKING'],
    images: allImages,
    owner: {
      id: 'owner-1',
      name: 'Priya Raghavan',
      avatarUrl: null,
      phone: '+91 98400 11223',
      memberSince: '2024-06-01',
      verified: true,
    },
    createdAt: '2026-09-02T09:15:00.000Z',
    updatedAt: '2026-09-10T11:00:00.000Z',
  },
  {
    id: 'a3f1c4d2-2222-4a11-9c11-000000000002',
    title: 'Single room in a friendly 3BHK flat',
    description:
      'One private room in a shared flat with two final-year students. Common living room, washing machine and a cook who visits twice a day. Perfect for someone who wants company without hostel rules.',
    rent: 9500,
    deposit: 19000,
    city: 'Chennai',
    locality: 'Velachery',
    address: 'Vijayanagar, Velachery, Chennai 600042',
    propertyType: 'SHARED_ROOM',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 320,
    availableFrom: '2026-09-20',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'KITCHEN', 'LAUNDRY', 'MEALS', 'WATER_SUPPLY'],
    images: galleryBC,
    owner: {
      id: 'owner-2',
      name: 'Arun Kumar',
      avatarUrl: null,
      phone: '+91 90031 44556',
      memberSince: '2025-01-12',
      verified: true,
    },
    createdAt: '2026-09-05T14:40:00.000Z',
    updatedAt: '2026-09-05T14:40:00.000Z',
  },
  {
    id: 'a3f1c4d2-3333-4a11-9c11-000000000003',
    title: 'Modern studio with rooftop access',
    description:
      'Compact furnished studio in the heart of Koramangala, ideal for a working student. Includes a kitchenette, high-speed fibre internet and access to a shared rooftop. Metro station is 400 m away.',
    rent: 22000,
    deposit: 44000,
    city: 'Bengaluru',
    locality: 'Koramangala',
    address: '5th Block, Koramangala, Bengaluru 560095',
    propertyType: 'STUDIO',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 420,
    availableFrom: '2026-11-01',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'AC', 'KITCHEN', 'SECURITY', 'GYM', 'POWER_BACKUP'],
    images: allImages,
    owner: {
      id: 'owner-3',
      name: 'Neha Shetty',
      avatarUrl: null,
      phone: '+91 98867 33445',
      memberSince: '2025-08-20',
      verified: false,
    },
    createdAt: '2026-09-08T07:30:00.000Z',
    updatedAt: '2026-09-12T16:20:00.000Z',
  },
  {
    id: 'a3f1c4d2-4444-4a11-9c11-000000000004',
    title: 'Budget PG for girls near VIT',
    description:
      'Clean paying-guest accommodation with twin-sharing rooms, three meals a day, laundry and a warden on site. Study hall open until midnight and a generator for exam season.',
    rent: 7800,
    deposit: 7800,
    city: 'Vellore',
    locality: 'Katpadi',
    address: 'Katpadi Road, Vellore 632014',
    propertyType: 'PG',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 240,
    availableFrom: '2026-09-18',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'MEALS', 'LAUNDRY', 'SECURITY', 'POWER_BACKUP', 'WATER_SUPPLY'],
    images: galleryCB,
    owner: {
      id: 'owner-4',
      name: 'Lakshmi Narayanan',
      avatarUrl: null,
      phone: '+91 94440 77889',
      memberSince: '2023-11-02',
      verified: true,
    },
    createdAt: '2026-09-09T10:05:00.000Z',
    updatedAt: '2026-09-09T10:05:00.000Z',
  },
  {
    id: 'a3f1c4d2-5555-4a11-9c11-000000000005',
    title: 'Spacious 3BHK house with garden',
    description:
      'Independent house with three bedrooms, a large garden and covered parking for two cars. Suits a group of four students who want to share. Borewell plus corporation water, and a solar water heater.',
    rent: 32000,
    deposit: 64000,
    city: 'Pune',
    locality: 'Kothrud',
    address: 'Dahanukar Colony, Kothrud, Pune 411038',
    propertyType: 'HOUSE',
    bedrooms: 3,
    bathrooms: 3,
    furnished: false,
    areaSqft: 1650,
    availableFrom: '2026-10-15',
    status: 'PUBLISHED',
    amenities: ['PARKING', 'KITCHEN', 'WATER_SUPPLY', 'POWER_BACKUP', 'SECURITY'],
    images: allImages,
    owner: {
      id: 'owner-5',
      name: 'Rohit Deshmukh',
      avatarUrl: null,
      phone: '+91 98220 55667',
      memberSince: '2024-02-17',
      verified: true,
    },
    createdAt: '2026-09-10T12:00:00.000Z',
    updatedAt: '2026-09-10T12:00:00.000Z',
  },
  {
    id: 'a3f1c4d2-6666-4a11-9c11-000000000006',
    title: 'Hostel bed near Hitec City',
    description:
      'Triple-sharing hostel bed with attached washroom, housekeeping twice a week and a shuttle to the tech park in the morning. Cafeteria in the building.',
    rent: 6500,
    deposit: 6500,
    city: 'Hyderabad',
    locality: 'Gachibowli',
    address: 'Serilingampally, Gachibowli, Hyderabad 500032',
    propertyType: 'HOSTEL',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 180,
    availableFrom: '2026-09-25',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'MEALS', 'LAUNDRY', 'SECURITY', 'GYM'],
    images: galleryAB,
    owner: {
      id: 'owner-6',
      name: 'Sana Fatima',
      avatarUrl: null,
      phone: '+91 90000 12345',
      memberSince: '2025-04-04',
      verified: false,
    },
    createdAt: '2026-09-11T08:45:00.000Z',
    updatedAt: '2026-09-11T08:45:00.000Z',
  },
  {
    id: 'a3f1c4d2-7777-4a11-9c11-000000000007',
    title: 'Bright 1BHK on Anna Salai',
    description:
      'A well-kept one-bedroom flat on the fourth floor with lift access. Walking distance to bus stops and two metro stations. Ideal for a single working professional or student couple.',
    rent: 15500,
    deposit: 31000,
    city: 'Chennai',
    locality: 'Teynampet',
    address: 'Anna Salai, Teynampet, Chennai 600018',
    propertyType: 'APARTMENT',
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    areaSqft: 620,
    availableFrom: '2026-09-30',
    status: 'PENDING',
    amenities: ['WIFI', 'WATER_SUPPLY', 'PARKING'],
    images: allImages,
    owner: {
      id: 'owner-7',
      name: 'Deepa Krishnan',
      avatarUrl: null,
      phone: '+91 91760 22110',
      memberSince: '2025-09-29',
      verified: false,
    },
    createdAt: '2026-09-13T17:10:00.000Z',
    updatedAt: '2026-09-13T17:10:00.000Z',
  },
  {
    id: 'a3f1c4d2-8888-4a11-9c11-000000000008',
    title: 'Twin-sharing room in new 2BHK',
    description:
      'Freshly painted room in a two-bedroom flat shared with an intern. Includes a study desk, wardrobe and fast internet. Flatmate keeps the place tidy and studies late.',
    rent: 11000,
    deposit: 22000,
    city: 'Bengaluru',
    locality: 'Jayanagar',
    address: '4th Block, Jayanagar, Bengaluru 560011',
    propertyType: 'SHARED_ROOM',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 280,
    availableFrom: '2026-10-05',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'KITCHEN', 'LAUNDRY', 'AC'],
    images: galleryCA,
    owner: {
      id: 'owner-8',
      name: 'Vikram Menon',
      avatarUrl: null,
      phone: '+91 99862 44332',
      memberSince: '2024-12-15',
      verified: true,
    },
    createdAt: '2026-09-14T06:25:00.000Z',
    updatedAt: '2026-09-14T06:25:00.000Z',
  },
];

/**
 * Client-side filter used ONLY while discovery runs on mock data.
 *
 * Milestone 7 pushes every one of these predicates into the database query.
 */
export function filterMockProperties(properties: Property[], filters: PropertyFilters): Property[] {
  const query = filters.q.trim().toLowerCase();
  const minRent = filters.minRent ? Number(filters.minRent) : null;
  const maxRent = filters.maxRent ? Number(filters.maxRent) : null;
  const bedrooms = filters.bedrooms ? Number(filters.bedrooms) : null;

  const filtered = properties.filter((property) => {
    if (query) {
      const haystack =
        `${property.title} ${property.city} ${property.locality} ${property.description}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.city && property.city !== filters.city) return false;

    if (minRent !== null && property.rent < minRent) return false;
    if (maxRent !== null && property.rent > maxRent) return false;

    if (filters.propertyType && property.propertyType !== filters.propertyType) return false;

    // "4" is treated as "4 or more bedrooms".
    if (bedrooms !== null) {
      if (bedrooms >= 4 ? property.bedrooms < 4 : property.bedrooms !== bedrooms) return false;
    }

    if (filters.furnished !== '' && String(property.furnished) !== filters.furnished) return false;

    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((amenity) => property.amenities.includes(amenity));
      if (!hasAll) return false;
    }

    return true;
  });

  return sortProperties(filtered, filters.sort);
}

export function sortProperties(properties: Property[], sort: PropertyFilters['sort']): Property[] {
  const sorted = [...properties];

  switch (sort) {
    case 'rent-asc':
      return sorted.sort((a, b) => a.rent - b.rent);
    case 'rent-desc':
      return sorted.sort((a, b) => b.rent - a.rent);
    case 'newest':
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

/** Distinct cities present in the mock data, for the filter panel. */
export function getMockCityOptions(): string[] {
  return [...new Set(MOCK_PROPERTIES.map((property) => property.city))].sort();
}

export function findMockProperty(id: string): Property | undefined {
  return MOCK_PROPERTIES.find((property) => property.id === id);
}

export function getMockSavedProperties(): Property[] {
  return MOCK_PROPERTIES.filter((property) =>
    ['a3f1c4d2-1111-4a11-9c11-000000000001', 'a3f1c4d2-3333-4a11-9c11-000000000003'].includes(
      property.id,
    ),
  );
}
