import { Column } from 'typeorm';

export enum Faculty {
  AI = 'Angewandte Informatik',
  SA = 'Soziale Arbeit',
}

export class RoomEntity {
  id: string;

  name: string;

  createdDate: Date;

  updatedDate: Date;

  maxParticipants: number;

  maxDuration: number;

  faculty: Faculty;

  qrCode: Uint8Array;

  createdQrCode: Date;
}
