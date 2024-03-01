import { IUserRes } from "@/types/user/userRes";
import { IPostRes } from "@/types/post/postRes";

export interface ICommentRes {
  id: number;

  content: string | null;

  createdDate: Date;

  updatedDate: Date;

  user: IUserRes;

  post: IPostRes;
}
export interface ICommentsAndTotalRes {
  comments: ICommentRes[];
  total: number;
}
