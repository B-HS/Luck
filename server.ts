import { serveStatic } from 'hono/bun'
import { app } from './app'

app.use('/globals.css', serveStatic({ path: './public/globals.css' }))

export default {
    port: 3000,
    fetch: app.fetch,
}
