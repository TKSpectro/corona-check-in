export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const FacultyList = ['', 'AI', 'SA'] as const;

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
  qrCode: null;
  createdQrCode: Date;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime?: Date;
  infected: boolean;
  note?: string;
}

export type Meta = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  pageCount: number;
  page: number;
  take: number;
};

export type PaginationResponse<T> = {
  data: T[];
  _meta: Meta;
};

export interface ScanQrCodeBody {
  roomId: string;
  createdQrCode: Date;
}

export interface IncidenceResult {
  name: string;
  series: { name: string; value: number }[];
}
