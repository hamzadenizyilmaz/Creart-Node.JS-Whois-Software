import { isIP } from 'net';

export const isValidIP = (ip) => {
  return isIP(ip) !== 0;
};

export const isValidDomain = (domain) => {
  if (typeof domain !== 'string') return false;
  
  let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return domainRegex.test(cleanDomain) && cleanDomain.length <= 253;
};

export const isPrivateIP = (ip) => {
  if (!isValidIP(ip)) return false;

  // IPv4 private ranges
  if (isIP(ip) === 4) {
    const parts = ip.split('.').map(part => parseInt(part, 10));
    
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    
    // 127.0.0.0/8
    if (parts[0] === 127) return true;
    
    // 169.254.0.0/16 (link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
  }

  // IPv6 private ranges
  if (isIP(ip) === 6) {
    const lowerIP = ip.toLowerCase();
    if (lowerIP === '::1') return true;
    if (lowerIP.startsWith('fc00:') || lowerIP.startsWith('fd00:')) return true;
    if (lowerIP.startsWith('fe80:')) return true;
    if (lowerIP.startsWith('2001:db8:')) return true;
  }

  return false;
};

export const getDomainFromURL = (url) => {
  try {
    const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    return isValidDomain(domain) ? domain : null;
  } catch {
    return null;
  }
};

export const normalizeDomain = (domain) => {
  if (!domain) return null;
  
  let normalized = domain.toLowerCase().trim();
  
  normalized = normalized.replace(/^(https?:\/\/)?(www\.)?/, '');
  normalized = normalized.split('/')[0];
  
  return isValidDomain(normalized) ? normalized : null;
};

export const validateQuery = (query, queryType = 'auto') => {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Query is required' };
  }

  if (queryType === 'domain' || queryType === 'auto') {
    if (isValidDomain(query)) {
      return { valid: true, type: 'domain', normalized: normalizeDomain(query) };
    }
  }

  if (queryType === 'ip' || queryType === 'auto') {
    if (isValidIP(query)) {
      return { valid: true, type: 'ip', normalized: query };
    }
  }

  return { 
    valid: false, 
    error: queryType === 'auto' 
      ? 'Invalid domain or IP address' 
      : `Invalid ${queryType} format`
  };
};

export default {
  isValidIP,
  isValidDomain,
  isPrivateIP,
  getDomainFromURL,
  normalizeDomain,
  validateQuery
};