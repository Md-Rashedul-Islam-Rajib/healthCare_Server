/*
  Warnings:

  - Added the required column `appointmentFee` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "appointmentFee" INTEGER NOT NULL;
