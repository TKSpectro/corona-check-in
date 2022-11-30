import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from './user.entity';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  firstname: string;

  @IsOptional()
  lastname: string;

  @IsOptional()
  oldPassword: string;

  @IsOptional()
  newPassword: string;

  @IsOptional()
  newPasswordRepeat: string;

  @IsOptional()
  @IsIn(Object.values(UserRole))
  role: UserRole;
}
