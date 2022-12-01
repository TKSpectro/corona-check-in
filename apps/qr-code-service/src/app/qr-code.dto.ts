import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class QRCodeData {
  @IsNotEmpty()
  @IsISO8601()
  generatedAt: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
