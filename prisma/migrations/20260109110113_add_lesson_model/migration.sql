-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "type" "LessonType" NOT NULL,
    "studentNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringEndDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lesson_coachId_idx" ON "Lesson"("coachId");

-- CreateIndex
CREATE INDEX "Lesson_date_idx" ON "Lesson"("date");

-- CreateIndex
CREATE INDEX "Lesson_coachId_date_idx" ON "Lesson"("coachId", "date");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
