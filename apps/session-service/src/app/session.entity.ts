import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'starttime' })
  startTime: Date;

  @Column({ nullable: true, type: 'timestamptz', name: 'endtime' })
  endTime: Date;

  @Column({ default: false, type: 'bool' })
  infected: boolean;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'uuid', name: 'userid' })
  userId: string;

  @Column({ type: 'uuid', name: 'roomid' })
  roomId: string;
}
