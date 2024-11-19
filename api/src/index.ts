import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { decode, sign, verify, jwt } from "hono/jwt";
import * as schema from "./db/schema";
import { instrument } from "@fiberplane/hono-otel";
import { HTTPException } from "hono/http-exception";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  REDIRECT_URI: string;
  FRONTEND_URL: string;
};

const hello = new Hono<{ Bindings: Bindings }>().get("/", (c) => {
  return c.text("Hello Hono!");
});

const logout = new Hono<{ Bindings: Bindings }>().get("/", (c) => {
  deleteCookie(c, "token", {
    path: "/",
    secure: true,
  });

  return c.redirect(c.env.FRONTEND_URL);
});

const googleAuth = new Hono<{ Bindings: Bindings }>()
  .get("/", async (c) => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${c.env.GOOGLE_CLIENT_ID}&redirect_uri=${c.env.REDIRECT_URI}&response_type=code&scope=email profile`;
    return c.redirect(authUrl);
  })
  .get("/callback", async (c) => {
    try {
      const code = c.req.query("code");
      if (!code) {
        return c.redirect(`${c.env.FRONTEND_URL}?error=no_code`, 302);
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

      if (!tokenResponse.ok) {
        console.error("Token exchange failed:", await tokenResponse.text());
        return c.redirect(
          `${c.env.FRONTEND_URL}?error=token_exchange_failed`,
          302
        );
      }

      const { access_token } = (await tokenResponse.json()) as {
        access_token: string;
      };

      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (!userInfoResponse.ok) {
        console.error(
          "User info retrieval failed:",
          await userInfoResponse.text()
        );
        return c.redirect(`${c.env.FRONTEND_URL}?error=user_info_failed`, 302);
      }

      const { id, email, name } = (await userInfoResponse.json()) as {
        id: string;
        email: string;
        name: string;
      };

      const db = drizzle(c.env.DB);
      let user;

      try {
        user = await db
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
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        // TODO: make this url avaliable on frontend
        return c.redirect(`${c.env.FRONTEND_URL}?error=database_error`, 302);
      }

      const token = await sign({ id: user?.id }, c.env.JWT_SECRET);

      setCookie(c, "token", token, {
        sameSite: "Strict",
        httpOnly: true,
        maxAge: 10000,
        secure: true,
      });
      return c.redirect(c.env.FRONTEND_URL, 302);
    } catch (error) {
      console.error("Unexpected error:", error);
      return c.redirect(`${c.env.FRONTEND_URL}?error=unexpected_error`, 302);
    }
  });

const protectedRoutes = new Hono<{ Bindings: Bindings }>()
  .use("/*", (c, next) => {
    const jwtMiddleware = jwt({
      secret: c.env.JWT_SECRET,
      cookie: "token",
    });
    return jwtMiddleware(c, next);
  })
  .get("/user", async (c) => {
    const db = drizzle(c.env.DB);
    const { id } = c.get("jwtPayload");
    let user;
    try {
      user = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .get();
    } catch (dbError) {
      throw new HTTPException(401, {
        message: "Database operation failed:",
        cause: dbError,
      });
    }
    if (!user) {
      throw new HTTPException(401, {
        message: "User not found",
      });
    }

    return c.json(user, 200);
  });

const app = new Hono<{ Bindings: Bindings }>()
  .basePath("/api")
  .route("/hello", hello)
  .route("/google", googleAuth)
  .route("/logout", logout)
  .route("/private", protectedRoutes)
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    return c.text("error");
  });

export type AppType = typeof app;
export default instrument(app);
