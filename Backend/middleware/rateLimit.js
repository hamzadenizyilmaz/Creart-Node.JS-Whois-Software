import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Specific limiters for different endpoints
export const whoisRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  50, // 50 requests
  'Too many WHOIS requests, please try again later.'
);

export const dnsRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many DNS requests, please try again later.'
);

export const strictRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // 10 requests
  'Too many requests, please try again in an hour.'
);