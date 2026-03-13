-- CreateTable
CREATE TABLE "Bottle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "distillery" TEXT NOT NULL,
    "age" TEXT,
    "proof" REAL,
    "mashBill" TEXT,
    "region" TEXT,
    "type" TEXT,
    "flavorNotes" TEXT,
    "description" TEXT,
    "priceRange" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CollectionEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bottleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sealed',
    "pourLevel" INTEGER DEFAULT 100,
    "rating" REAL,
    "notes" TEXT,
    "purchasePrice" REAL,
    "purchaseDate" DATETIME,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CollectionEntry_bottleId_fkey" FOREIGN KEY ("bottleId") REFERENCES "Bottle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
