import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  endTime: Date;

  @Column({ type: 'bool' })
  infected: boolean;

  @Column({ nullable: true })
  note: string;
}
