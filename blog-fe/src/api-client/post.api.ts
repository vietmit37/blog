import axios, { ApiBase } from "@/api-client/axios";
import { IPostsAndTotalRes } from "@/types/post/postRes";

export async function postApi(
  page: number,
  limit: number,
): Promise<ApiBase<IPostsAndTotalRes>> {
  return await axios.get(`posts/user?page=${page}&item_per_page=${limit}`);
}
