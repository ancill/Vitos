import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import * as schema from "../db/schema";
import { Bindings } from "../types";

export async function handleGoogleCallback(c: Context<{ Bindings: Bindings }>) {
  try {
    const code = c.req.query("code");
    if (!code) {
      return redirectWithError(c, "no_code");
    }

    const accessToken = await exchangeCodeForToken(c, code);
    if (!accessToken) {
      return redirectWithError(c, "token_exchange_failed");
    }

    const userInfo = await fetchGoogleUserInfo(accessToken);
    if (!userInfo) {
      return redirectWithError(c, "user_info_failed");
    }

    const user = await getOrCreateUser(c, userInfo);
    if (!user) {
      return redirectWithError(c, "database_error");
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    setCookie(c, "token", token, {
      sameSite: "Strict",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: true,
    });

    return c.redirect(c.env.FRONTEND_URL);
  } catch (error) {
    console.error("Auth callback error:", error);
    return redirectWithError(c, "unexpected_error");
  }
}

// Helper functions
async function exchangeCodeForToken(
  c: Context<{ Bindings: Bindings }>,
  code: string
) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
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

  if (!response.ok) return null;
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) return null;
  return response.json();
}

async function getOrCreateUser(
  c: Context<{ Bindings: Bindings }>,
  userInfo: any
) {
  const db = drizzle(c.env.DB);
  let user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.googleId, userInfo.id))
    .get();

  if (!user) {
    await db.insert(schema.users).values({
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
    });
    user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.googleId, userInfo.id))
      .get();
  }

  return user;
}

function redirectWithError(c: Context<{ Bindings: Bindings }>, error: string) {
  return c.redirect(`${c.env.FRONTEND_URL}?error=${error}`, 302);
}
