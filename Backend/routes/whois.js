import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateWhoisQuery } from '../middleware/validation.js';
import { whoisRateLimiter } from '../middleware/rateLimit.js';
import { whoisLookup, getDNSRecords, bulkWhoisLookup, bulkDNSLookup } from '../utils/whoisParser.js';
import { formatWhoisResponse, formatDNSResponse, formatBulkResponse } from '../utils/responseFormatter.js';
import { isValidDomain, isValidIP } from '../utils/ipTools.js';
import { logQuery } from '../utils/database.js';
import { getCache, setCache } from '../utils/cache.js';

const router = express.Router();

router.post('/lookup', 
  whoisRateLimiter,
  validateWhoisQuery,
  asyncHandler(async (req, res) => {
    const { query, queryType = 'auto' } = req.body;
    const startTime = Date.now();
    
    let actualQueryType = queryType;
    if (queryType === 'auto') {
      actualQueryType = isValidDomain(query) ? 'domain' : isValidIP(query) ? 'ip' : 'domain';
    }

    const cacheKey = `whois:${query}:${actualQueryType}`;
    const cachedResult = await getCache(cacheKey);
    
    if (cachedResult) {
      const responseTime = Date.now() - startTime;
      
      await logQuery({
        query,
        queryType: actualQueryType,
        result: { success: true, cached: true },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.json({
        success: true,
        data: JSON.parse(cachedResult),
        metadata: {
          query,
          queryType: actualQueryType,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          cached: true
        }
      });
    }

    try {
      const whoisData = await whoisLookup(query, actualQueryType);
      const responseTime = Date.now() - startTime;

      await setCache(cacheKey, JSON.stringify(whoisData), 3600);

      await logQuery({
        query,
        queryType: actualQueryType,
        result: { success: true, dataLength: whoisData.rawData?.length || 0 },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        data: whoisData,
        metadata: {
          query,
          queryType: actualQueryType,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          cached: false
        }
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      await logQuery({
        query,
        queryType: actualQueryType,
        error: error.message,
        success: false,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      throw error;
    }
  })
);

router.post('/dns-records',
  whoisRateLimiter,
  asyncHandler(async (req, res) => {
    const { domain } = req.body;
    const startTime = Date.now();

    if (!domain || !isValidDomain(domain)) {
      return res.status(400).json({
        success: false,
        error: 'Valid domain is required'
      });
    }

    const cacheKey = `dns:${domain}:all`;
    const cachedResult = await getCache(cacheKey);
    
    if (cachedResult) {
      const responseTime = Date.now() - startTime;

      await logQuery({
        query: domain,
        queryType: 'dns',
        recordType: 'ALL',
        result: { success: true, cached: true },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.json({
        success: true,
        data: JSON.parse(cachedResult),
        metadata: {
          domain,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          cached: true
        }
      });
    }

    try {
      const dnsData = await getDNSRecords(domain);
      const responseTime = Date.now() - startTime;

      await setCache(cacheKey, JSON.stringify(dnsData), 300);

      await logQuery({
        query: domain,
        queryType: 'dns',
        recordType: 'ALL',
        result: { success: true, recordCount: dnsData.recordCount },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        data: dnsData,
        metadata: {
          domain,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          cached: false
        }
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;

      await logQuery({
        query: domain,
        queryType: 'dns',
        recordType: 'ALL',
        error: error.message,
        success: false,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      throw error;
    }
  })
);

router.post('/full-report',
  whoisRateLimiter,
  asyncHandler(async (req, res) => {
    const { query, queryType = 'auto' } = req.body;
    const startTime = Date.now();
    
    let actualQueryType = queryType;
    if (queryType === 'auto') {
      actualQueryType = isValidDomain(query) ? 'domain' : isValidIP(query) ? 'ip' : 'domain';
    }

    // Check cache
    const cacheKey = `full:${query}:${actualQueryType}`;
    const cachedResult = await getCache(cacheKey);
    
    if (cachedResult) {
      const responseTime = Date.now() - startTime;

      await logQuery({
        query,
        queryType: actualQueryType,
        result: { success: true, fullReport: true, cached: true },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.json(JSON.parse(cachedResult));
    }

    try {
      let whoisData, dnsData;
      
      whoisData = await whoisLookup(query, actualQueryType);
      
      if (actualQueryType === 'domain') {
        try {
          dnsData = await getDNSRecords(query);
        } catch (dnsError) {
          dnsData = { error: dnsError.message };
        }
      }

      const responseTime = Date.now() - startTime;
      
      const fullReport = {
        success: true,
        data: {
          query,
          queryType: actualQueryType,
          whois: whoisData,
          dns: dnsData,
          summary: {
            hasWhois: !!whoisData,
            hasDNS: !!dnsData && !dnsData.error,
            totalRecords: dnsData?.recordCount || 0
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          cached: false
        }
      };

      await setCache(cacheKey, JSON.stringify(fullReport), 1800);

      await logQuery({
        query,
        queryType: actualQueryType,
        result: { success: true, fullReport: true },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(fullReport);
    } catch (error) {
      const responseTime = Date.now() - startTime;

      await logQuery({
        query,
        queryType: actualQueryType,
        error: error.message,
        success: false,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      throw error;
    }
  })
);

router.post('/bulk',
  whoisRateLimiter,
  asyncHandler(async (req, res) => {
    const { queries, queryType = 'domain' } = req.body;
    const startTime = Date.now();
    
    if (!Array.isArray(queries) || queries.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Queries array is required'
      });
    }

    if (queries.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 queries allowed'
      });
    }

    const results = await bulkWhoisLookup(queries, queryType);
    const totalTime = Date.now() - startTime;

    res.json({
      success: true,
      data: results,
      metadata: {
        queryType,
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        timestamp: new Date().toISOString(),
        totalTime: `${totalTime}ms`
      }
    });
  })
);

router.post('/bulk-dns',
  whoisRateLimiter,
  asyncHandler(async (req, res) => {
    const { domains } = req.body;
    const startTime = Date.now();
    
    if (!Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Domains array is required'
      });
    }

    if (domains.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 domains allowed'
      });
    }

    const results = await bulkDNSLookup(domains);
    const totalTime = Date.now() - startTime;

    res.json({
      success: true,
      data: results,
      metadata: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        timestamp: new Date().toISOString(),
        totalTime: `${totalTime}ms`
      }
    });
  })
);

router.get('/raw/:query',
  whoisRateLimiter,
  asyncHandler(async (req, res) => {
    const { query } = req.params;
    const { queryType = 'auto' } = req.query;
    const startTime = Date.now();

    let actualQueryType = queryType;
    if (queryType === 'auto') {
      actualQueryType = isValidDomain(query) ? 'domain' : isValidIP(query) ? 'ip' : 'domain';
    }

    try {
      const whoisData = await whoisLookup(query, actualQueryType);
      const responseTime = Date.now() - startTime;

      res.json({
        success: true,
        data: {
          query,
          queryType: actualQueryType,
          rawData: whoisData.rawData,
          whoisServer: whoisData.whoisServer,
          timestamp: new Date().toISOString()
        },
        metadata: {
          responseTime: `${responseTime}ms`,
          dataLength: whoisData.rawData.length
        }
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      throw error;
    }
  })
);

export default router;