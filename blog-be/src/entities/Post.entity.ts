import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Transform } from 'class-transformer';
import { Transformation } from '@helpers/transformation.helper';
import { Tag } from '@entities/Tag.entity';
import { User } from '@entities/User.entity';
import { Comment } from '@entities/Comment.entity';

@Index('posts_pkey', ['id'], { unique: true })
@Entity('posts', { schema: 'public' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title', nullable: true })
  title: string | null;

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

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag',
    joinColumns: [{ name: 'post_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'tag_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.posts, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];
}
