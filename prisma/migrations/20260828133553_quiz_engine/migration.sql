-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "parts" JSONB;

-- AlterTable
ALTER TABLE "QuestionAttempt" ADD COLUMN     "partIndex" INTEGER;
