import { BaseEntity } from "src/common/entities";
import { TaskEntity } from "src/task/entities/task.entity";

export class UserEntity extends BaseEntity {
  constructor(
    id: number,
    email: string,
    name: string,
    tasks: TaskEntity[],
    createdTasks: TaskEntity[],
    createdAt: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }
}