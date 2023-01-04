import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaxLength, MinLength } from 'class-validator';

export enum Faculty {
  AI = 'Angewandte Informatik',
  SA = 'Soziale Arbeit',
}

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

  @MinLength(1)
  @MaxLength(60)
  @Column()
  maxParticipants: number;

  @MinLength(1)
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
}
