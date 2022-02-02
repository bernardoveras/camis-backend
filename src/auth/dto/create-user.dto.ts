import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { AuthDTO } from ".";

export class CreateUserDTO extends PartialType(AuthDTO){
  @IsNotEmpty({ message: "Informe um nome" })
  name: string;
}