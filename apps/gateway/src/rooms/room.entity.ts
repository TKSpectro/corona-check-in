export enum Faculty {
  AI = 'AI',
  SA = 'SA',
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
