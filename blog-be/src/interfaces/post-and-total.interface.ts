import { Post } from '@entities/Post.entity';

export interface PostsAndTotal {
  posts: Post[];
  total: number;
}
export interface PostsAndTotalPagnation {
  posts: Post[];
  total: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
  lastPage: number;
}
