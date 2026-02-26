import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.ts";

export type DrizzleDb = ReturnType<typeof createDb>;

export const createDb = (options: { url: string; authToken?: string }) => {
  const client = createClient(options);
  return drizzle(client, { schema });
};
