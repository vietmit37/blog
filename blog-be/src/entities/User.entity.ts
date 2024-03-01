import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Transform } from 'class-transformer';
import { Transformation } from '@helpers/transformation.helper';
import { Post } from '@entities/Post.entity';
import { Comment } from '@entities/Comment.entity';

@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'username', nullable: true })
  username: string | null;

  @Column('character varying', { name: 'password', nullable: true })
  password: string | null;

  @Column('character varying', { name: 'email', nullable: true })
  email: string | null;

  @Column('character varying', { name: 'full_name', nullable: true })
  fullName: string | null;

  @Column('character varying', { name: 'phone', nullable: true })
  phone: string | null;

  @Column('character varying', { name: 'address', nullable: true })
  address: string | null;

  @Column('timestamp without time zone', { name: 'dob', nullable: true })
  dob: Date | null;

  @Column('smallint', { name: 'gender', nullable: true })
  gender: number | null;

  @Column('character varying', { name: 'avatar_url', nullable: true })
  avatarUrl: string | null;

  @Column('smallint', { name: 'type', nullable: true })
  type: number | null;

  @Column('smallint', { name: 'activity_status', nullable: true })
  activityStatus: number | null;

  @Column('character varying', { name: 'hashed_refresh_token', nullable: true })
  hashedRefreshToken: string | null;

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

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];
}
