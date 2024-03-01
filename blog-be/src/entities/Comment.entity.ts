import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Transform } from 'class-transformer';
import { Transformation } from '@helpers/transformation.helper';
import { User } from '@entities/User.entity';
import { Post } from '@entities/Post.entity';

@Index('comments_pkey', ['id'], { unique: true })
@Entity('comments', { schema: 'public' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'content', nullable: true })
  content: string | null;

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

  @ManyToOne(() => User, (user) => user.comment, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Post, (post) => post.comment, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;
}
