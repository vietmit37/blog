import { IUserRes } from "@/types/user/userRes";
import { ICommentRes } from "@/types/comment/commentRes";
import { ITagRes } from "@/types/tag/tagRes";

export interface IPostRes {
  id: number;

  title: string | null;

  content: string | null;

  createdDate: Date;

  updatedDate: Date;

  tags?: ITagRes[];

  user: IUserRes;

  comment: ICommentRes[];
}
export interface IPostsAndTotalRes {
  posts: IPostRes[];
  total: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
  lastPage: number;
}
