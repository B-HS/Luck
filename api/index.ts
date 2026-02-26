import { handle } from "hono/vercel";
import { app } from "../app.ts";

export const GET = handle(app);
export const POST = handle(app);
