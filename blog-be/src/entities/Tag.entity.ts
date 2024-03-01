import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Transform } from 'class-transformer';
import { Transformation } from '@helpers/transformation.helper';
import { Post } from '@entities/Post.entity';

@Index('tags_pkey', ['id'], { unique: true })
@Entity('tags', { schema: 'public' })
export class Tag {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'nameTag', nullable: true })
  name: string | null;

  @Transform(({ value }) => Transformation.mapDateToString(value))
  @Column('timestamp without time zone', {
    name: 'created_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;

  @Transform(({ value }) => Transformation.mapDateToString(value))
  @UpdateDateColumn({
    name: 'updated_date',
    type: 'timestamp without time zone',
  })
  updatedDate: Date;

  @ManyToMany(() => Post, (post) => post.tags)
  @JoinTable({
    name: 'post_tag',
    joinColumns: [{ name: 'tag_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'post_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  posts: Post[];
}
