import { TaskStatus } from "@prisma/client";

export class BaseEntity {
  constructor(
    id: number,
    createdAt: Date,
    updatedAt?: Date,
  ) {
  }
}

export class TaskEntity extends BaseEntity {
  constructor(
    id: number,
    name: string,
    status: TaskStatus = TaskStatus.Pending,
    skills: SkillEntity[],
    owner: UserEntity,
    createdAt: Date,
    assignedBy?: UserEntity,
    assignedAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }
}

export class SkillEntity extends BaseEntity {
  constructor(
    id: number,
    name: string,
    tasks: TaskEntity[],
    createdAt: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }
}

export class UserEntity extends BaseEntity {
  constructor(
    id: number,
    email: string,
    tasks: TaskEntity[],
    createdTasks: TaskEntity[],
    createdAt: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }
}