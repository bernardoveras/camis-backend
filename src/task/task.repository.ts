import { Injectable, NotFoundException } from '@nestjs/common';
import { Entity } from 'src/common/entities';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDTO } from './dto';
import { TaskEntity } from './entities';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) { }

  private userInclude = { select: { id: true, email: true, name: true } };
  private skillsInclude = { select: { skill: true } };
  private taskInclude = {
    skills: this.skillsInclude,
    assignedBy: this.userInclude,
    owner: this.userInclude,
  };

  async findAll(userId: number): Promise<TaskEntity[]> {
    return await this.prisma.task.findMany({
      where: { ownerId: userId },
      include: this.taskInclude,
    });
  }

  async findById(userId: number, taskId: number): Promise<TaskEntity> {
    const result = await this.prisma.task.findFirst({
      where: { id: taskId, ownerId: userId },
      include: this.taskInclude,
    });

    if (result === null) throw new NotFoundException('Tarefa não encontrada');

    return result;
  }

  async create(userId: number, dto: CreateTaskDTO): Promise<TaskEntity> {
    const skillsMapped = dto.skills.map((e) => { return { skillId: e.id } });

    return await this.prisma.task.create({
      data: {
        name: dto.name,
        assignedById: dto.assignedById,
        ownerId: userId,
        skills: { createMany: { data: skillsMapped } },
      },
      include: this.taskInclude,
    });
  }

  async delete(userId: number, taskId: number) {
    const task = await this.findById(userId, taskId);

    return await this.prisma.task.delete({ where: { id: taskId } });
  }
}