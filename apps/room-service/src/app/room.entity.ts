import { Max, Min } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Faculty } from './faculty.enum';

@Entity()
export class RoomEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Min(1)
  @Max(200)
  @Column()
  maxParticipants: number;

  @Min(1)
  @Column()
  maxDuration: number;

  @Column({
    type: 'enum',
    enum: Faculty,
    nullable: true,
  })
  faculty?: Faculty;

  @Column({ nullable: true, type: 'bytea', select: false })
  qrCode: Uint8Array;

  @Column({ type: 'timestamptz', nullable: true, name: 'createdqrcode' })
  createdQrCode: Date;
}
