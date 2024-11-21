// entity/category.entity.ts
import { AbstractEntity } from '../database/abstract.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column({ unique: true })
  name: string;
}
