import { Injectable } from '@nestjs/common';
import { CreateTaskDTO } from './dto';
import { TaskEntity } from './entities';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly repository: TaskRepository) { }

  async findAll(userId: number): Promise<TaskEntity[]> {
    return await this.repository.findAll(userId);
  }

  async findById(userId: number, taskId: number): Promise<TaskEntity> {
    return await this.repository.findById(userId, taskId);
  }

  async create(userId: number, dto: CreateTaskDTO): Promise<TaskEntity> {
    return await this.repository.create(userId, dto);
  }
}