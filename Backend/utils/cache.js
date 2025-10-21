class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.isConnected = true;
  }

  async connect() {
    console.log('Memory cache initialized');
    return true;
  }

  async get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key, value, ttl = 3600) {
    const expiresAt = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiresAt });
    return true;
  }

  async del(key) {
    this.cache.delete(key);
    return true;
  }

  async exists(key) {
    return this.cache.has(key);
  }

  async flushPattern(pattern) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }
}

export const cacheManager = new MemoryCache();

export const getCache = (key) => cacheManager.get(key);
export const setCache = (key, value, ttl) => cacheManager.set(key, value, ttl);
export const deleteCache = (key) => cacheManager.del(key);
export const checkCache = (key) => cacheManager.exists(key);