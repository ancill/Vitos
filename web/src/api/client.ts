import { hc } from "hono/client";
import type { AppType } from "../../../api/src/";

export const client = hc<AppType>("/api");
