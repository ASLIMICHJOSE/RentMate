-- Integrity rules that the Prisma schema language cannot express.
--
-- These are enforced by PostgreSQL for the cases application code can get
-- wrong under concurrency (two requests racing to create the same row) or when
-- a bug bypasses the service layer. The API still validates the same rules with
-- Zod, so users get a friendly error rather than a database error.
--
-- NOTE for future migrations: if `prisma migrate dev` ever proposes DROP
-- statements for the objects created here, delete those DROP lines before
-- applying the generated migration - they are intentional and must not be lost.

-- Only one *active* roommate request per direction. Rejected or cancelled
-- requests are excluded, so students can try again later.
CREATE UNIQUE INDEX "roommate_requests_one_active_per_pair_key"
    ON "roommate_requests" ("senderId", "receiverId")
    WHERE "status" IN ('PENDING', 'ACCEPTED');

-- One review per reviewer about the same person when the review is not tied to
-- a listing (the schema-level unique covers the listing case).
CREATE UNIQUE INDEX "reviews_one_author_subject_without_property_key"
    ON "reviews" ("authorId", "subjectId")
    WHERE "propertyId" IS NULL;

-- Rating range.
ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_rating_range_check" CHECK ("rating" BETWEEN 1 AND 5);

-- Nobody reviews, requests or visits themselves.
ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_no_self_review_check" CHECK ("authorId" <> "subjectId");

ALTER TABLE "roommate_requests"
    ADD CONSTRAINT "roommate_requests_no_self_request_check" CHECK ("senderId" <> "receiverId");

ALTER TABLE "visit_requests"
    ADD CONSTRAINT "visit_requests_no_self_visit_check" CHECK ("studentId" <> "ownerId");

-- Money and capacity sanity.
ALTER TABLE "properties"
    ADD CONSTRAINT "properties_rent_check" CHECK ("rent" > 0 AND "deposit" >= 0);

ALTER TABLE "properties"
    ADD CONSTRAINT "properties_capacity_check" CHECK ("bedrooms" > 0 AND "bathrooms" > 0);

-- Roommate budgets: positive and correctly ordered, so matching can rely on it.
ALTER TABLE "roommate_profiles"
    ADD CONSTRAINT "roommate_profiles_budget_check"
    CHECK ("budgetMin" >= 0 AND "budgetMax" >= "budgetMin");

-- Messages must have content and a bounded length.
ALTER TABLE "messages"
    ADD CONSTRAINT "messages_body_check" CHECK (length(btrim("body")) > 0);

-- Reports must point at something and carry a reason.
ALTER TABLE "reports"
    ADD CONSTRAINT "reports_reason_check" CHECK (length(btrim("reason")) > 0);

-- Keeping these indexes in sync with the API's ordering: newest first.
CREATE INDEX "conversation_participants_unread_idx"
    ON "messages" ("conversationId", "senderId", "createdAt" DESC);
