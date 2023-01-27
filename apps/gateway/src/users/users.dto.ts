import { UserRole } from '@corona-check-in/micro-service-shared';
import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';

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

export interface findAllQueryDto {
  search?: string;
  role?: UserRole;
}
