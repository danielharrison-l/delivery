CREATE TABLE "CustomerAddress" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "label" TEXT NOT NULL,
  "street" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "neighborhood" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "zipCode" TEXT,
  "complement" TEXT,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "customerId" UUID NOT NULL,

  CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "MenuItem" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "MenuItem" ADD COLUMN "popular" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "MenuItem" ADD COLUMN "isNew" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "MenuItem" ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "DeliveryOrder" ADD COLUMN "addressId" UUID;

CREATE INDEX "CustomerAddress_customerId_idx" ON "CustomerAddress"("customerId");

ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeliveryOrder" ADD CONSTRAINT "DeliveryOrder_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "CustomerAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
