-- CreateTable
CREATE TABLE "ScanReport" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "totalImages" INTEGER NOT NULL,
    "imagesWithAltText" INTEGER NOT NULL,
    "lastScan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScanReport_shop_key" ON "ScanReport"("shop");
