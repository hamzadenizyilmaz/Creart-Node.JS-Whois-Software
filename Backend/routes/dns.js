import express from 'express';
import dns from 'dns/promises';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateDnsQuery } from '../middleware/validation.js';
import { dnsRateLimiter } from '../middleware/rateLimit.js';
import { formatDNSResponse } from '../utils/responseFormatter.js';
import { isValidDomain, isValidIP } from '../utils/ipTools.js';
import { logQuery } from '../utils/database.js';
import { getCache, setCache } from '../utils/cache.js';

const router = express.Router();

// Supported DNS record types
const SUPPORTED_RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'SRV', 'PTR', 'CAA'];

// DNS lookup for specific record type
router.post('/lookup',
  dnsRateLimiter,
  validateDnsQuery,
  asyncHandler(async (req, res) => {
    const { domain, recordType = 'A' } = req.body;
    const startTime = Date.now();

    if (!SUPPORTED_RECORD_TYPES.includes(recordType.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Unsupported record type. Supported: ${SUPPORTED_RECORD_TYPES.join(', ')}`
      });
    }

    if (!isValidDomain(domain)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid domain format'
      });
    }

    // Check cache
    const cacheKey = `dns:${domain}:${recordType}`;
    const cachedResult = await getCache(cacheKey);
    
    if (cachedResult) {
      const responseTime = Date.now() - startTime;

      await logQuery({
        query: domain,
        queryType: 'dns',
        recordType: recordType.toUpperCase(),
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
          recordType: recordType.toUpperCase(),
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          cached: true
        }
      });
    }

    try {
      let records;
      const upperRecordType = recordType.toUpperCase();

      switch (upperRecordType) {
        case 'A':
          records = await dns.resolveA(domain);
          break;
        case 'AAAA':
          records = await dns.resolveAAAA(domain);
          break;
        case 'MX':
          records = await dns.resolveMX(domain);
          break;
        case 'TXT':
          records = await dns.resolveTXT(domain);
          break;
        case 'NS':
          records = await dns.resolveNS(domain);
          break;
        case 'CNAME':
          records = await dns.resolveCNAME(domain);
          break;
        case 'SOA':
          records = await dns.resolveSOA(domain);
          break;
        case 'SRV':
          records = await dns.resolveSRV(domain);
          break;
        case 'PTR':
          return res.status(400).json({
            success: false,
            error: 'PTR records require IP address. Use /dns/ptr endpoint.'
          });
        case 'CAA':
          try {
            records = await dns.resolve(domain, 'CAA');
          } catch {
            records = [];
          }
          break;
        default:
          records = await dns.resolve(domain, upperRecordType);
      }

      const formattedResponse = formatDNSResponse(records, domain, upperRecordType);
      const responseTime = Date.now() - startTime;

      // Cache for 5 minutes
      await setCache(cacheKey, JSON.stringify(formattedResponse), 300);

      await logQuery({
        query: domain,
        queryType: 'dns',
        recordType: upperRecordType,
        result: { 
          success: true, 
          recordCount: Array.isArray(records) ? records.length : 1 
        },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        data: formattedResponse,
        metadata: {
          domain,
          recordType: upperRecordType,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          recordCount: Array.isArray(records) ? records.length : 1,
          cached: false
        }
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;

      await logQuery({
        query: domain,
        queryType: 'dns',
        recordType: recordType.toUpperCase(),
        error: error.message,
        success: false,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      if (error.code === 'ENOTFOUND') {
        return res.status(404).json({
          success: false,
          error: 'Domain not found'
        });
      }

      if (error.code === 'ENODATA') {
        return res.status(404).json({
          success: false,
          error: `No ${recordType} records found`
        });
      }

      throw error;
    }
  })
);

// PTR record lookup (Reverse DNS)
router.get('/ptr/:ip',
  dnsRateLimiter,
  asyncHandler(async (req, res) => {
    const { ip } = req.params;
    const startTime = Date.now();

    if (!isValidIP(ip)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid IP address'
      });
    }

    // Check cache
    const cacheKey = `dns:ptr:${ip}`;
    const cachedResult = await getCache(cacheKey);
    
    if (cachedResult) {
      const responseTime = Date.now() - startTime;

      await logQuery({
        query: ip,
        queryType: 'dns',
        recordType: 'PTR',
        result: { success: true, cached: true },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.json(JSON.parse(cachedResult));
    }

    try {
      const records = await dns.reverse(ip);
      const responseTime = Date.now() - startTime;

      const result = {
        success: true,
        data: {
          ip,
          records,
          timestamp: new Date().toISOString()
        },
        metadata: {
          recordType: 'PTR',
          recordCount: records.length,
          responseTime: `${responseTime}ms`,
          cached: false
        }
      };

      // Cache for 1 hour
      await setCache(cacheKey, JSON.stringify(result), 3600);

      await logQuery({
        query: ip,
        queryType: 'dns',
        recordType: 'PTR',
        result: { success: true, recordCount: records.length },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(result);
    } catch (error) {
      const responseTime = Date.now() - startTime;

      await logQuery({
        query: ip,
        queryType: 'dns',
        recordType: 'PTR',
        error: error.message,
        success: false,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      if (error.code === 'ENOTFOUND') {
        return res.status(404).json({
          success: false,
          error: 'No PTR records found'
        });
      }

      throw error;
    }
  })
);

// All DNS records for a domain
router.get('/all/:domain',
  dnsRateLimiter,
  asyncHandler(async (req, res) => {
    const { domain } = req.params;
    const startTime = Date.now();

    if (!isValidDomain(domain)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid domain format'
      });
    }

    // Check cache
    const cacheKey = `dns:all:${domain}`;
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

      return res.json(JSON.parse(cachedResult));
    }

    try {
      const allRecords = {};
      
      // Resolve all record types
      for (const recordType of SUPPORTED_RECORD_TYPES) {
        if (recordType === 'PTR') continue; // Skip PTR for domain lookup
        
        try {
          switch (recordType) {
            case 'A':
              allRecords.A = await dns.resolveA(domain);
              break;
            case 'AAAA':
              allRecords.AAAA = await dns.resolveAAAA(domain);
              break;
            case 'MX':
              allRecords.MX = await dns.resolveMX(domain);
              break;
            case 'TXT':
              allRecords.TXT = await dns.resolveTXT(domain);
              break;
            case 'NS':
              allRecords.NS = await dns.resolveNS(domain);
              break;
            case 'CNAME':
              allRecords.CNAME = await dns.resolveCNAME(domain);
              break;
            case 'SOA':
              allRecords.SOA = await dns.resolveSOA(domain);
              break;
            case 'SRV':
              // Skip SRV as it requires specific service
              break;
            case 'CAA':
              try {
                allRecords.CAA = await dns.resolve(domain, 'CAA');
              } catch {
                allRecords.CAA = [];
              }
              break;
          }
        } catch (error) {
          allRecords[recordType] = [];
        }
      }

      const responseTime = Date.now() - startTime;
      const totalRecords = Object.values(allRecords).flat().length;

      const result = {
        success: true,
        data: {
          domain,
          records: allRecords,
          summary: {
            totalRecordTypes: Object.keys(allRecords).length,
            totalRecords: totalRecords,
            recordTypes: Object.keys(allRecords)
          },
          timestamp: new Date().toISOString()
        },
        metadata: {
          responseTime: `${responseTime}ms`,
          cached: false
        }
      };

      // Cache for 5 minutes
      await setCache(cacheKey, JSON.stringify(result), 300);

      await logQuery({
        query: domain,
        queryType: 'dns',
        recordType: 'ALL',
        result: { success: true, recordCount: totalRecords },
        success: true,
        responseTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(result);
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

export default router;