import type { Property, PropertyFilters, PropertyType, ListingStatus, Amenity } from '../types/property';
import type { RoommateMatch, RoommateProfile, SleepSchedule, FoodPreference, SmokingPreference, CleanlinessLevel, GenderPreference, CompatibilityFactor, FactorMatch } from '../types/roommate';
import type { CurrentUser, UserRole } from '../types/user';

// Storage Keys
const PROPERTIES_KEY = 'rentmate_properties_v2';
const SAVED_KEY = 'rentmate_saved_properties_v2';
const VISITS_KEY = 'rentmate_visits_v2';
const ROOMMATE_REQUESTS_KEY = 'rentmate_roommate_requests_v2';
const CONVERSATIONS_KEY = 'rentmate_conversations_v2';
const MESSAGES_KEY = 'rentmate_messages_v2';
const REVIEWS_KEY = 'rentmate_reviews_v2';
const USERS_KEY = 'rentmate_users_v2';
const REPORTS_KEY = 'rentmate_reports_v2';

export interface VisitRequestItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyCity: string;
  propertyImage: string;
  rent: number;
  ownerId: string;
  ownerName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredDate: string;
  preferredSlot: 'Morning (9 AM - 12 PM)' | 'Afternoon (1 PM - 4 PM)' | 'Evening (5 PM - 8 PM)';
  note?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface RoommateRequestItem {
  id: string;
  senderId: string;
  senderName: string;
  senderCity: string;
  senderOccupation: string;
  receiverId: string;
  receiverName: string;
  compatibilityScore: number;
  note: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string | null;
  propertyId?: string;
  propertyTitle?: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  authorId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface PlatformReport {
  id: string;
  targetType: 'PROPERTY' | 'USER' | 'MESSAGE';
  targetId: string;
  targetTitle: string;
  reporterName: string;
  reason: string;
  details: string;
  status: 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  city: string;
  occupation: string;
  phone: string;
  createdAt: string;
}

// High Quality Curated Imagery
export const CURATED_PROPERTY_IMAGES = {
  studio: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  ],
  apartment: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
  ],
  sharedRoom: [
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  ],
  penthouse: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  ],
};

// Initial Seed Data
const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Sunlit 2BHK near Anna University & Guindy Metro',
    description:
      'Quiet second-floor flat a 10 minute walk from the Anna University gate. Two spacious bedrooms with wardrobes, a modular kitchen and a balcony that catches the morning sun. High-speed fiber Wi-Fi, water supply and full power backup are included.',
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
    availableFrom: '2026-11-01',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'KITCHEN', 'AC', 'POWER_BACKUP', 'WATER_SUPPLY', 'PARKING', 'SECURITY'],
    images: [
      { id: 'img-1-1', imageUrl: CURATED_PROPERTY_IMAGES.apartment[0], sortOrder: 0 },
      { id: 'img-1-2', imageUrl: CURATED_PROPERTY_IMAGES.apartment[1], sortOrder: 1 },
      { id: 'img-1-3', imageUrl: CURATED_PROPERTY_IMAGES.apartment[2], sortOrder: 2 },
    ],
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
    id: 'prop-2',
    title: 'Modern Twin-Sharing Room in Friendly Flatshare',
    description:
      'One private room in a shared 3BHK flat with two final-year engineering students. Features a common living room, automatic washing machine, high-speed Wi-Fi and a cook who prepares fresh meals twice a day.',
    rent: 9500,
    deposit: 19000,
    city: 'Chennai',
    locality: 'Velachery',
    address: 'Vijayanagar 2nd Main Rd, Velachery, Chennai 600042',
    propertyType: 'SHARED_ROOM',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 340,
    availableFrom: '2026-10-15',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'KITCHEN', 'LAUNDRY', 'MEALS', 'WATER_SUPPLY', 'POWER_BACKUP'],
    images: [
      { id: 'img-2-1', imageUrl: CURATED_PROPERTY_IMAGES.sharedRoom[0], sortOrder: 0 },
      { id: 'img-2-2', imageUrl: CURATED_PROPERTY_IMAGES.sharedRoom[1], sortOrder: 1 },
      { id: 'img-2-3', imageUrl: CURATED_PROPERTY_IMAGES.sharedRoom[2], sortOrder: 2 },
    ],
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
    id: 'prop-3',
    title: 'Minimalist Designer Studio with High-Speed Fiber',
    description:
      'Compact furnished studio in the heart of Koramangala 5th Block, ideal for a working student or developer. Includes dedicated ergonomic workstation, kitchenette, microwave, and rooftop access with skyline view. Metro station is 400m away.',
    rent: 22000,
    deposit: 44000,
    city: 'Bengaluru',
    locality: 'Koramangala',
    address: '5th Block, Koramangala, Bengaluru 560095',
    propertyType: 'STUDIO',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 450,
    availableFrom: '2026-11-01',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'AC', 'KITCHEN', 'SECURITY', 'GYM', 'POWER_BACKUP', 'LAUNDRY'],
    images: [
      { id: 'img-3-1', imageUrl: CURATED_PROPERTY_IMAGES.studio[0], sortOrder: 0 },
      { id: 'img-3-2', imageUrl: CURATED_PROPERTY_IMAGES.studio[1], sortOrder: 1 },
      { id: 'img-3-3', imageUrl: CURATED_PROPERTY_IMAGES.studio[2], sortOrder: 2 },
    ],
    owner: {
      id: 'owner-3',
      name: 'Neha Shetty',
      avatarUrl: null,
      phone: '+91 98801 77889',
      memberSince: '2024-11-20',
      verified: true,
    },
    createdAt: '2026-09-08T11:20:00.000Z',
    updatedAt: '2026-09-12T16:00:00.000Z',
  },
  {
    id: 'prop-4',
    title: 'Premium Co-Living Studio near IIT Madras Tech Park',
    description:
      'Brand new luxury co-living studio unit. Comes fully furnished with air conditioning, 300 Mbps leased line internet, attached private bath, smart TV and access to shared community lounge, gym and cafe.',
    rent: 16000,
    deposit: 32000,
    city: 'Chennai',
    locality: 'Taramani',
    address: 'Kanagam Rd, Taramani, Chennai 600113',
    propertyType: 'STUDIO',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 380,
    availableFrom: '2026-10-20',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'AC', 'GYM', 'SECURITY', 'POWER_BACKUP', 'LAUNDRY', 'MEALS'],
    images: [
      { id: 'img-4-1', imageUrl: CURATED_PROPERTY_IMAGES.penthouse[0], sortOrder: 0 },
      { id: 'img-4-2', imageUrl: CURATED_PROPERTY_IMAGES.penthouse[1], sortOrder: 1 },
    ],
    owner: {
      id: 'owner-1',
      name: 'Priya Raghavan',
      avatarUrl: null,
      phone: '+91 98400 11223',
      memberSince: '2024-06-01',
      verified: true,
    },
    createdAt: '2026-09-14T08:00:00.000Z',
    updatedAt: '2026-09-14T08:00:00.000Z',
  },
  {
    id: 'prop-5',
    title: 'Bright 3BHK Apartment close to HITEC City & Metro',
    description:
      'Spacious high-rise apartment on the 12th floor with panoramic city views. Master bedroom with ensuite bath, contemporary kitchen, spacious dining hall, 24/7 security and covered basement parking.',
    rent: 28000,
    deposit: 56000,
    city: 'Hyderabad',
    locality: 'Madhapur',
    address: 'Near Cyber Towers, Madhapur, Hyderabad 500081',
    propertyType: 'APARTMENT',
    bedrooms: 3,
    bathrooms: 3,
    furnished: true,
    areaSqft: 1420,
    availableFrom: '2026-11-15',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'PARKING', 'AC', 'GYM', 'SECURITY', 'POWER_BACKUP', 'KITCHEN'],
    images: [
      { id: 'img-5-1', imageUrl: CURATED_PROPERTY_IMAGES.apartment[1], sortOrder: 0 },
      { id: 'img-5-2', imageUrl: CURATED_PROPERTY_IMAGES.apartment[2], sortOrder: 1 },
    ],
    owner: {
      id: 'owner-2',
      name: 'Arun Kumar',
      avatarUrl: null,
      phone: '+91 90031 44556',
      memberSince: '2025-01-12',
      verified: true,
    },
    createdAt: '2026-09-18T10:30:00.000Z',
    updatedAt: '2026-09-18T10:30:00.000Z',
  },
  {
    id: 'prop-6',
    title: 'Student PG Suite near Fergusson College',
    description:
      'Clean paying-guest accommodation with twin-sharing rooms, three healthy home-style meals a day, laundry service, study hall open till 1 AM and backup generator for quiet exam prep.',
    rent: 8500,
    deposit: 15000,
    city: 'Pune',
    locality: 'Shivajinagar',
    address: 'FC Road, Shivajinagar, Pune 411004',
    propertyType: 'PG',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 280,
    availableFrom: '2026-10-10',
    status: 'PUBLISHED',
    amenities: ['WIFI', 'MEALS', 'LAUNDRY', 'POWER_BACKUP', 'WATER_SUPPLY', 'SECURITY'],
    images: [
      { id: 'img-6-1', imageUrl: CURATED_PROPERTY_IMAGES.sharedRoom[1], sortOrder: 0 },
      { id: 'img-6-2', imageUrl: CURATED_PROPERTY_IMAGES.sharedRoom[2], sortOrder: 1 },
    ],
    owner: {
      id: 'owner-3',
      name: 'Neha Shetty',
      avatarUrl: null,
      phone: '+91 98801 77889',
      memberSince: '2024-11-20',
      verified: true,
    },
    createdAt: '2026-09-19T14:15:00.000Z',
    updatedAt: '2026-09-19T14:15:00.000Z',
  },
  {
    id: 'prop-7',
    title: 'Penthouse 1BHK with Garden Terrace in Indiranagar',
    description:
      'Private penthouse floor with wooden terrace deck, open airy living plan, modular kitchen with bar counter, air conditioning, and quiet tree-lined street access.',
    rent: 26000,
    deposit: 52000,
    city: 'Bengaluru',
    locality: 'Indiranagar',
    address: '100 Feet Rd, Indiranagar, Bengaluru 560038',
    propertyType: 'APARTMENT',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    areaSqft: 750,
    availableFrom: '2026-11-01',
    status: 'PENDING',
    amenities: ['WIFI', 'AC', 'PARKING', 'KITCHEN', 'POWER_BACKUP', 'SECURITY'],
    images: [
      { id: 'img-7-1', imageUrl: CURATED_PROPERTY_IMAGES.penthouse[1], sortOrder: 0 },
      { id: 'img-7-2', imageUrl: CURATED_PROPERTY_IMAGES.penthouse[0], sortOrder: 1 },
    ],
    owner: {
      id: 'owner-1',
      name: 'Priya Raghavan',
      avatarUrl: null,
      phone: '+91 98400 11223',
      memberSince: '2024-06-01',
      verified: true,
    },
    createdAt: '2026-09-22T08:00:00.000Z',
    updatedAt: '2026-09-22T08:00:00.000Z',
  },
];

const INITIAL_VISITS: VisitRequestItem[] = [
  {
    id: 'visit-1',
    propertyId: 'prop-1',
    propertyTitle: 'Sunlit 2BHK near Anna University & Guindy Metro',
    propertyAddress: '4th Cross Street, Guindy',
    propertyCity: 'Chennai',
    propertyImage: CURATED_PROPERTY_IMAGES.apartment[0],
    rent: 18500,
    ownerId: 'owner-1',
    ownerName: 'Priya Raghavan',
    studentId: 'user-101',
    studentName: 'Aditya Sharma',
    studentEmail: 'aditya.student@rentmate.dev',
    studentPhone: '+91 98412 34567',
    preferredDate: '2026-10-28',
    preferredSlot: 'Morning (9 AM - 12 PM)',
    note: 'Would love to check out the balcony and test the Wi-Fi speed.',
    status: 'ACCEPTED',
    createdAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'visit-2',
    propertyId: 'prop-3',
    propertyTitle: 'Minimalist Designer Studio with High-Speed Fiber',
    propertyAddress: '5th Block, Koramangala',
    propertyCity: 'Bengaluru',
    propertyImage: CURATED_PROPERTY_IMAGES.studio[0],
    rent: 22000,
    ownerId: 'owner-3',
    ownerName: 'Neha Shetty',
    studentId: 'user-101',
    studentName: 'Aditya Sharma',
    studentEmail: 'aditya.student@rentmate.dev',
    studentPhone: '+91 98412 34567',
    preferredDate: '2026-10-30',
    preferredSlot: 'Afternoon (1 PM - 4 PM)',
    note: 'Planning to move in early November if the desk setup works.',
    status: 'PENDING',
    createdAt: '2026-10-22T14:30:00.000Z',
  },
];

const INITIAL_ROOMMATE_PROFILES: RoommateProfile[] = [
  {
    id: 'rm-1',
    userId: 'user-101',
    name: 'Aditya Sharma',
    avatarUrl: null,
    city: 'Chennai',
    budgetMin: 8000,
    budgetMax: 14000,
    preferredLocalities: ['Guindy', 'Velachery', 'Adyar'],
    occupation: 'Engineering Student',
    institute: 'Anna University',
    moveInFrom: '2026-11-01',
    foodPreference: 'VEGETARIAN',
    smoking: 'NEVER',
    petsFriendly: true,
    sleepSchedule: 'EARLY_BIRD',
    cleanliness: 'TIDY',
    studyHabits: 'Studies on campus 9am-6pm, quiet evenings, loves coding and cycling.',
    genderPreference: 'ANY',
    bio: 'Final-year computer science student looking for a neat flat within cycling distance of campus.',
  },
  {
    id: 'rm-2',
    userId: 'user-102',
    name: 'Sneha Iyer',
    avatarUrl: null,
    city: 'Chennai',
    budgetMin: 10000,
    budgetMax: 18000,
    preferredLocalities: ['Teynampet', 'Nungambakkam', 'Adyar'],
    occupation: 'Research Scholar',
    institute: 'IIT Madras',
    moveInFrom: '2026-11-05',
    foodPreference: 'EGGETARIAN',
    smoking: 'NEVER',
    petsFriendly: false,
    sleepSchedule: 'FLEXIBLE',
    cleanliness: 'SPOTLESS',
    studyHabits: 'Biotech lab researcher, respectful of space, clean kitchen enthusiast.',
    genderPreference: 'FEMALE',
    bio: 'Masters student at IIT Madras who values a peaceful study environment and tidy shared spaces.',
  },
  {
    id: 'rm-3',
    userId: 'user-103',
    name: 'Rahul Verma',
    avatarUrl: null,
    city: 'Bengaluru',
    budgetMin: 12000,
    budgetMax: 20000,
    preferredLocalities: ['Koramangala', 'Indiranagar', 'HSR Layout'],
    occupation: 'Junior Software Engineer',
    institute: null,
    moveInFrom: '2026-11-10',
    foodPreference: 'NON_VEGETARIAN',
    smoking: 'SOMETIMES',
    petsFriendly: true,
    sleepSchedule: 'NIGHT_OWL',
    cleanliness: 'AVERAGE',
    studyHabits: 'Hybrid tech worker, gaming on weekends, easy-going and sociable.',
    genderPreference: 'MALE',
    bio: 'Frontend dev moving to Bengaluru for a new role. Looking for a flatmate who enjoys board games and good food.',
  },
  {
    id: 'rm-4',
    userId: 'user-104',
    name: 'Meera Nair',
    avatarUrl: null,
    city: 'Pune',
    budgetMin: 7000,
    budgetMax: 12000,
    preferredLocalities: ['Shivajinagar', 'Kothrud', 'Viman Nagar'],
    occupation: 'Economics Student',
    institute: 'Fergusson College',
    moveInFrom: '2026-10-25',
    foodPreference: 'VEGETARIAN',
    smoking: 'NEVER',
    petsFriendly: true,
    sleepSchedule: 'EARLY_BIRD',
    cleanliness: 'TIDY',
    studyHabits: 'Morning reader, regular gym-goer, very organized with chores.',
    genderPreference: 'FEMALE',
    bio: 'Economics major looking for a cozy room near college. Enjoys baking, yoga, and quiet weekends.',
  },
  {
    id: 'rm-5',
    userId: 'user-105',
    name: 'Karthik Reddy',
    avatarUrl: null,
    city: 'Hyderabad',
    budgetMin: 9000,
    budgetMax: 15000,
    preferredLocalities: ['Madhapur', 'Gachibowli', 'Kondapur'],
    occupation: 'Data Science Intern',
    institute: 'IIIT Hyderabad',
    moveInFrom: '2026-11-01',
    foodPreference: 'NON_VEGETARIAN',
    smoking: 'NEVER',
    petsFriendly: false,
    sleepSchedule: 'FLEXIBLE',
    cleanliness: 'TIDY',
    studyHabits: 'Focuses during day, coffee lover, loves indie movies.',
    genderPreference: 'ANY',
    bio: 'Grad student interning at a tech startup in HITEC City. Calm demeanor, prompt rent payer.',
  },
];

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    title: 'Sunlit 2BHK in Guindy',
    participantId: 'owner-1',
    participantName: 'Priya Raghavan',
    participantRole: 'Owner',
    participantAvatar: null,
    propertyId: 'prop-1',
    propertyTitle: 'Sunlit 2BHK near Anna University & Guindy Metro',
    lastMessage: 'Sure Aditya! The visit is confirmed for 10 AM on Saturday. See you then!',
    updatedAt: '2026-10-23T16:20:00.000Z',
    unreadCount: 0,
  },
  {
    id: 'conv-2',
    title: 'Roommate Search - Velachery',
    participantId: 'user-102',
    participantName: 'Sneha Iyer',
    participantRole: 'Student',
    participantAvatar: null,
    lastMessage: 'Hi! Saw your profile on RentMate. Are you looking to team up for a 2BHK?',
    updatedAt: '2026-10-22T11:45:00.000Z',
    unreadCount: 1,
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-101',
    senderName: 'Aditya Sharma',
    text: 'Hello Priya, I saw your 2BHK listing near Anna University. Is it available for a visit this weekend?',
    createdAt: '2026-10-23T14:10:00.000Z',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'owner-1',
    senderName: 'Priya Raghavan',
    text: 'Hi Aditya! Yes, absolutely. Saturday morning between 9 AM and 12 PM works best for me.',
    createdAt: '2026-10-23T15:05:00.000Z',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-101',
    senderName: 'Aditya Sharma',
    text: 'Great, 10 AM Saturday is perfect. I submitted a visit request on RentMate as well.',
    createdAt: '2026-10-23T15:30:00.000Z',
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'owner-1',
    senderName: 'Priya Raghavan',
    text: 'Sure Aditya! The visit is confirmed for 10 AM on Saturday. See you then!',
    createdAt: '2026-10-23T16:20:00.000Z',
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    senderId: 'user-102',
    senderName: 'Sneha Iyer',
    text: 'Hi! Saw your profile on RentMate. Are you looking to team up for a 2BHK?',
    createdAt: '2026-10-22T11:45:00.000Z',
  },
];

const INITIAL_REVIEWS: PropertyReview[] = [
  {
    id: 'rev-1',
    propertyId: 'prop-1',
    authorId: 'user-106',
    authorName: 'Rohan Mehra',
    rating: 5,
    title: 'Peaceful flat, genuinely helpful owner',
    comment:
      'Lived here for 10 months during my third year. The balcony is amazing for morning study, power backup saved us during storm season, and Priya aunty always answered repairs immediately.',
    createdAt: '2026-08-15T12:00:00.000Z',
    verified: true,
  },
  {
    id: 'rev-2',
    propertyId: 'prop-1',
    authorId: 'user-107',
    authorName: 'Divya Krishnan',
    rating: 4,
    title: 'Great location for college, reliable Wi-Fi',
    comment:
      'Super quick walk to college gate. Water supply was 100% steady. Rent is very fair for Guindy. Highly recommended for students!',
    createdAt: '2026-07-28T09:30:00.000Z',
    verified: true,
  },
];

const INITIAL_USERS: StoredUser[] = [
  {
    id: 'user-100',
    name: 'RentMate Admin',
    email: 'admin@rentmate.dev',
    role: 'ADMIN',
    avatarUrl: null,
    isActive: true,
    city: 'Chennai',
    occupation: 'Platform Administrator',
    phone: '+91 99999 00000',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'owner-1',
    name: 'Priya Raghavan',
    email: 'priya.owner@rentmate.dev',
    role: 'OWNER',
    avatarUrl: null,
    isActive: true,
    city: 'Chennai',
    occupation: 'Property Owner',
    phone: '+91 98400 11223',
    createdAt: '2024-06-01T00:00:00.000Z',
  },
  {
    id: 'owner-2',
    name: 'Arun Kumar',
    email: 'arun.owner@rentmate.dev',
    role: 'OWNER',
    avatarUrl: null,
    isActive: true,
    city: 'Chennai',
    occupation: 'Property Owner',
    phone: '+91 90031 44556',
    createdAt: '2025-01-12T00:00:00.000Z',
  },
  {
    id: 'owner-3',
    name: 'Neha Shetty',
    email: 'neha.owner@rentmate.dev',
    role: 'OWNER',
    avatarUrl: null,
    isActive: true,
    city: 'Bengaluru',
    occupation: 'Property Owner',
    phone: '+91 98801 77889',
    createdAt: '2024-11-20T00:00:00.000Z',
  },
  {
    id: 'user-101',
    name: 'Aditya Sharma',
    email: 'aditya.student@rentmate.dev',
    role: 'STUDENT',
    avatarUrl: null,
    isActive: true,
    city: 'Chennai',
    occupation: 'Student at Anna University',
    phone: '+91 98412 34567',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
];

const INITIAL_REPORTS: PlatformReport[] = [
  {
    id: 'rep-1',
    targetType: 'PROPERTY',
    targetId: 'prop-2',
    targetTitle: 'Modern Twin-Sharing Room in Friendly Flatshare',
    reporterName: 'Karthik Reddy',
    reason: 'Duplicate listing or price mismatch',
    details: 'The deposit amount in chat differed slightly from the website listing.',
    status: 'PENDING',
    createdAt: '2026-10-21T09:00:00.000Z',
  },
  {
    id: 'rep-2',
    targetType: 'USER',
    targetId: 'user-spam',
    targetTitle: 'Unknown Broker Bot',
    reporterName: 'Sneha Iyer',
    reason: 'Commercial broker posing as student flatmate',
    details: 'Sent automated WhatsApp links across multiple listings.',
    status: 'RESOLVED',
    createdAt: '2026-10-18T14:20:00.000Z',
  },
];

// Helper for local storage
function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

// -------------------------------------------------------------
// APP STORE API
// -------------------------------------------------------------

export const AppStore = {
  // Properties
  getProperties(): Property[] {
    return readStorage<Property[]>(PROPERTIES_KEY, INITIAL_PROPERTIES);
  },

  getPropertyById(id: string): Property | undefined {
    return this.getProperties().find((p) => p.id === id);
  },

  addProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
    const list = this.getProperties();
    const newProperty: Property = {
      ...propertyData,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeStorage(PROPERTIES_KEY, [newProperty, ...list]);
    return newProperty;
  },

  updateProperty(id: string, patch: Partial<Property>): Property | null {
    const list = this.getProperties();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Property = {
      ...list[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    writeStorage(PROPERTIES_KEY, list);
    return updated;
  },

  deleteProperty(id: string): boolean {
    const list = this.getProperties();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;
    writeStorage(PROPERTIES_KEY, filtered);
    return true;
  },

  // Saved Properties
  getSavedIds(): string[] {
    return readStorage<string[]>(SAVED_KEY, ['prop-1', 'prop-3']);
  },

  isPropertySaved(id: string): boolean {
    return this.getSavedIds().includes(id);
  },

  toggleSave(id: string): boolean {
    const ids = this.getSavedIds();
    let next: string[];
    let isSaved: boolean;
    if (ids.includes(id)) {
      next = ids.filter((item) => item !== id);
      isSaved = false;
    } else {
      next = [...ids, id];
      isSaved = true;
    }
    writeStorage(SAVED_KEY, next);
    return isSaved;
  },

  getSavedProperties(): Property[] {
    const savedIds = this.getSavedIds();
    return this.getProperties().filter((p) => savedIds.includes(p.id));
  },

  // Visit Requests
  getVisits(): VisitRequestItem[] {
    return readStorage<VisitRequestItem[]>(VISITS_KEY, INITIAL_VISITS);
  },

  createVisit(visit: Omit<VisitRequestItem, 'id' | 'status' | 'createdAt'>): VisitRequestItem {
    const list = this.getVisits();
    const newVisit: VisitRequestItem = {
      ...visit,
      id: `visit-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    writeStorage(VISITS_KEY, [newVisit, ...list]);
    return newVisit;
  },

  updateVisitStatus(id: string, status: VisitRequestItem['status']): boolean {
    const list = this.getVisits();
    const index = list.findIndex((v) => v.id === id);
    if (index === -1) return false;
    list[index].status = status;
    writeStorage(VISITS_KEY, list);
    return true;
  },

  // Roommate Profiles & Real Matching
  getRoommateProfiles(): RoommateProfile[] {
    return INITIAL_ROOMMATE_PROFILES;
  },

  calculateRoommateMatches(activeProfile?: Partial<RoommateProfile>): RoommateMatch[] {
    const userBudgetMin = activeProfile?.budgetMin ?? 8000;
    const userBudgetMax = activeProfile?.budgetMax ?? 15000;
    const userSleep = activeProfile?.sleepSchedule ?? 'EARLY_BIRD';
    const userFood = activeProfile?.foodPreference ?? 'VEGETARIAN';
    const userClean = activeProfile?.cleanliness ?? 'TIDY';
    const userCity = activeProfile?.city;

    return INITIAL_ROOMMATE_PROFILES.map((profile) => {
      // 1. Budget overlap calculation (0-100)
      const maxLower = Math.max(userBudgetMin, profile.budgetMin);
      const minUpper = Math.min(userBudgetMax, profile.budgetMax);
      let budgetScore = 60;
      if (maxLower <= minUpper) {
        budgetScore = 95;
      } else {
        const gap = maxLower - minUpper;
        budgetScore = Math.max(30, 90 - Math.floor(gap / 500) * 10);
      }

      // 2. Location match
      const locationScore = !userCity || userCity === profile.city ? 95 : 45;

      // 3. Sleep match
      const sleepScore =
        profile.sleepSchedule === userSleep
          ? 100
          : profile.sleepSchedule === 'FLEXIBLE' || userSleep === 'FLEXIBLE'
            ? 80
            : 50;

      // 4. Food match
      const foodScore =
        profile.foodPreference === userFood
          ? 100
          : profile.foodPreference === 'NO_PREFERENCE' || userFood === 'NO_PREFERENCE'
            ? 90
            : 70;

      // 5. Cleanliness match
      const cleanScore = profile.cleanliness === userClean ? 100 : 75;

      // 6. Lifestyle & Routine
      const lifestyleScore = profile.petsFriendly ? 90 : 75;

      const weightedTotal = Math.round(
        budgetScore * 0.25 +
          locationScore * 0.25 +
          sleepScore * 0.15 +
          foodScore * 0.15 +
          cleanScore * 0.1 +
          lifestyleScore * 0.1,
      );

      const factors: CompatibilityFactor[] = [
        {
          label: 'Budget',
          score: budgetScore,
          match: (budgetScore >= 85 ? 'FULL' : budgetScore >= 60 ? 'PARTIAL' : 'NONE') as FactorMatch,
        },
        {
          label: 'Location',
          score: locationScore,
          match: (locationScore >= 80 ? 'FULL' : 'PARTIAL') as FactorMatch,
        },
        {
          label: 'Sleep',
          score: sleepScore,
          match: (sleepScore >= 85 ? 'FULL' : sleepScore >= 70 ? 'PARTIAL' : 'NONE') as FactorMatch,
        },
        {
          label: 'Food',
          score: foodScore,
          match: (foodScore >= 85 ? 'FULL' : foodScore >= 70 ? 'PARTIAL' : 'NONE') as FactorMatch,
        },
        {
          label: 'Cleanliness',
          score: cleanScore,
          match: (cleanScore >= 85 ? 'FULL' : 'PARTIAL') as FactorMatch,
        },
        {
          label: 'Lifestyle',
          score: lifestyleScore,
          match: (lifestyleScore >= 80 ? 'FULL' : 'PARTIAL') as FactorMatch,
        },
      ];

      return {
        profile,
        score: weightedTotal,
        factors,
      };
    }).sort((a, b) => b.score - a.score);
  },

  // Roommate Requests
  getRoommateRequests(): RoommateRequestItem[] {
    return readStorage<RoommateRequestItem[]>(ROOMMATE_REQUESTS_KEY, [
      {
        id: 'rm-req-1',
        senderId: 'user-102',
        senderName: 'Sneha Iyer',
        senderCity: 'Chennai',
        senderOccupation: 'Student at IIT Madras',
        receiverId: 'user-101',
        receiverName: 'Aditya Sharma',
        compatibilityScore: 92,
        note: 'Hey Aditya, our budget and routines align really well! Would love to team up for a flat in Guindy.',
        status: 'PENDING',
        createdAt: '2026-10-22T10:00:00.000Z',
      },
    ]);
  },

  sendRoommateRequest(req: Omit<RoommateRequestItem, 'id' | 'status' | 'createdAt'>): RoommateRequestItem {
    const list = this.getRoommateRequests();
    const newReq: RoommateRequestItem = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    writeStorage(ROOMMATE_REQUESTS_KEY, [newReq, ...list]);
    return newReq;
  },

  updateRoommateRequestStatus(id: string, status: RoommateRequestItem['status']): boolean {
    const list = this.getRoommateRequests();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return false;
    list[index].status = status;
    writeStorage(ROOMMATE_REQUESTS_KEY, list);
    return true;
  },

  // Chat Conversations & Messages
  getConversations(): ChatConversation[] {
    return readStorage<ChatConversation[]>(CONVERSATIONS_KEY, INITIAL_CONVERSATIONS);
  },

  getMessages(conversationId: string): ChatMessage[] {
    const all = readStorage<ChatMessage[]>(MESSAGES_KEY, INITIAL_MESSAGES);
    return all.filter((m) => m.conversationId === conversationId);
  },

  sendMessage(conversationId: string, senderId: string, senderName: string, text: string): ChatMessage {
    const allMessages = readStorage<ChatMessage[]>(MESSAGES_KEY, INITIAL_MESSAGES);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      text,
      createdAt: new Date().toISOString(),
    };
    writeStorage(MESSAGES_KEY, [...allMessages, newMsg]);

    // Update conversation last message
    const conversations = this.getConversations();
    const convIndex = conversations.findIndex((c) => c.id === conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = text;
      conversations[convIndex].updatedAt = new Date().toISOString();
      writeStorage(CONVERSATIONS_KEY, conversations);
    }
    return newMsg;
  },

  getOrCreateConversation(participant: { id: string; name: string; role: string; avatarUrl: string | null }, property?: Property): ChatConversation {
    const convs = this.getConversations();
    const existing = convs.find((c) => c.participantId === participant.id && (!property || c.propertyId === property.id));
    if (existing) return existing;

    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: property ? property.title : `Chat with ${participant.name}`,
      participantId: participant.id,
      participantName: participant.name,
      participantRole: participant.role,
      participantAvatar: participant.avatarUrl,
      propertyId: property?.id,
      propertyTitle: property?.title,
      lastMessage: property ? `Inquiry regarding ${property.title}` : 'Started conversation',
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    };
    writeStorage(CONVERSATIONS_KEY, [newConv, ...convs]);
    return newConv;
  },

  // Reviews
  getPropertyReviews(propertyId: string): PropertyReview[] {
    const all = readStorage<PropertyReview[]>(REVIEWS_KEY, INITIAL_REVIEWS);
    return all.filter((r) => r.propertyId === propertyId);
  },

  addReview(review: Omit<PropertyReview, 'id' | 'createdAt'>): PropertyReview {
    const all = readStorage<PropertyReview[]>(REVIEWS_KEY, INITIAL_REVIEWS);
    const newRev: PropertyReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    writeStorage(REVIEWS_KEY, [newRev, ...all]);
    return newRev;
  },

  // Users & Admin Moderation
  getUsers(): StoredUser[] {
    return readStorage<StoredUser[]>(USERS_KEY, INITIAL_USERS);
  },

  toggleUserStatus(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;
    user.isActive = !user.isActive;
    writeStorage(USERS_KEY, users);
    return user.isActive;
  },

  updateUserRole(userId: string, newRole: UserRole): boolean {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;
    user.role = newRole;
    writeStorage(USERS_KEY, users);
    return true;
  },

  getReports(): PlatformReport[] {
    return readStorage<PlatformReport[]>(REPORTS_KEY, INITIAL_REPORTS);
  },

  updateReportStatus(reportId: string, status: PlatformReport['status']): boolean {
    const reports = this.getReports();
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return false;
    rep.status = status;
    writeStorage(REPORTS_KEY, reports);
    return true;
  },
};
