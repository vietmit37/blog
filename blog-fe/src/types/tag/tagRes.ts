import { IPostRes } from "@/types/post/postRes";

export interface ITagRes {
  id: number;

  name: string | null;

  createdDate: Date;

  updatedDate: Date;

  posts: IPostRes[];
}
export interface ITagandTotalRes {
  tags: ITagRes[];
  total: number;
}
