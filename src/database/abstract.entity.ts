import { PrimaryGeneratedColumn, Column } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
