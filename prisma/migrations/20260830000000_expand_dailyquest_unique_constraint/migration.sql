-- DropIndex
DROP INDEX "DailyQuest_userId_questDate_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuest_userId_questDate_type_target_key" ON "DailyQuest"("userId", "questDate", "type", "target");
