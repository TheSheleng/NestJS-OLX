// entity/category.entity.ts
import { AbstractEntity } from '../database/abstract.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Ad } from './ad.entity';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Ad, (ad) => ad.category)
  ads: Ad[];
}
