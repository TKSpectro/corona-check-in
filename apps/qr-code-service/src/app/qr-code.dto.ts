import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class QRCodeData {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
