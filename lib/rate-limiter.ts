import type { Context, Next } from 'hono'

const MAX_CLIENTS = 10_000

const extractClientIp = (c: Context): string => {
    const forwarded = c.req.header('x-forwarded-for')
    if (forwarded) {
        const ips = forwarded.split(',').map((ip) => ip.trim())
        return ips[ips.length - 1] ?? 'anonymous'
    }
    return c.req.header('x-real-ip') ?? 'anonymous'
}

export const createRateLimiter = (windowMs: number, maxRequests: number) => {
    const requests = new Map<string, { count: number; resetTime: number }>()
    let lastCleanup = Date.now()

    const cleanup = (now: number) => {
        if (now - lastCleanup < windowMs) return
        lastCleanup = now
        for (const [key, value] of requests) {
            if (now > value.resetTime) {
                requests.delete(key)
            }
        }
    }

    return async (c: Context, next: Next) => {
        const now = Date.now()
        cleanup(now)

        if (requests.size >= MAX_CLIENTS) {
            return c.json({ error: 'Too many requests' }, 429)
        }

        const key = extractClientIp(c)
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
