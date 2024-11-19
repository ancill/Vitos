import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { authQueryKeys } from "../query-keys";

export function useUser() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: authApi.getMe,
  });
}
