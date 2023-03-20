import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignupUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  passwordRepeat: string;
}
