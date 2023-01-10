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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  name: string;

  @Column({ type: 'timestamptz', name: 'starttime' })
  startTime: Date;

  @Column({ nullable: true, type: 'timestamptz', name: 'endtime' })
  endTime: Date;

  @Column({ type: 'bool' })
  infected: boolean;

  @Column({ nullable: true })
  note: string;
}
