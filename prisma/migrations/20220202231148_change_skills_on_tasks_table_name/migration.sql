/*
  Warnings:

  - You are about to drop the `SkillsOnTasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SkillsOnTasks" DROP CONSTRAINT "SkillsOnTasks_skillId_fkey";

-- DropForeignKey
ALTER TABLE "SkillsOnTasks" DROP CONSTRAINT "SkillsOnTasks_taskId_fkey";

-- DropTable
DROP TABLE "SkillsOnTasks";

-- CreateTable
CREATE TABLE "skills_on_tasks" (
    "skillId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "skills_on_tasks_pkey" PRIMARY KEY ("skillId","taskId")
);

-- AddForeignKey
ALTER TABLE "skills_on_tasks" ADD CONSTRAINT "skills_on_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills_on_tasks" ADD CONSTRAINT "skills_on_tasks_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
