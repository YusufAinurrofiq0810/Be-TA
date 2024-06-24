/*
  Warnings:

  - The values [Published,Unpublished] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('published', 'unpublished');
ALTER TABLE "Crowdfounding" ALTER COLUMN "status_donasi" TYPE "Status_new" USING ("status_donasi"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- AlterTable
ALTER TABLE "Crowdfounding" ALTER COLUMN "status_donasi" SET DEFAULT 'published';

-- AlterTable
ALTER TABLE "News" ALTER COLUMN "status_Berita" SET DEFAULT 'published';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
ADD COLUMN     "fullname" TEXT NOT NULL;
