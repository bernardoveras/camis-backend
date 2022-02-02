import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { CreateTaskDTO } from './dto';
import { TaskEntity } from './entities/task.entity';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }
  @Get()
  findAll(@GetCurrentUserId() userId: number): Promise<TaskEntity[]> {
    return this.taskService.findAll(userId);
  }
  @Get(':id')
  findById(@GetCurrentUserId() userId: number, @Param('id') taskId: string): Promise<TaskEntity> {
    if (!Number(taskId))
      throw new BadRequestException('Id inválido');

    return this.taskService.findById(userId, Number(taskId));
  }

  @Post()
  create(@GetCurrentUserId() userId: number, @Body() body: CreateTaskDTO): Promise<TaskEntity> {
    return this.taskService.create(userId, body);
  }
}