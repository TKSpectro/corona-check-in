export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  role?: UserRole;
  deleted?: boolean;
}

export interface UpdateUser extends User {
  oldPassword?: string;
  newPassword?: string;
  newPasswordRepeat?: string;
}

export interface Room {
  id: string;
  name: string;
  createdDate: string;
  updatedDate: string;
  maxParticipants: number;
  maxDuration: number;
  faculty: string;
  qrCode: string;
  createdQrCode: string;
}

export interface Session {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  infected: boolean;
  note?: string;
}
