import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDTO {
  @IsNotEmpty({ message: "Informe um e-mail" })
  @IsEmail({}, { message: "Informe um e-mail válido" })
  email: string;

  @IsNotEmpty({ message: "Informe uma senha" })
  @IsString()
  password: string;
}