import { client } from "@/lib/api";

export const authApi = {
  getMe: () =>
    client.api.users.me.$get().then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    }),
};
