import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignupUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  firstname: string;

  @IsOptional()
  lastname: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  passwordRepeat: string;
}
