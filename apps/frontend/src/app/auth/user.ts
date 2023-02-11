import { UserRole } from '../shared/types';

export interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  role?: UserRole;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserSignup {
  email: string;
  firstname?: string;
  lastname?: string;
  password: string;
  passwordRepeat: string;
}
