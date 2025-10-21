import mongoose from 'mongoose';

const QueryLogSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  queryType: {
    type: String,
    enum: ['domain', 'ip', 'dns'],
    required: true
  },
  recordType: {
    type: String,
    enum: ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'SRV', 'PTR'],
    default: null
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  success: {
    type: Boolean,
    default: true
  },
  error: {
    type: String,
    default: null
  },
  responseTime: {
    type: Number,
    default: 0
  },
  ipAddress: {
    type: String,
    required: true,
    maxlength: 45
  },
  userAgent: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const WhoisCacheSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 255
  },
  queryType: {
    type: String,
    enum: ['domain', 'ip'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  rawData: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    required: true
  },
  hits: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const DnsCacheSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    trim: true,
    maxlength: 253
  },
  recordType: {
    type: String,
    required: true,
    enum: ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'SRV', 'PTR']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  hits: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const UserSessionSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    maxlength: 45
  },
  userAgent: {
    type: String,
    default: null
  },
  requests: [{
    endpoint: String,
    timestamp: Date,
    responseTime: Number
  }],
  totalRequests: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

QueryLogSchema.index({ query: 1, timestamp: -1 });
QueryLogSchema.index({ timestamp: -1 });
QueryLogSchema.index({ queryType: 1, timestamp: -1 });
QueryLogSchema.index({ success: 1, timestamp: -1 });
QueryLogSchema.index({ ipAddress: 1, timestamp: -1 });

WhoisCacheSchema.index({ query: 1, queryType: 1 });
WhoisCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
WhoisCacheSchema.index({ lastAccessed: -1 });
WhoisCacheSchema.index({ hits: -1 });

DnsCacheSchema.index({ domain: 1, recordType: 1 });
DnsCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
DnsCacheSchema.index({ lastAccessed: -1 });
DnsCacheSchema.index({ hits: -1 });

UserSessionSchema.index({ ipAddress: 1 });
UserSessionSchema.index({ lastActivity: -1 });
UserSessionSchema.index({ isBlocked: 1 });

QueryLogSchema.virtual('successRate').get(function() {
  return this.success ? 100 : 0;
});

export const QueryLog = mongoose.model('QueryLog', QueryLogSchema);
export const WhoisCache = mongoose.model('WhoisCache', WhoisCacheSchema);
export const DnsCache = mongoose.model('DnsCache', DnsCacheSchema);
export const UserSession = mongoose.model('UserSession', UserSessionSchema);

export const connectToDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://test:test@test.mongodb.net/';
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 30000
    });

    console.log('MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    mongoose.connection.on('close', () => {
      console.log('MongoDB connection closed');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const logQuery = async (logData) => {
  try {
    const log = new QueryLog({
      _id: new mongoose.Types.ObjectId(),
      ...logData
    });
    
    await log.save();
    return log._id;
  } catch (error) {
    console.error('Failed to log query:', error);
    return null;
  }
};

export const getWhoisCache = async (query) => {
  try {
    const cache = await WhoisCache.findOne({ 
      query,
      expiresAt: { $gt: new Date() }
    });
    
    if (cache) {
      cache.hits += 1;
      cache.lastAccessed = new Date();
      await cache.save();
      return cache.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting WHOIS cache:', error);
    return null;
  }
};

export const setWhoisCache = async (query, queryType, data, rawData = null, ttl = 3600) => {
  try {
    const expiresAt = new Date(Date.now() + ttl * 1000);
    
    await WhoisCache.findOneAndUpdate(
      { query },
      {
        query,
        queryType,
        data,
        rawData,
        expiresAt
      },
      { 
        upsert: true, 
        new: true
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error setting WHOIS cache:', error);
    return false;
  }
};

export const deleteWhoisCache = async (query) => {
  try {
    const result = await WhoisCache.deleteOne({ query });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting WHOIS cache:', error);
    return false;
  }
};

export const clearExpiredWhoisCache = async () => {
  try {
    const result = await WhoisCache.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    return result.deletedCount;
  } catch (error) {
    console.error('Error clearing expired WHOIS cache:', error);
    return 0;
  }
};

export const getDnsCache = async (domain, recordType) => {
  try {
    const cache = await DnsCache.findOne({ 
      domain,
      recordType,
      expiresAt: { $gt: new Date() }
    });
    
    if (cache) {
      cache.hits += 1;
      cache.lastAccessed = new Date();
      await cache.save();
      return cache.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting DNS cache:', error);
    return null;
  }
};

export const setDnsCache = async (domain, recordType, data, ttl = 300) => {
  try {
    const expiresAt = new Date(Date.now() + ttl * 1000);
    
    await DnsCache.findOneAndUpdate(
      { domain, recordType },
      {
        domain,
        recordType,
        data,
        expiresAt
      },
      { 
        upsert: true, 
        new: true
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error setting DNS cache:', error);
    return false;
  }
};

export const deleteDnsCache = async (domain, recordType = null) => {
  try {
    if (recordType) {
      const result = await DnsCache.deleteOne({ domain, recordType });
      return result.deletedCount > 0;
    } else {
      const result = await DnsCache.deleteMany({ domain });
      return result.deletedCount;
    }
  } catch (error) {
    console.error('Error deleting DNS cache:', error);
    return false;
  }
};

export const clearExpiredDnsCache = async () => {
  try {
    const result = await DnsCache.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    return result.deletedCount;
  } catch (error) {
    console.error('Error clearing expired DNS cache:', error);
    return 0;
  }
};

export const getQueryStats = async (days = 7, queryType = null) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const matchStage = {
      timestamp: { $gte: startDate }
    };

    if (queryType) {
      matchStage.queryType = queryType;
    }

    const stats = await QueryLog.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            queryType: '$queryType'
          },
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] }
          },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      {
        $sort: { '_id.date': -1, '_id.queryType': 1 }
      },
      {
        $project: {
          date: '$_id.date',
          queryType: '$_id.queryType',
          count: 1,
          successCount: 1,
          successRate: {
            $round: [
              { $multiply: [{ $divide: ['$successCount', '$count'] }, 100] },
              2
            ]
          },
          avgResponseTime: { $round: ['$avgResponseTime', 2] }
        }
      }
    ]);

    return stats;
  } catch (error) {
    console.error('Failed to get query stats:', error);
    return [];
  }
};

export const getPopularQueries = async (limit = 10, days = 7, queryType = null) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const matchStage = {
      timestamp: { $gte: startDate },
      success: true
    };

    if (queryType) {
      matchStage.queryType = queryType;
    }

    const popularQueries = await QueryLog.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: '$query',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
          lastQueried: { $max: '$timestamp' },
          queryType: { $first: '$queryType' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          query: '$_id',
          count: 1,
          avgResponseTime: { $round: ['$avgResponseTime', 2] },
          lastQueried: 1,
          queryType: 1,
          _id: 0
        }
      }
    ]);

    return popularQueries;
  } catch (error) {
    console.error('Failed to get popular queries:', error);
    return [];
  }
};

export const getSystemStats = async () => {
  try {
    const totalQueries = await QueryLog.countDocuments();
    const successfulQueries = await QueryLog.countDocuments({ success: true });
    const failedQueries = await QueryLog.countDocuments({ success: false });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayQueries = await QueryLog.countDocuments({
      timestamp: { $gte: today }
    });

    const cacheStats = {
      whois: await WhoisCache.countDocuments(),
      dns: await DnsCache.countDocuments(),
      activeWhois: await WhoisCache.countDocuments({ expiresAt: { $gt: new Date() } }),
      activeDns: await DnsCache.countDocuments({ expiresAt: { $gt: new Date() } })
    };

    return {
      totalQueries,
      successfulQueries,
      failedQueries,
      todayQueries,
      successRate: totalQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0,
      cacheStats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get system stats:', error);
    return null;
  }
};

export const updateUserSession = async (ipAddress, endpoint, responseTime = 0) => {
  try {
    const session = await UserSession.findOneAndUpdate(
      { ipAddress },
      {
        $push: {
          requests: {
            endpoint,
            timestamp: new Date(),
            responseTime
          }
        },
        $inc: { totalRequests: 1 },
        $set: { lastActivity: new Date() }
      },
      { new: true, upsert: true }
    );
    
    return session;
  } catch (error) {
    console.error('Error updating user session:', error);
    return null;
  }
};

export const isUserBlocked = async (ipAddress) => {
  try {
    const session = await UserSession.findOne({ ipAddress, isBlocked: true });
    return !!session;
  } catch (error) {
    console.error('Error checking user block status:', error);
    return false;
  }
};

export const cleanupExpiredCache = async () => {
  try {
    const now = new Date();
    
    const whoisResult = await WhoisCache.deleteMany({
      expiresAt: { $lt: now }
    });
    
    const dnsResult = await DnsCache.deleteMany({
      expiresAt: { $lt: now }
    });
    
    console.log(`Cleaned up ${whoisResult.deletedCount} WHOIS cache entries and ${dnsResult.deletedCount} DNS cache entries`);
    
    return {
      whoisDeleted: whoisResult.deletedCount,
      dnsDeleted: dnsResult.deletedCount
    };
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
    return { whoisDeleted: 0, dnsDeleted: 0 };
  }
};

export const cleanupOldLogs = async (days = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await QueryLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    console.log(`Cleaned up ${result.deletedCount} query logs older than ${days} days`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
    return 0;
  }
};

export const checkDatabaseHealth = async () => {
  try {
    await QueryLog.findOne().limit(1);
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      details: {
        connectionState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      details: {
        connectionState: mongoose.connection.readyState
      }
    };
  }
};

export const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

export default {
  connectToDatabase,
  closeDatabase,
  checkDatabaseHealth,
  
  QueryLog,
  WhoisCache,
  DnsCache,
  UserSession,
  
  logQuery,
  getQueryStats,
  getPopularQueries,
  getSystemStats,
  
  getWhoisCache,
  setWhoisCache,
  deleteWhoisCache,
  clearExpiredWhoisCache,
  
  getDnsCache,
  setDnsCache,
  deleteDnsCache,
  clearExpiredDnsCache,
  
  updateUserSession,
  isUserBlocked,
  
  cleanupExpiredCache,
  cleanupOldLogs
};