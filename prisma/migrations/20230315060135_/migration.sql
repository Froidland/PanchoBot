/*
  Warnings:

  - The values [GROUP] on the enum `StageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StageType_new" AS ENUM ('GROUPS', 'QUALIFIERS', 'ROUND_64', 'ROUND_32', 'ROUND_16', 'QUARTERFINALS', 'SEMIFINALS', 'FINALS', 'GRANDFINALS');
ALTER TABLE "Stage" ALTER COLUMN "type" TYPE "StageType_new" USING ("type"::text::"StageType_new");
ALTER TYPE "StageType" RENAME TO "StageType_old";
ALTER TYPE "StageType_new" RENAME TO "StageType";
DROP TYPE "StageType_old";
COMMIT;
