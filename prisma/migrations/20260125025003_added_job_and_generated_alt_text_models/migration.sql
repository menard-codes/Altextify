-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('unknown', 'waiting', 'waitingChildren', 'active', 'delayed', 'prioritized', 'completed', 'failed');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
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
    "altText" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "GeneratedAltText_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneratedAltText" ADD CONSTRAINT "GeneratedAltText_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
