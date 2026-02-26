import type { Context, Next } from 'hono'

export const createRateLimiter = (windowMs: number, maxRequests: number) => {
    const requests = new Map<string, { count: number; resetTime: number }>()

    setInterval(() => {
        const now = Date.now()
        for (const [key, value] of requests) {
            if (now > value.resetTime) {
                requests.delete(key)
            }
        }
    }, windowMs)

    return async (c: Context, next: Next) => {
        const key = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'anonymous'
        const now = Date.now()
        const record = requests.get(key)

        if (!record || now > record.resetTime) {
            requests.set(key, { count: 1, resetTime: now + windowMs })
            return next()
        }

        record.count++

        if (record.count > maxRequests) {
            c.header('Retry-After', String(Math.ceil((record.resetTime - now) / 1000)))
            return c.json({ error: 'Too many requests' }, 429)
        }

        return next()
    }
}
