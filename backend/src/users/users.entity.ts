import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Music } from 'src/music/music.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class Users extends AbstractEntity {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ name: 'hashed_rt', nullable: true })
  @Exclude({ toPlainOnly: true })
  hashedRT: string;

  @OneToMany(() => Music, (music) => music.user, {
    cascade: true,
  })
  music: Music[];

  @OneToMany(() => Music, (music) => music.user, {
    cascade: true,
  })
  playlists: Playlist[];
}
