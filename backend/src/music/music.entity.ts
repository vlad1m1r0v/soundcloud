import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Users } from 'src/users/users.entity';
import { Entity, Column, RelationId, ManyToOne } from 'typeorm';

@Entity()
export class Music extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  artist: string;

  @Column()
  url: string;

  @RelationId((music: Music) => music.user)
  @Column()
  readonly userId: string;

  @ManyToOne(() => Users, (user) => user.music, {
    onDelete: 'CASCADE',
  })
  user: Users;
}
