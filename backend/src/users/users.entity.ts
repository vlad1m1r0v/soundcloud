import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Music } from 'src/music/music.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Users extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  hashedRT: string;

  @OneToMany(() => Music, (music) => music.user, {
    cascade: true,
  })
  music: Music[];
}
