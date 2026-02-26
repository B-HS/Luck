import { drizzle } from 'drizzle-orm/libsql/http'
import { createClient } from '@libsql/client/http'
import * as schema from './schema'

export type DrizzleDb = ReturnType<typeof createDb>

export const createDb = (options: { url: string; authToken?: string }) => {
    const client = createClient(options)
    return drizzle(client, { schema })
}
