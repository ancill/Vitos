import { client } from "@/lib/api";

import { InferResponseType } from "hono/client";

export type User = InferResponseType<typeof client.api.users.me.$get, 200>;
