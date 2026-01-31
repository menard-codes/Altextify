-- CreateEnum
CREATE TYPE "JobScope" AS ENUM ('selectedCollections', 'selectedProducts', 'allProducts');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('unknown', 'waiting', 'waitingChildren', 'active', 'delayed', 'prioritized', 'completed', 'failed');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" "JobScope" NOT NULL DEFAULT 'allProducts',
    "scopeIdentifiers" TEXT[],
    "onlyGenerateMissingAlt" BOOLEAN NOT NULL,
    "autoSave" BOOLEAN NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedOn" TIMESTAMP(3),
    "finishedOn" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedAltText" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "generatedAltText" TEXT NOT NULL,
    "originalAltText" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "variantId" TEXT,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "GeneratedAltText_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_shop_name_key" ON "Job"("shop", "name");

-- AddForeignKey
ALTER TABLE "GeneratedAltText" ADD CONSTRAINT "GeneratedAltText_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
