import whois from 'whois-json';
import dns from 'dns/promises';
import { WHOIS_SERVERS, RIR_SERVERS, DEFAULT_WHOIS_SERVER } from '../config/constants.js';
import { isValidDomain, isValidIP, isPrivateIP } from './ipTools.js';

export const whoisLookup = async (query, queryType = 'auto') => {
  try {
    if (queryType === 'auto') {
      queryType = isValidDomain(query) ? 'domain' : isValidIP(query) ? 'ip' : 'domain';
    }

    const options = {
      server: getWhoisServer(query, queryType),
      follow: 5,
      timeout: 20000,
      verbose: false,
      encoding: 'utf8'
    };

    console.log(`🔍 WHOIS lookup: ${query} (${queryType}) → ${options.server}`);

    const data = await whois(query, options);
    const rawData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    if (!rawData || rawData.length < 10) {
      throw new Error('WHOIS server returned empty response');
    }

    const notFoundPatterns = [
      'No match',
      'NOT FOUND',
      'No entries found',
      'No data found',
      'Status: free',
      'Domain not found',
      'No objects found',
      'This query returned 0 objects',
      'No information available'
    ];

    if (notFoundPatterns.some(pattern => rawData.includes(pattern))) {
      throw new Error('Domain or IP not found in WHOIS database');
    }

    if (rawData.includes('Query rate exceeded') || rawData.includes('Limit exceeded')) {
      throw new Error('WHOIS query rate limit exceeded');
    }

    const parsedData = await parseDetailedWhoisData(rawData, query, queryType);
    return parsedData;

  } catch (error) {
    console.error(`WHOIS failed for ${query}:`, error.message);
    
    if (error.message.includes('timeout')) {
      throw new Error('WHOIS server timeout (20 seconds)');
    }
    if (error.message.includes('ECONNREFUSED')) {
      throw new Error('WHOIS server connection refused');
    }
    if (error.message.includes('ENOTFOUND')) {
      throw new Error('WHOIS server not found');
    }
    if (error.message.includes('rate limit')) {
      throw new Error('WHOIS rate limit exceeded - please wait a few minutes');
    }
    
    throw new Error(`WHOIS lookup failed: ${error.message}`);
  }
};

const getWhoisServer = (query, queryType) => {
  if (queryType === 'ip' || isValidIP(query)) {
    if (isPrivateIP(query)) {
      return 'whois.iana.org';
    }
    
    const ip = query.split('.');
    const firstOctet = parseInt(ip[0]);
    
    if (firstOctet <= 126) return RIR_SERVERS.arin;     
    if (firstOctet <= 191) return RIR_SERVERS.ripe;      
    if (firstOctet <= 223) return RIR_SERVERS.apnic;     
    return RIR_SERVERS.ripe;
  }

  const domain = query.toLowerCase();
  const tld = domain.split('.').pop();
  return WHOIS_SERVERS[tld] || DEFAULT_WHOIS_SERVER;
};

const parseDetailedWhoisData = async (rawData, query, queryType) => {
  const lines = rawData.split('\n');
  const parsed = {

    query: query,
    queryType: queryType,
    rawData: rawData,
    whoisServer: null,
    
    domain: queryType === 'domain' ? query : null,
    registrar: null,
    registration: {
      created: null,
      expires: null,
      updated: null,
      lastTransferred: null
    },
    status: [],
    nameServers: [],
    dnssec: null,
    
    contacts: {
      registrant: createContact(),
      admin: createContact(),
      technical: createContact(),
      billing: createContact()
    },
    
    ip: queryType === 'ip' ? query : null,
    network: {
      range: null,
      cidr: null,
      name: null,
      type: null,
      parent: null,
      country: null,
      description: null
    },
    asn: {
      number: null,
      name: null,
      description: null,
      route: null
    },
    organization: {
      name: null,
      id: null,
      address: null,
      country: null
    },
    abuse: {
      email: null,
      phone: null,
      contact: null
    },
    
    technical: {
      reverseDNS: null,
      allocationDate: null,
      lastModified: null
    },
    
    metadata: {
      parsedAt: new Date().toISOString(),
      dataLength: rawData.length,
      linesProcessed: lines.length,
      whoisVersion: null
    }
  };

  let currentSection = null;
  let currentContact = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line || line.startsWith('%') || line.startsWith('#') || line.startsWith('*')) {
      continue;
    }

    if (line.match(/^\[.*\]$/)) {
      const section = line.replace(/[\[\]]/g, '').toLowerCase();
      if (section.includes('registrant')) {
        currentSection = 'registrant';
        currentContact = parsed.contacts.registrant;
      } else if (section.includes('admin')) {
        currentSection = 'admin';
        currentContact = parsed.contacts.admin;
      } else if (section.includes('tech')) {
        currentSection = 'technical';
        currentContact = parsed.contacts.technical;
      } else if (section.includes('billing')) {
        currentSection = 'billing';
        currentContact = parsed.contacts.billing;
      } else {
        currentSection = null;
        currentContact = null;
      }
      continue;
    }

    const [key, ...valueParts] = line.split(':');
    if (!key || valueParts.length === 0) continue;

    const keyLower = key.toLowerCase().trim();
    const value = valueParts.join(':').trim();

    parseWhoisField(parsed, keyLower, value, currentContact);
  }

  parsed.nameServers = [...new Set(parsed.nameServers)].filter(ns => ns && ns.length > 0);
  parsed.status = [...new Set(parsed.status)].filter(status => status && status.length > 0);

  await calculateAdditionalInfo(parsed);

  return parsed;
};

const createContact = () => ({
  name: null,
  organization: null,
  email: null,
  phone: null,
  fax: null,
  address: {
    street: null,
    city: null,
    state: null,
    postalCode: null,
    country: null
  },
  id: null,
  type: null
});


const parseWhoisField = (parsed, key, value, currentContact) => {
  if (key.includes('registrar')) {
    if (!parsed.registrar) parsed.registrar = {};
    if (key.includes('name')) parsed.registrar.name = value;
    else if (key.includes('iana')) parsed.registrar.ianaId = value;
    else if (key.includes('url')) parsed.registrar.url = value;
    else if (key.includes('email')) parsed.registrar.email = value;
    else if (key.includes('phone')) parsed.registrar.phone = value;
    else if (key.includes('abuse')) parsed.registrar.abuseContact = value;
    else parsed.registrar.name = value;
  }

  else if (key.includes('creation') || key.includes('created')) {
    parsed.registration.created = parseDate(value);
  }
  else if (key.includes('expir') || key.includes('renew') || key.includes('valid until')) {
    parsed.registration.expires = parseDate(value);
  }
  else if (key.includes('updated') || key.includes('modified') || key.includes('changed')) {
    parsed.registration.updated = parseDate(value);
  }
  else if (key.includes('last transfer')) {
    parsed.registration.lastTransferred = parseDate(value);
  }

  else if (key.includes('name server') || key === 'nserver' || key.includes('nameserver')) {
    const ns = value.toLowerCase().replace(/\.$/g, '').trim();
    if (ns && !parsed.nameServers.includes(ns)) {
      parsed.nameServers.push(ns);
    }
  }

  else if (key.includes('status') && !value.includes('http')) {
    parsed.status.push(value);
  }

  else if (key.includes('dnssec')) {
    parsed.dnssec = value;
  }

  else if (key.includes('whois server')) {
    parsed.whoisServer = value;
  }

  else if (key.includes('netrange') || key.includes('inetnum')) {
    parsed.network.range = value;
  }
  else if (key.includes('cidr')) {
    parsed.network.cidr = value;
  }
  else if (key.includes('netname')) {
    parsed.network.name = value;
  }
  else if (key.includes('nettype')) {
    parsed.network.type = value;
  }
  else if (key.includes('parent')) {
    parsed.network.parent = value;
  }
  else if (key.includes('country')) {
    parsed.network.country = value;
  }
  else if (key.includes('descr')) {
    parsed.network.description = value;
  }

  else if ((key.includes('as') && key.includes('number')) || key === 'origin') {
    parsed.asn.number = value.replace('AS', '');
  }
  else if (key.includes('as') && key.includes('name')) {
    parsed.asn.name = value;
  }
  else if (key.includes('as') && key.includes('descr')) {
    parsed.asn.description = value;
  }
  else if (key.includes('route')) {
    parsed.asn.route = value;
  }

  else if (key.includes('org') && key.includes('name')) {
    parsed.organization.name = value;
  }
  else if (key.includes('org') && key.includes('id')) {
    parsed.organization.id = value;
  }
  else if (key.includes('org') && key.includes('address')) {
    parsed.organization.address = value;
  }
  else if (key.includes('org') && key.includes('country')) {
    parsed.organization.country = value;
  }

  else if (key.includes('abuse') && key.includes('email')) {
    parsed.abuse.email = value;
  }
  else if (key.includes('abuse') && key.includes('phone')) {
    parsed.abuse.phone = value;
  }
  else if (key.includes('abuse') && key.includes('contact')) {
    parsed.abuse.contact = value;
  }

  else if (currentContact) {
    parseContactField(currentContact, key, value);
  }

  else if (key.includes('email') && !parsed.contacts.registrant.email) {
    parsed.contacts.registrant.email = value;
  }
  else if (key.includes('phone') && !parsed.contacts.registrant.phone) {
    parsed.contacts.registrant.phone = value;
  }
  else if (key.includes('version')) {
    parsed.metadata.whoisVersion = value;
  }
};

const parseContactField = (contact, key, value) => {
  if (key.includes('name') && !contact.name) {
    contact.name = value;
  }
  else if (key.includes('organization') || key.includes('org') || key.includes('company')) {
    contact.organization = value;
  }
  else if (key.includes('email')) {
    contact.email = value;
  }
  else if (key.includes('phone')) {
    contact.phone = value;
  }
  else if (key.includes('fax')) {
    contact.fax = value;
  }
  else if (key.includes('street') || key.includes('address')) {
    contact.address.street = value;
  }
  else if (key.includes('city')) {
    contact.address.city = value;
  }
  else if (key.includes('state') || key.includes('province')) {
    contact.address.state = value;
  }
  else if (key.includes('postal') || key.includes('zip')) {
    contact.address.postalCode = value;
  }
  else if (key.includes('country')) {
    contact.address.country = value;
  }
  else if (key.includes('id') || key.includes('handle')) {
    contact.id = value;
  }
  else if (key.includes('type')) {
    contact.type = value;
  }
};

const parseDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const formats = [
      dateString,
      dateString.replace(' ', 'T') + 'Z',
      dateString.replace(/\./g, '-'),
      dateString.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
      dateString.split('T')[0] // ISO tarih kısmı
    ];
    
    for (const format of formats) {
      const date = new Date(format);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    
    return dateString;
  } catch {
    return dateString;
  }
};


const calculateAdditionalInfo = async (parsed) => {
  if (parsed.registration.created) {
    try {
      const created = new Date(parsed.registration.created);
      const now = new Date();
      const ageInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      parsed.registration.ageDays = ageInDays;
      parsed.registration.ageYears = (ageInDays / 365.25).toFixed(1);
    } catch (error) {
      console.error('Error calculating domain age:', error);
    }
  }

  if (parsed.registration.expires) {
    try {
      const expires = new Date(parsed.registration.expires);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
      parsed.registration.daysUntilExpiry = daysUntilExpiry;
      parsed.registration.expiringSoon = daysUntilExpiry <= 30;
      parsed.registration.expired = daysUntilExpiry < 0;
    } catch (error) {
      console.error('Error calculating expiry:', error);
    }
  }

  if (parsed.queryType === 'ip' && parsed.ip) {
    try {
      const hostnames = await dns.reverse(parsed.ip);
      parsed.technical.reverseDNS = hostnames;
    } catch (error) {
      parsed.technical.reverseDNS = ['No reverse DNS record'];
    }
  }

  cleanEmptyObjects(parsed);
};

const cleanEmptyObjects = (obj) => {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      cleanEmptyObjects(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    } else if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      delete obj[key];
    }
  }
};


export const getDNSRecords = async (domain) => {
  try {
    console.log(`DNS lookup for: ${domain}`);
    
    const records = {};
    const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA'];
    
    for (const type of recordTypes) {
      try {
        switch (type) {
          case 'A':
            records.A = await dns.resolve4(domain);
            break;
          case 'AAAA':
            records.AAAA = await dns.resolve6(domain);
            break;
          case 'MX':
            records.MX = await dns.resolveMx(domain);
            break;
          case 'TXT':
            const txtRecords = await dns.resolveTxt(domain);
            records.TXT = txtRecords.flat();
            break;
          case 'NS':
            records.NS = await dns.resolveNs(domain);
            break;
          case 'CNAME':
            records.CNAME = await dns.resolveCname(domain);
            break;
          case 'SOA':
            records.SOA = await dns.resolveSoa(domain);
            break;
        }
      } catch (error) {
        records[type] = [];
      }
    }
    
    return {
      domain,
      records,
      timestamp: new Date().toISOString(),
      recordCount: Object.values(records).reduce((total, arr) => total + (Array.isArray(arr) ? arr.length : 1), 0)
    };
    
  } catch (error) {
    console.error(`DNS lookup failed for ${domain}:`, error.message);
    throw new Error(`DNS lookup failed: ${error.message}`);
  }
};

export const bulkWhoisLookup = async (queries, queryType = 'domain') => {
  const results = [];
  
  for (const query of queries) {
    try {
      const data = await whoisLookup(query, queryType);
      results.push({
        query,
        success: true,
        data
      });
    } catch (error) {
      results.push({
        query,
        success: false,
        error: error.message
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
};

export const bulkDNSLookup = async (domains) => {
  const results = [];
  
  for (const domain of domains) {
    try {
      const data = await getDNSRecords(domain);
      results.push({
        domain,
        success: true,
        data
      });
    } catch (error) {
      results.push({
        domain,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

export const checkDomainAvailability = async (domain) => {
  try {
    const data = await whoisLookup(domain, 'domain');
    const availablePatterns = [
      'No match',
      'NOT FOUND',
      'No entries found',
      'No data found',
      'Status: free',
      'Domain not found',
      'Available',
      'This query returned 0 objects'
    ];
    
    const isAvailable = availablePatterns.some(pattern => 
      data.rawData.includes(pattern)
    );
    
    return {
      domain,
      available: isAvailable,
      data: isAvailable ? null : data
    };
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('No match')) {
      return {
        domain,
        available: true,
        data: null
      };
    }    
    throw error;
  }
};

export default {
  whoisLookup,
  getDNSRecords,
  bulkWhoisLookup,
  bulkDNSLookup,
  checkDomainAvailability
};