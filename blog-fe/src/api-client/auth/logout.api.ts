import axios, { ApiBase } from "@/api-client/axios";

export async function logoutApi(): Promise<ApiBase> {
  return await axios.get("auth/log-out");
}
