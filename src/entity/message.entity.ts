// entity/message.entity.ts
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { Ad } from './ad.entity';
import { AbstractEntity } from '../database/abstract.entity';

@Entity()
export class Message extends AbstractEntity<Message> {
  @ManyToOne(() => User)
  @Index()
  sender: User;

  @ManyToOne(() => User)
  @Index()
  receiver: User;

  @ManyToOne(() => Ad)
  ad: Ad;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;
}
