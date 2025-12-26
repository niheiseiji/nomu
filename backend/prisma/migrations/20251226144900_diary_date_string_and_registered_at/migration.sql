-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_JournalEntry" ("content", "createdAt", "date", "id", "title", "updatedAt", "registeredAt")
SELECT
  "content",
  "createdAt",
  substr("date", 1, 10),
  "id",
  "title",
  "updatedAt",
  "date"
FROM "JournalEntry";
DROP TABLE "JournalEntry";
ALTER TABLE "new_JournalEntry" RENAME TO "JournalEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
