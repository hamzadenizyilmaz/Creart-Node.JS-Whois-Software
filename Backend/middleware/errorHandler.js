export const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  
  // Default error
  let error = {
    message: 'Internal Server Error',
    statusCode: 500
  };

  // Validation errors
  if (err.isJoi) {
    error = {
      message: 'Validation Error',
      details: err.details.map(detail => detail.message),
      statusCode: 400
    };
  }

  // Rate limit error
  if (err.statusCode === 429) {
    error = {
      message: 'Rate limit exceeded',
      statusCode: 429
    };
  }

  // WHOIS/DNS specific errors
  if (err.message?.includes('WHOIS') || err.message?.includes('DNS')) {
    error = {
      message: err.message,
      statusCode: 400
    };
  }

  // Database errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    error = {
      message: 'Database error occurred',
      statusCode: 503
    };
  }

  // Log error for monitoring
  console.error(`Error ${error.statusCode}: ${error.message}`, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(error.details && { details: error.details }),
    timestamp: new Date().toISOString(),
    path: req.path
  });
};