import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (req, res, next) => {
  const requestId = uuidv4();
  req.requestId = requestId;

  const startTime = Date.now();

  // Log request
  console.log(`[${new Date().toISOString()}] 📥 INCOMING REQUEST`, {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent')?.substring(0, 100),
    query: req.query,
    body: req.method === 'POST' ? { ...req.body } : undefined
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    console.log(`[${new Date().toISOString()}] 📤 OUTGOING RESPONSE`, {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      success: data?.success
    });

    return originalJson.call(this, data);
  };

  next();
};