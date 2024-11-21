// entity/admin-action.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Ad } from './ad.entity';
import { AbstractEntity } from '../database/abstract.entity';

@Entity()
export class AdminAction extends AbstractEntity<AdminAction> {
  @ManyToOne(() => User)
  admin: User;

  @Column()
  actionType: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Ad, { nullable: true })
  ad: Ad;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
