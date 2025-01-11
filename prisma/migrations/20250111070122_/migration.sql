/*
  Warnings:

  - You are about to drop the column `user_id` on the `Semester` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_DONE', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Semester" DROP COLUMN "user_id",
ADD COLUMN     "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "link" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NOT_DONE',
    "semesterId" TEXT NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
