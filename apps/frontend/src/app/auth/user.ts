export interface User {
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
