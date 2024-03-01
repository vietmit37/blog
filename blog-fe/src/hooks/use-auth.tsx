import useSWR, { SWRConfiguration } from "swr";
import { authApi } from "@/api-client/auth/auth-api";

const useAuth = (options?: Partial<SWRConfiguration>) => {
  const { data, mutate, error } = useSWR(
    "/authentication/log-in",
    () => authApi.getAuth(),
    { dedupingInterval: 2000, revalidateOnFocus: false, ...options },
  );
  async function login(data: any) {
    await authApi.getLogin(data);
    await mutate();
  }
  // async function logout() {}
  return {
    data,
    error,
    login,
  };
};
export default useAuth;
