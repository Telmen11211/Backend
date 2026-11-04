-- Seminar 6: convert author text into a relation without deleting books.
CREATE TABLE "Author" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT NOT NULL,
 "email" TEXT NOT NULL
);
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");
ALTER TABLE "Book" ADD COLUMN "authorId" INTEGER;
INSERT INTO "Author" ("name", "email")
SELECT COALESCE(NULLIF(trim("author"), ''), 'Unknown'),
       'legacy-' || MIN("id") || '@example.invalid'
FROM "Book" GROUP BY COALESCE(NULLIF(trim("author"), ''), 'Unknown');
UPDATE "Book" b SET "authorId" = a."id" FROM "Author" a
WHERE a."name" = COALESCE(NULLIF(trim(b."author"), ''), 'Unknown');
ALTER TABLE "Book" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "Book" DROP COLUMN "author";
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey"
 FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
