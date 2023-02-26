import { AbstractEntity } from 'src/data/entities/abstract.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Genre extends AbstractEntity {
  @Column()
  name: string;
}
