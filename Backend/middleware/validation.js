import Joi from 'joi';

export const validateWhoisQuery = (req, res, next) => {
  const schema = Joi.object({
    query: Joi.string()
      .min(1)
      .max(255)
      .required()
      .pattern(/^[a-zA-Z0-9.-]+$/)
      .message('Query must be a valid domain or IP address'),
    queryType: Joi.string()
      .valid('domain', 'ip', 'auto')
      .default('auto')
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }

  next();
};

export const validateDnsQuery = (req, res, next) => {
  const schema = Joi.object({
    domain: Joi.string()
      .min(1)
      .max(253)
      .required()
      .pattern(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
      .message('Domain must be in valid format'),
    recordType: Joi.string()
      .valid('A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'SRV', 'PTR')
      .default('A')
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }

  next();
};