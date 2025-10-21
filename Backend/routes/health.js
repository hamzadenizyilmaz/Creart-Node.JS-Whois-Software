import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { cacheManager } from '../utils/cache.js';
import { getQueryStats } from '../utils/database.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    health.cache = {
      status: cacheManager.isConnected ? 'connected' : 'disconnected',
      connected: cacheManager.isConnected
    };
  } catch (error) {
    health.cache = {
      status: 'error',
      error: error.message
    };
  }

  res.json({
    success: true,
    data: health
  });
}));

router.get('/detailed', asyncHandler(async (req, res) => {
  const startTime = Date.now();

  const checks = {
    api: { status: 'healthy', latency: null },
    cache: { status: 'unknown', latency: null },
    database: { status: 'unknown', latency: null }
  };

  checks.api.latency = `${Date.now() - startTime}ms`;

  const cacheStart = Date.now();
  try {
    if (cacheManager.isConnected) {
      await cacheManager.set('healthcheck', 'ok', 10);
      const value = await cacheManager.get('healthcheck');
      checks.cache = {
        status: value === 'ok' ? 'healthy' : 'unhealthy',
        latency: `${Date.now() - cacheStart}ms`,
        connected: true
      };
    } else {
      checks.cache = {
        status: 'disconnected',
        latency: null,
        connected: false
      };
    }
  } catch (error) {
    checks.cache = {
      status: 'error',
      latency: `${Date.now() - cacheStart}ms`,
      error: error.message,
      connected: false
    };
  }

  const dbStart = Date.now();
  try {
    const stats = await getQueryStats(1);
    checks.database = {
      status: 'healthy',
      latency: `${Date.now() - dbStart}ms`,
      recentQueries: stats.length
    };
  } catch (error) {
    checks.database = {
      status: 'error',
      latency: `${Date.now() - dbStart}ms`,
      error: error.message
    };
  }

  const allHealthy = Object.values(checks).every(check => 
    check.status === 'healthy' || check.status === 'disconnected'
  );

  const health = {
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version
    }
  };

  res.json({
    success: true,
    data: health
  });
}));

router.get('/stats', asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;

  const stats = await getQueryStats(parseInt(days));

  const summary = {
    totalQueries: stats.reduce((sum, item) => sum + item.count, 0),
    successRate: stats.reduce((sum, item) => {
      const successRate = item.successCount / item.count;
      return sum + successRate;
    }, 0) / (stats.length || 1),
    averageResponseTime: stats.reduce((sum, item) => sum + item.avgResponseTime, 0) / (stats.length || 1),
    queryTypes: {}
  };

  stats.forEach(item => {
    const queryType = item._id.queryType;
    if (!summary.queryTypes[queryType]) {
      summary.queryTypes[queryType] = 0;
    }
    summary.queryTypes[queryType] += item.count;
  });

  res.json({
    success: true,
    data: {
      summary,
      detailed: stats,
      timeframe: {
        days: parseInt(days),
        startDate: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString()
      }
    }
  });
}));

export default router;