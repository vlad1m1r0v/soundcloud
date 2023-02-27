import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Music } from 'src/music/music.entity';
import { Users } from 'src/users/users.entity';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Playlist extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  cover: string;

  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToMany(() => Music)
  @JoinTable({
    name: 'playlist_music',
    joinColumn: {
      name: 'playlist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'music_id',
      referencedColumnName: 'id',
    },
  })
  music: Music[];
}
