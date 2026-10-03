/**
 * Lightweight, in-memory rate limiter for serverless Next.js API routes.
 * Uses a sliding token window per client IP to prevent abuse and spam submissions.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if a request from the given identifier exceeds the rate limit.
 * @param identifier Client IP or request identifier
 * @param limit Maximum number of requests allowed within the window
 * @param windowMs Window duration in milliseconds (default: 60 seconds)
 * @returns { isAllowed: boolean; remaining: number; resetInMs: number }
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 8,
  windowMs: number = 60 * 1000
): { isAllowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      isAllowed: true,
      remaining: limit - 1,
      resetInMs: windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      isAllowed: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetTime - now),
    };
  }

  record.count += 1;
  return {
    isAllowed: true,
    remaining: limit - record.count,
    resetInMs: Math.max(0, record.resetTime - now),
  };
}

/**
 * Extracts a safe client IP identifier from standard proxy/CDN headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
