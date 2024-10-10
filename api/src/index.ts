import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import * as schema from "./db/schema";
import { instrument } from "@fiberplane/hono-otel";
type Bindings = {
  DB: D1Database;
};

const hono = new Hono<{ Bindings: Bindings }>();

const hello = new Hono<{ Bindings: Bindings }>().get("/", (c) => {
  return c.text("Hello Hono!");
});

const users = new Hono<{ Bindings: Bindings }>()
  .get("/", async (c) => {
    const db = drizzle(c.env.DB);
    const users = await db.select().from(schema.users);
    return c.json({ users });
  })
  .post("/", async (c) => {
    const db = drizzle(c.env.DB);
    const { name, email } = await c.req.json();

    await db.insert(schema.users).values({
      name: name,
      email: email,
    });
    return c.text("user: " + name + "inserted");
  });

const app = new Hono<{ Bindings: Bindings }>()
  .basePath("/api")
  .route("/hello", hello)
  .route("/users", users);

export type AppType = typeof app;
export default instrument(app);
