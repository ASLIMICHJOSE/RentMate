-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'PG', 'HOSTEL', 'STUDIO', 'SHARED_ROOM');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED', 'RENTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "GenderPreference" AS ENUM ('ANY', 'MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SleepSchedule" AS ENUM ('EARLY_BIRD', 'FLEXIBLE', 'NIGHT_OWL');

-- CreateEnum
CREATE TYPE "FoodPreference" AS ENUM ('VEGETARIAN', 'EGGETARIAN', 'NON_VEGETARIAN', 'VEGAN', 'NO_PREFERENCE');

-- CreateEnum
CREATE TYPE "SmokingPreference" AS ENUM ('NEVER', 'SOMETIMES', 'REGULARLY');

-- CreateEnum
CREATE TYPE "CleanlinessLevel" AS ENUM ('RELAXED', 'AVERAGE', 'TIDY', 'SPOTLESS');

-- CreateEnum
CREATE TYPE "RoommateRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('PROPERTY', 'USER', 'MESSAGE');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "phone" VARCHAR(20),
    "bio" VARCHAR(500),
    "city" VARCHAR(60),
    "occupation" VARCHAR(80),
    "education" VARCHAR(120),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "title" VARCHAR(140) NOT NULL,
    "description" TEXT NOT NULL,
    "rent" INTEGER NOT NULL,
    "deposit" INTEGER NOT NULL,
    "city" VARCHAR(60) NOT NULL,
    "locality" VARCHAR(80) NOT NULL,
    "address" VARCHAR(240) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "propertyType" "PropertyType" NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "areaSqft" INTEGER,
    "availableFrom" DATE NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" UUID NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "label" VARCHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_amenities" (
    "propertyId" UUID NOT NULL,
    "amenityId" UUID NOT NULL,

    CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("propertyId","amenityId")
);

-- CreateTable
CREATE TABLE "roommate_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "city" VARCHAR(60) NOT NULL,
    "budgetMin" INTEGER NOT NULL,
    "budgetMax" INTEGER NOT NULL,
    "preferredLocalities" TEXT[],
    "occupation" VARCHAR(80) NOT NULL,
    "institute" VARCHAR(120),
    "moveInFrom" DATE NOT NULL,
    "foodPreference" "FoodPreference" NOT NULL,
    "smoking" "SmokingPreference" NOT NULL,
    "petsFriendly" BOOLEAN NOT NULL DEFAULT false,
    "sleepSchedule" "SleepSchedule" NOT NULL,
    "cleanliness" "CleanlinessLevel" NOT NULL,
    "studyHabits" VARCHAR(300),
    "gender" "Gender",
    "genderPreference" "GenderPreference" NOT NULL DEFAULT 'ANY',
    "bio" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roommate_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roommate_requests" (
    "id" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "receiverId" UUID NOT NULL,
    "message" VARCHAR(500),
    "status" "RoommateRequestStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roommate_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_properties" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_requests" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "requestedDate" TIMESTAMP(3) NOT NULL,
    "message" VARCHAR(500),
    "status" "VisitStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "propertyId" UUID,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "conversationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "lastReadAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("conversationId","userId")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "body" VARCHAR(2000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "propertyId" UUID,
    "rating" INTEGER NOT NULL,
    "comment" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "reporterId" UUID NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" UUID NOT NULL,
    "reason" VARCHAR(120) NOT NULL,
    "details" VARCHAR(1000),
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "resolvedById" UUID,
    "resolutionNote" VARCHAR(500),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "properties_status_city_rent_idx" ON "properties"("status", "city", "rent");

-- CreateIndex
CREATE INDEX "properties_status_createdAt_idx" ON "properties"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "properties_ownerId_status_idx" ON "properties"("ownerId", "status");

-- CreateIndex
CREATE INDEX "properties_propertyType_bedrooms_idx" ON "properties"("propertyType", "bedrooms");

-- CreateIndex
CREATE INDEX "property_images_propertyId_sortOrder_idx" ON "property_images"("propertyId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_code_key" ON "amenities"("code");

-- CreateIndex
CREATE INDEX "property_amenities_amenityId_idx" ON "property_amenities"("amenityId");

-- CreateIndex
CREATE UNIQUE INDEX "roommate_profiles_userId_key" ON "roommate_profiles"("userId");

-- CreateIndex
CREATE INDEX "roommate_profiles_isActive_city_budgetMin_idx" ON "roommate_profiles"("isActive", "city", "budgetMin");

-- CreateIndex
CREATE INDEX "roommate_requests_receiverId_status_idx" ON "roommate_requests"("receiverId", "status");

-- CreateIndex
CREATE INDEX "roommate_requests_senderId_status_idx" ON "roommate_requests"("senderId", "status");

-- CreateIndex
CREATE INDEX "saved_properties_userId_createdAt_idx" ON "saved_properties"("userId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "saved_properties_userId_propertyId_key" ON "saved_properties"("userId", "propertyId");

-- CreateIndex
CREATE INDEX "visit_requests_ownerId_status_idx" ON "visit_requests"("ownerId", "status");

-- CreateIndex
CREATE INDEX "visit_requests_studentId_status_idx" ON "visit_requests"("studentId", "status");

-- CreateIndex
CREATE INDEX "visit_requests_propertyId_requestedDate_idx" ON "visit_requests"("propertyId", "requestedDate");

-- CreateIndex
CREATE INDEX "conversations_lastMessageAt_idx" ON "conversations"("lastMessageAt" DESC);

-- CreateIndex
CREATE INDEX "conversation_participants_userId_idx" ON "conversation_participants"("userId");

-- CreateIndex
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "reviews_subjectId_createdAt_idx" ON "reviews"("subjectId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "reviews_propertyId_idx" ON "reviews"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_authorId_propertyId_key" ON "reviews"("authorId", "propertyId");

-- CreateIndex
CREATE INDEX "reports_status_createdAt_idx" ON "reports"("status", "createdAt");

-- CreateIndex
CREATE INDEX "reports_targetType_targetId_idx" ON "reports"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "reports_reporterId_idx" ON "reports"("reporterId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roommate_profiles" ADD CONSTRAINT "roommate_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roommate_requests" ADD CONSTRAINT "roommate_requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roommate_requests" ADD CONSTRAINT "roommate_requests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_properties" ADD CONSTRAINT "saved_properties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_properties" ADD CONSTRAINT "saved_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_requests" ADD CONSTRAINT "visit_requests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_requests" ADD CONSTRAINT "visit_requests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_requests" ADD CONSTRAINT "visit_requests_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

