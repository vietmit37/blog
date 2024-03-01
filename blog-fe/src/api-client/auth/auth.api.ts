import { IUserRes } from "@/types/user/userRes";
import axios, { ApiBase } from "@/api-client/axios";

export async function authApi(): Promise<ApiBase<IUserRes>> {
  return await axios.get("auth");
}
