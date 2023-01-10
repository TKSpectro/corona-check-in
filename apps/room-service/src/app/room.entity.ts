import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Max, Min } from 'class-validator';
import { Faculty } from './faculty.enum';

@Entity()
export class RoomEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Min(1)
  @Max(60)
  @Column()
  maxParticipants: number;

  @Min(1)
  @Column()
  maxDuration: number;

  @Column({
    type: 'enum',
    enum: Faculty,
    default: Faculty.AI,
  })
  faculty: Faculty;

  @Column({ nullable: true, type: 'bytea' })
  qrCode: Uint8Array;

  @Column({ nullable: true })
  createdQrCode: Date;
}
