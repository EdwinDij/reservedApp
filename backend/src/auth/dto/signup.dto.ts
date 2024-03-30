import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
