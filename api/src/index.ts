import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { decode, sign, verify, jwt } from "hono/jwt";
import * as schema from "./db/schema";
import { instrument } from "@fiberplane/hono-otel";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  REDIRECT_URI: string;
};

const hello = new Hono<{ Bindings: Bindings }>().get("/", (c) => {
  return c.text("Hello Hono!");
});

// const users = new Hono<{ Bindings: Bindings }>()
//   .get("/", async (c) => {
//     const db = drizzle(c.env.DB);
//     const users = await db.select().from(schema.users);
//     return c.json({ users });
//   })
//   .post("/", async (c) => {
//     const db = drizzle(c.env.DB);
//     const { name, email } = await c.req.json();

//     await db.insert(schema.users).values({
//       name: name,
//       email: email,

//     });
//     return c.text("user: " + name + "inserted");
//   });

const googleAuth = new Hono<{ Bindings: Bindings }>()
  .get("/", async (c) => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${c.env.GOOGLE_CLIENT_ID}&redirect_uri=${c.env.REDIRECT_URI}&response_type=code&scope=email profile`;
    return c.redirect(authUrl);
  })
  .get("/callback", async (c) => {
    const code = c.req.query("code");
    if (!code) {
      return c.json({ error: "No code provided" }, 400);
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: c.env.REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const { access_token } = (await tokenResponse.json()) as {
      access_token: string;
    };

    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { id, email, name } = (await userInfoResponse.json()) as {
      id: string;
      email: string;
      name: string;
    };

    const db = drizzle(c.env.DB);
    let user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.googleId, id))
      .get();

    if (!user) {
      await db.insert(schema.users).values({ googleId: id, email, name });
      user = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.googleId, id))
        .get();
    }

    const token = await sign({ id: user?.id }, c.env.JWT_SECRET);
    return c.json({ token });
  });

const protectedRoutes = new Hono<{ Bindings: Bindings }>()
  .use("/*", (c, next) => {
    const jwtMiddleware = jwt({
      secret: c.env.JWT_SECRET,
    });
    return jwtMiddleware(c, next);
  })
  .get("/protected", (c) => c.text("This is a protected route"));

const app = new Hono<{ Bindings: Bindings }>()
  .basePath("/api")
  .route("/hello", hello)
  .route("/google", googleAuth)
  .route("/auth", protectedRoutes);

export type AppType = typeof app;
export default instrument(app);
