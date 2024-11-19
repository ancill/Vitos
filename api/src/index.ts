import { Hono } from "hono";
import { instrument } from "@fiberplane/hono-otel";
import { deleteCookie } from "hono/cookie";

import { handleGoogleCallback } from "./handlers/auth";

import { errorHandler } from "./middleware";
import { getUserProfile } from "./handlers/user";
import { jwt } from "hono/jwt";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  REDIRECT_URI: string;
  FRONTEND_URL: string;
};

// Create auth routes
const authRoutes = new Hono<{ Bindings: Bindings }>()
  .get("/login/google", async (c) => {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", c.env.GOOGLE_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", c.env.REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", "email profile");

    return c.redirect(authUrl.toString());
  })
  .get("/login/google/callback", handleGoogleCallback)
  .get("/logout", (c) => {
    deleteCookie(c, "token", {
      path: "/",
      secure: true,
    });
    return c.redirect(c.env.FRONTEND_URL);
  });

const protectedRoutes = new Hono<{ Bindings: Bindings }>()
  .use("/*", async (c, next) => {
    const jwtMiddleware = jwt({
      secret: c.env.JWT_SECRET,
      cookie: "token",
    });
    return jwtMiddleware(c, next);
  })
  .get("/me", getUserProfile);

const app = new Hono<{ Bindings: Bindings }>()
  .basePath("/api")
  .route("/auth", authRoutes)
  .route("/users", protectedRoutes)
  .onError(errorHandler);

export type AppType = typeof app;
export default instrument(app);
