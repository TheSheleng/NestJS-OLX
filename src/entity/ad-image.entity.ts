// entity/ad-image.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { Ad } from './ad.entity';
import { AbstractEntity } from '../database/abstract.entity';

@Entity()
export class AdImage extends AbstractEntity<AdImage> {
  @Column()
  url: string;

  @ManyToOne(() => Ad, (ad) => ad.id, { onDelete: 'CASCADE' })
  ad: Ad;
}
