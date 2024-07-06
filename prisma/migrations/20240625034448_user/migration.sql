/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Crowdfounding` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `donation_collected` on the `Crowdfounding` table. All the data in the column will be lost.
  - You are about to drop the column `donation_finished_date` on the `Crowdfounding` table. All the data in the column will be lost.
  - You are about to drop the column `donation_start_date` on the `Crowdfounding` table. All the data in the column will be lost.
  - You are about to drop the column `donation_target` on the `Crowdfounding` table. All the data in the column will be lost.
  - You are about to drop the column `status_donasi` on the `Crowdfounding` table. All the data in the column will be lost.
  - The primary key for the `Donation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `crowdfounding_id` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Donation` table. All the data in the column will be lost.
  - The primary key for the `News` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `crowdfounding_id` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `status_Berita` on the `News` table. All the data in the column will be lost.
  - Added the required column `donationCollected` to the `Crowdfounding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donationFinishedDate` to the `Crowdfounding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donationStartDate` to the `Crowdfounding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donationTarget` to the `Crowdfounding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crowdfoundingId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crowdfoundingId` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "statusberita" AS ENUM ('published', 'unpublished');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('published', 'unpublished');

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_crowdfounding_id_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_category_id_fkey";

-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_crowdfounding_id_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Crowdfounding" DROP CONSTRAINT "Crowdfounding_pkey",
DROP COLUMN "donation_collected",
DROP COLUMN "donation_finished_date",
DROP COLUMN "donation_start_date",
DROP COLUMN "donation_target",
DROP COLUMN "status_donasi",
ADD COLUMN     "donationCollected" TEXT NOT NULL,
ADD COLUMN     "donationFinishedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "donationStartDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "donationTarget" TEXT NOT NULL,
ADD COLUMN     "statusDonasi" "status" NOT NULL DEFAULT 'published',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Crowdfounding_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Crowdfounding_id_seq";

-- AlterTable
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_pkey",
DROP COLUMN "crowdfounding_id",
DROP COLUMN "user_id",
ADD COLUMN     "crowdfoundingId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "message" DROP NOT NULL,
ADD CONSTRAINT "Donation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Donation_id_seq";

-- AlterTable
ALTER TABLE "News" DROP CONSTRAINT "News_pkey",
DROP COLUMN "category_id",
DROP COLUMN "crowdfounding_id",
DROP COLUMN "status_Berita",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "crowdfoundingId" TEXT NOT NULL,
ADD COLUMN     "statusBerita" "statusberita" NOT NULL DEFAULT 'published',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "News_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "News_id_seq";

-- DropEnum
DROP TYPE "Status";

-- DropEnum
DROP TYPE "Status_Berita";

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_crowdfoundingId_fkey" FOREIGN KEY ("crowdfoundingId") REFERENCES "Crowdfounding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_crowdfoundingId_fkey" FOREIGN KEY ("crowdfoundingId") REFERENCES "Crowdfounding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
