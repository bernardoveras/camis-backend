import { Entity } from "./entity";

export class BaseEntity extends Entity {
  constructor(
    id: number,
    createdAt: Date,
    updatedAt?: Date,
  ) {
    super();
  }
}