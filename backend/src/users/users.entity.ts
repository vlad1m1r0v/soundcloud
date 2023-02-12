import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
