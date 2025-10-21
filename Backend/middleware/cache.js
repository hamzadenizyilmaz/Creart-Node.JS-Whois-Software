import { getCache, setCache } from '../utils/cache.js';

export const cacheMiddleware = async (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const cacheKey = `route:${req.originalUrl}`;

  try {
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for: ${req.originalUrl}`);
      
      res.set('X-Cache', 'HIT');
      
      return res.json({
        ...JSON.parse(cachedData),
        metadata: {
          ...JSON.parse(cachedData).metadata,
          cached: true,
          cachedAt: new Date().toISOString()
        }
      });
    }

    const originalJson = res.json;
    res.json = function(data) {
      if (res.statusCode === 200 && data.success) {
        setCache(cacheKey, JSON.stringify(data), 300) // 5 minutes
          .catch(err => console.error('Cache set error:', err));
      }
      
      res.set('X-Cache', 'MISS');
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next();
  }
};