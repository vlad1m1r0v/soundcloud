import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Users } from 'src/users/users.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Music extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  artist: string;

  @Column()
  url: string;

  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  readonly user: Users;
}
