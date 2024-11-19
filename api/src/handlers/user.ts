import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import * as schema from "../db/schema";
import { Bindings } from "../types";

export async function getUserProfile(c: Context<{ Bindings: Bindings }>) {
  const db = drizzle(c.env.DB);
  const { id } = c.get("jwtPayload");

  try {
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .get();

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return c.json(user);
  } catch (error) {
    throw new HTTPException(500, {
      message: "Failed to fetch user profile",
      cause: error,
    });
  }
}
