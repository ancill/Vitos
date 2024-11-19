import { Context, Next } from "hono";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { Bindings } from "../types";

export async function errorHandler(err: Error, c: Context) {
  if (err instanceof HTTPException) {
    const response = err.getResponse();
    return response;
  }

  console.error("Unhandled error:", err);
  return c.json(
    {
      status: "error",
      message: "Internal server error",
    },
    500
  );
}
