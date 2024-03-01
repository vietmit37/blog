import { Comment } from '@entities/Comment.entity';

export interface CommentsAndTotal {
  comments: Comment[];
  total: number;
}
