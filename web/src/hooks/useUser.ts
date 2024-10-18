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
      client.api.private.user
        .$get(
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(async (res) => {
          // if (res.status === 404) {
          //   const data: { error: string } = await res.json();
          //   console.log(data.error);
          // }

          return await res.json();
        }),
  });
}
