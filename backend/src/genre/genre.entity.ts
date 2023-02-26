import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Music } from 'src/music/music.entity';
import { Entity, Column, ManyToMany } from 'typeorm';

@Entity()
export class Genre extends AbstractEntity {
  @Column()
  name: string;

  @ManyToMany(() => Music, (music) => music.genres, { onDelete: 'CASCADE' })
  music: Music[];
}
