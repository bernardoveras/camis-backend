import { Skill, User } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDTO {
  @IsNotEmpty({ message: "Informe o nome da tarefa" })
  @IsString()
  name: string;

  skills: Skill[];

  assignedById?: number;
}