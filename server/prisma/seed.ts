/**
 * Development seed (Milestone 3).
 *
 * Creates one admin, three owners and five students together with listings,
 * roommate profiles, saves, requests, a conversation, reviews and reports so
 * every screen has realistic data to render. Re-running the script replaces the
 * demo data (users are upserted by email, everything else is recreated).
 *
 * Run with: npm run db:seed --workspace server
 */
import { hash } from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const DATABASE_URL = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL (or DIRECT_URL) must be set before seeding.');
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

/** Shared demo password - hashed with bcrypt before it ever reaches the database. */
const DEMO_PASSWORD = 'Password123!';

const AMENITIES = [
  { code: 'WIFI', label: 'Wi-Fi' },
  { code: 'PARKING', label: 'Parking' },
  { code: 'LAUNDRY', label: 'Laundry' },
  { code: 'KITCHEN', label: 'Kitchen' },
  { code: 'AC', label: 'Air conditioning' },
  { code: 'SECURITY', label: 'Security' },
  { code: 'POWER_BACKUP', label: 'Power backup' },
  { code: 'WATER_SUPPLY', label: 'Water supply' },
  { code: 'GYM', label: 'Gym' },
  { code: 'MEALS', label: 'Meals included' },
];

const USERS = [
  {
    email: 'admin@rentmate.dev',
    name: 'RentMate Admin',
    role: 'ADMIN' as const,
    city: 'Chennai',
    occupation: 'Platform administrator',
  },
  {
    email: 'priya.owner@rentmate.dev',
    name: 'Priya Raghavan',
    role: 'OWNER' as const,
    city: 'Chennai',
    occupation: 'Property owner',
  },
  {
    email: 'arun.owner@rentmate.dev',
    name: 'Arun Kumar',
    role: 'OWNER' as const,
    city: 'Chennai',
    occupation: 'Property owner',
  },
  {
    email: 'neha.owner@rentmate.dev',
    name: 'Neha Shetty',
    role: 'OWNER' as const,
    city: 'Bengaluru',
    occupation: 'Property owner',
  },
  {
    email: 'aditya.student@rentmate.dev',
    name: 'Aditya Sharma',
    role: 'STUDENT' as const,
    city: 'Chennai',
    occupation: 'Student',
  },
  {
    email: 'sneha.student@rentmate.dev',
    name: 'Sneha Iyer',
    role: 'STUDENT' as const,
    city: 'Chennai',
    occupation: 'Student',
  },
  {
    email: 'meera.student@rentmate.dev',
    name: 'Meera Nair',
    role: 'STUDENT' as const,
    city: 'Pune',
    occupation: 'Student',
  },
  {
    email: 'rahul.student@rentmate.dev',
    name: 'Rahul Verma',
    role: 'STUDENT' as const,
    city: 'Bengaluru',
    occupation: 'Young professional',
  },
  {
    email: 'karthik.student@rentmate.dev',
    name: 'Karthik Reddy',
    role: 'STUDENT' as const,
    city: 'Hyderabad',
    occupation: 'Student',
  },
  {
    email: 'fatima.student@rentmate.dev',
    name: 'Fatima Khan',
    role: 'STUDENT' as const,
    city: 'Chennai',
    occupation: 'Student',
  },
];

interface SeedProperty {
  title: string;
  description: string;
  rent: number;
  deposit: number;
  city: string;
  locality: string;
  address: string;
  propertyType: 'APARTMENT' | 'HOUSE' | 'PG' | 'HOSTEL' | 'STUDIO' | 'SHARED_ROOM';
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  areaSqft: number;
  availableFrom: string;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'RENTED' | 'ARCHIVED';
  amenities: string[];
  ownerEmail: string;
}

const PROPERTIES: SeedProperty[] = [
  {
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
    ownerEmail: 'priya.owner@rentmate.dev',
  },
  {
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
    ownerEmail: 'arun.owner@rentmate.dev',
  },
  {
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
    ownerEmail: 'neha.owner@rentmate.dev',
  },
  {
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
    ownerEmail: 'priya.owner@rentmate.dev',
  },
  {
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
    ownerEmail: 'arun.owner@rentmate.dev',
  },
  {
    title: 'Budget PG near VIT (girls only)',
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
    ownerEmail: 'priya.owner@rentmate.dev',
  },
  {
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
    ownerEmail: 'neha.owner@rentmate.dev',
  },
  {
    title: 'Twin-sharing room in a new 2BHK',
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
    ownerEmail: 'neha.owner@rentmate.dev',
  },
];

interface SeedRoommate {
  email: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  preferredLocalities: string[];
  occupation: string;
  institute: string | null;
  moveInFrom: string;
  foodPreference: 'VEGETARIAN' | 'EGGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'NO_PREFERENCE';
  smoking: 'NEVER' | 'SOMETIMES' | 'REGULARLY';
  petsFriendly: boolean;
  sleepSchedule: 'EARLY_BIRD' | 'FLEXIBLE' | 'NIGHT_OWL';
  cleanliness: 'RELAXED' | 'AVERAGE' | 'TIDY' | 'SPOTLESS';
  studyHabits: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  genderPreference: 'ANY' | 'MALE' | 'FEMALE';
  bio: string;
}

const ROOMMATES: SeedRoommate[] = [
  {
    email: 'aditya.student@rentmate.dev',
    city: 'Chennai',
    budgetMin: 8000,
    budgetMax: 14000,
    preferredLocalities: ['Guindy', 'Velachery', 'Adyar'],
    occupation: 'Student',
    institute: 'Anna University',
    moveInFrom: '2026-10-01',
    foodPreference: 'VEGETARIAN',
    smoking: 'NEVER',
    petsFriendly: true,
    sleepSchedule: 'EARLY_BIRD',
    cleanliness: 'TIDY',
    studyHabits: 'Studies 9am-6pm on campus, quiet evenings, exams in November.',
    gender: 'MALE',
    genderPreference: 'ANY',
    bio: 'Final-year mechanical student looking for a calm flat within cycling distance of campus.',
  },
  {
    email: 'sneha.student@rentmate.dev',
    city: 'Chennai',
    budgetMin: 10000,
    budgetMax: 18000,
    preferredLocalities: ['Teynampet', 'Nungambakkam'],
    occupation: 'Student',
    institute: 'IIT Madras',
    moveInFrom: '2026-09-25',
    foodPreference: 'EGGETARIAN',
    smoking: 'NEVER',
    petsFriendly: false,
    sleepSchedule: 'FLEXIBLE',
    cleanliness: 'SPOTLESS',
    studyHabits: 'Lab work until 8pm, studies late during project weeks.',
    gender: 'FEMALE',
    genderPreference: 'FEMALE',
    bio: 'Masters student who values a clean kitchen and quiet weeknights.',
  },
  {
    email: 'meera.student@rentmate.dev',
    city: 'Pune',
    budgetMin: 9000,
    budgetMax: 15000,
    preferredLocalities: ['Kothrud', 'Karve Nagar'],
    occupation: 'Student',
    institute: 'COEP Pune',
    moveInFrom: '2026-10-15',
    foodPreference: 'VEGETARIAN',
    smoking: 'NEVER',
    petsFriendly: false,
    sleepSchedule: 'EARLY_BIRD',
    cleanliness: 'TIDY',
    studyHabits: 'Morning lectures, group study in the evenings, early nights.',
    gender: 'FEMALE',
    genderPreference: 'FEMALE',
    bio: 'Third-year civil engineering student, vegetarian kitchen, non-smoker.',
  },
  {
    email: 'rahul.student@rentmate.dev',
    city: 'Bengaluru',
    budgetMin: 12000,
    budgetMax: 20000,
    preferredLocalities: ['Koramangala', 'Indiranagar', 'Jayanagar'],
    occupation: 'Young professional',
    institute: null,
    moveInFrom: '2026-11-05',
    foodPreference: 'NON_VEGETARIAN',
    smoking: 'SOMETIMES',
    petsFriendly: true,
    sleepSchedule: 'NIGHT_OWL',
    cleanliness: 'AVERAGE',
    studyHabits: 'Works hybrid, three days in office, gaming most evenings.',
    gender: 'MALE',
    genderPreference: 'MALE',
    bio: 'Software engineer relocating for a new role, looking for a sociable flatmate.',
  },
  {
    email: 'karthik.student@rentmate.dev',
    city: 'Hyderabad',
    budgetMin: 6000,
    budgetMax: 11000,
    preferredLocalities: ['Gachibowli', 'Madhapur'],
    occupation: 'Student',
    institute: 'IIIT Hyderabad',
    moveInFrom: '2026-09-22',
    foodPreference: 'NO_PREFERENCE',
    smoking: 'NEVER',
    petsFriendly: true,
    sleepSchedule: 'FLEXIBLE',
    cleanliness: 'AVERAGE',
    studyHabits: 'Research assistant, irregular hours around submissions.',
    gender: 'MALE',
    genderPreference: 'ANY',
    bio: 'Research student splitting time between campus lab and home desk.',
  },
  {
    email: 'fatima.student@rentmate.dev',
    city: 'Chennai',
    budgetMin: 11000,
    budgetMax: 17000,
    preferredLocalities: ['Adyar', 'Besant Nagar'],
    occupation: 'Student',
    institute: 'SRM University',
    moveInFrom: '2026-10-08',
    foodPreference: 'NON_VEGETARIAN',
    smoking: 'NEVER',
    petsFriendly: true,
    sleepSchedule: 'NIGHT_OWL',
    cleanliness: 'TIDY',
    studyHabits: 'Design studio sessions run late, prefers a quiet morning flat.',
    gender: 'FEMALE',
    genderPreference: 'FEMALE',
    bio: 'Design student looking for a tidy, pet-friendly flat near the beach.',
  },
];

/** Placeholder image URLs until Cloudinary uploads land in Milestone 15. */
const SEED_IMAGES = [
  { imageUrl: '/images/property-1.svg', publicId: 'seed/property-1' },
  { imageUrl: '/images/property-2.svg', publicId: 'seed/property-2' },
  { imageUrl: '/images/property-3.svg', publicId: 'seed/property-3' },
];

async function clearDemoData(): Promise<void> {
  // Delete in dependency order so foreign keys never block the reset.
  await prisma.report.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.visitRequest.deleteMany();
  await prisma.roommateRequest.deleteMany();
  await prisma.savedProperty.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.roommateProfile.deleteMany();
}

async function main(): Promise<void> {
  console.log('Seeding RentMate demo data...');

  const passwordHash = await hash(DEMO_PASSWORD, 12);

  // --- Amenities -----------------------------------------------------------
  await prisma.amenity.createMany({ data: AMENITIES, skipDuplicates: true });
  const amenities = await prisma.amenity.findMany();
  const amenityIdByCode = new Map(amenities.map((amenity) => [amenity.code, amenity.id]));

  // --- Users + profiles ----------------------------------------------------
  const users = new Map<string, { id: string }>();

  for (const user of USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
        profile: {
          create: {
            city: user.city,
            occupation: user.occupation,
            bio: `${user.name} is part of the seeded RentMate demo data.`,
          },
        },
      },
    });

    users.set(user.email, { id: record.id });
  }

  const userId = (email: string): string => {
    const found = users.get(email);
    if (!found) throw new Error(`Seed error: unknown user ${email}`);
    return found.id;
  };

  await clearDemoData();

  // --- Properties ----------------------------------------------------------
  const propertyIds = new Map<string, string>();

  for (const property of PROPERTIES) {
    const created = await prisma.property.create({
      data: {
        ownerId: userId(property.ownerEmail),
        title: property.title,
        description: property.description,
        rent: property.rent,
        deposit: property.deposit,
        city: property.city,
        locality: property.locality,
        address: property.address,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        furnished: property.furnished,
        areaSqft: property.areaSqft,
        availableFrom: new Date(property.availableFrom),
        status: property.status,
        images: {
          create: SEED_IMAGES.map((image, index) => ({ ...image, sortOrder: index })),
        },
        amenities: {
          create: property.amenities
            .map((code) => amenityIdByCode.get(code))
            .filter((amenityId): amenityId is string => Boolean(amenityId))
            .map((amenityId) => ({ amenityId })),
        },
      },
    });

    propertyIds.set(property.title, created.id);
  }

  const firstPropertyId = propertyIds.get(PROPERTIES[0]!.title)!;
  const studioPropertyId = propertyIds.get(PROPERTIES[2]!.title)!;
  const sharedRoomPropertyId = propertyIds.get(PROPERTIES[1]!.title)!;
  const pendingPropertyId = propertyIds.get(PROPERTIES[4]!.title)!;

  // --- Roommate profiles ---------------------------------------------------
  for (const roommate of ROOMMATES) {
    await prisma.roommateProfile.create({
      data: {
        userId: userId(roommate.email),
        city: roommate.city,
        budgetMin: roommate.budgetMin,
        budgetMax: roommate.budgetMax,
        preferredLocalities: roommate.preferredLocalities,
        occupation: roommate.occupation,
        institute: roommate.institute,
        moveInFrom: new Date(roommate.moveInFrom),
        foodPreference: roommate.foodPreference,
        smoking: roommate.smoking,
        petsFriendly: roommate.petsFriendly,
        sleepSchedule: roommate.sleepSchedule,
        cleanliness: roommate.cleanliness,
        studyHabits: roommate.studyHabits,
        gender: roommate.gender,
        genderPreference: roommate.genderPreference,
        bio: roommate.bio,
      },
    });
  }

  // --- Saved properties ----------------------------------------------------
  await prisma.savedProperty.createMany({
    data: [
      { userId: userId('aditya.student@rentmate.dev'), propertyId: firstPropertyId },
      { userId: userId('aditya.student@rentmate.dev'), propertyId: studioPropertyId },
      { userId: userId('sneha.student@rentmate.dev'), propertyId: sharedRoomPropertyId },
    ],
  });

  // --- Roommate requests ---------------------------------------------------
  await prisma.roommateRequest.createMany({
    data: [
      {
        senderId: userId('aditya.student@rentmate.dev'),
        receiverId: userId('fatima.student@rentmate.dev'),
        message: 'Hi! We both prefer Adyar and early nights - want to look for a 2BHK together?',
        status: 'PENDING',
      },
      {
        senderId: userId('sneha.student@rentmate.dev'),
        receiverId: userId('meera.student@rentmate.dev'),
        message: 'Both vegetarian and tidy - interested in sharing in Kothrud?',
        status: 'ACCEPTED',
        respondedAt: new Date('2026-09-12T09:00:00.000Z'),
      },
    ],
  });

  // --- Visit requests ------------------------------------------------------
  await prisma.visitRequest.createMany({
    data: [
      {
        propertyId: sharedRoomPropertyId,
        studentId: userId('aditya.student@rentmate.dev'),
        ownerId: userId('arun.owner@rentmate.dev'),
        requestedDate: new Date('2026-09-20T11:00:00.000Z'),
        message: 'Could I see the room on Saturday morning?',
        status: 'ACCEPTED',
        respondedAt: new Date('2026-09-15T06:30:00.000Z'),
      },
      {
        propertyId: firstPropertyId,
        studentId: userId('sneha.student@rentmate.dev'),
        ownerId: userId('priya.owner@rentmate.dev'),
        requestedDate: new Date('2026-09-21T10:00:00.000Z'),
        message: 'Interested in the 2BHK - is Sunday possible instead?',
        status: 'PENDING',
      },
      {
        propertyId: studioPropertyId,
        studentId: userId('rahul.student@rentmate.dev'),
        ownerId: userId('neha.owner@rentmate.dev'),
        requestedDate: new Date('2026-09-18T17:30:00.000Z'),
        message: 'Moving to Bengaluru in November, would like to visit this week.',
        status: 'REJECTED',
        respondedAt: new Date('2026-09-13T08:15:00.000Z'),
      },
    ],
  });

  // --- Conversation + messages --------------------------------------------
  const conversation = await prisma.conversation.create({
    data: {
      propertyId: sharedRoomPropertyId,
      lastMessageAt: new Date('2026-09-15T07:05:00.000Z'),
      participants: {
        create: [
          {
            userId: userId('aditya.student@rentmate.dev'),
            lastReadAt: new Date('2026-09-15T07:00:00.000Z'),
          },
          {
            userId: userId('arun.owner@rentmate.dev'),
            lastReadAt: new Date('2026-09-15T07:10:00.000Z'),
          },
        ],
      },
      messages: {
        create: [
          {
            senderId: userId('aditya.student@rentmate.dev'),
            body: 'Hi Arun, is the room still available from 20 September?',
            createdAt: new Date('2026-09-14T16:40:00.000Z'),
          },
          {
            senderId: userId('arun.owner@rentmate.dev'),
            body: 'Yes it is. Two other students live there, both final year.',
            createdAt: new Date('2026-09-14T17:02:00.000Z'),
          },
          {
            senderId: userId('aditya.student@rentmate.dev'),
            body: 'Great - I confirmed the visit for Saturday 11am. See you then!',
            createdAt: new Date('2026-09-15T07:05:00.000Z'),
          },
        ],
      },
    },
  });

  // --- Reviews -------------------------------------------------------------
  await prisma.review.createMany({
    data: [
      {
        authorId: userId('aditya.student@rentmate.dev'),
        subjectId: userId('priya.owner@rentmate.dev'),
        propertyId: firstPropertyId,
        rating: 5,
        comment: 'Responded within an hour and the flat was exactly as listed.',
      },
      {
        authorId: userId('sneha.student@rentmate.dev'),
        subjectId: userId('priya.owner@rentmate.dev'),
        propertyId: null,
        rating: 4,
        comment: 'Very organised owner. Maintenance requests were handled the same week.',
      },
      {
        authorId: userId('arun.owner@rentmate.dev'),
        subjectId: userId('aditya.student@rentmate.dev'),
        propertyId: null,
        rating: 5,
        comment: 'Punctual for the visit and communicated clearly throughout.',
      },
    ],
  });

  // --- Reports -------------------------------------------------------------
  await prisma.report.createMany({
    data: [
      {
        reporterId: userId('sneha.student@rentmate.dev'),
        targetType: 'PROPERTY',
        targetId: pendingPropertyId,
        reason: 'Misleading photos',
        details: 'The photos show a furnished flat but the listing says unfurnished.',
        status: 'PENDING',
      },
      {
        reporterId: userId('rahul.student@rentmate.dev'),
        targetType: 'USER',
        targetId: userId('aditya.student@rentmate.dev'),
        reason: 'No-show for a scheduled visit',
        details: 'Did not turn up and did not reply to messages.',
        status: 'REVIEWING',
      },
    ],
  });

  const counts = {
    users: await prisma.user.count(),
    properties: await prisma.property.count(),
    amenities: await prisma.amenity.count(),
    roommateProfiles: await prisma.roommateProfile.count(),
    visits: await prisma.visitRequest.count(),
    messages: await prisma.message.count(),
    reviews: await prisma.review.count(),
    reports: await prisma.report.count(),
  };

  console.log('Seed complete:', counts);
  console.log(`Conversation id: ${conversation.id}`);
  console.log(`Demo password for every seeded account: ${DEMO_PASSWORD}`);
}

main()
  .catch((error: unknown) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
