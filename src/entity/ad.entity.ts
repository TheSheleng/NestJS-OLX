// entity/ad.entity.ts
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { AbstractEntity } from '../database/abstract.entity';

@Entity()
export class Ad extends AbstractEntity<Ad> {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => User)
  @Index()
  owner: User;

  @ManyToOne(() => Category)
  category: Category;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
