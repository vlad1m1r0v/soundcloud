import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Genre } from 'src/genre/genre.entity';
import { Users } from 'src/users/users.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

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
  user: Users;

  @ManyToMany(() => Genre)
  @JoinTable({
    name: 'music_genre',
    joinColumn: {
      name: 'music_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'genre_id',
      referencedColumnName: 'id',
    },
  })
  genres: Genre[];
}
