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
  qrCode: {
    type: string;
    data: Uint8Array;
  };
  createdQrCode: string;
}

export interface Meta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  pageCount: number;
  page: number;
  take: number;
}
