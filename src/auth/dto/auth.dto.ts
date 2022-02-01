import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from "class-validator";

export class AuthDTO{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}