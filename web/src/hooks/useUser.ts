import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api";
import { InferResponseType } from "hono/client";

export type UserResponse = InferResponseType<
  typeof client.api.private.user.$get
>;
export type User = InferResponseType<typeof client.api.private.user.$get, 200>;
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () =>
      client.api.private.user.$get().then(async (res) => {
        return await res.json();
      }),
  });
}
