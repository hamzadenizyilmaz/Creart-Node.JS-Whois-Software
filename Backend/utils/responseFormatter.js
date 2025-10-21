import moment from 'moment';

export const formatWhoisResponse = (whoisData, query, queryType) => {
  const {
    rawData,
    domain,
    ip,
    registrar,
    registration,
    status,
    nameServers,
    contacts,
    dnssec,
    whoisServer,
    network,
    asn,
    organization,
    abuse,
    technical,
    metadata
  } = whoisData;

  const formatted = {
    query,
    queryType,
    summary: {
      available: !rawData.includes('No match') && !rawData.includes('NOT FOUND'),
      registered: !(!rawData.includes('No match') && !rawData.includes('NOT FOUND')),
      domainAge: registration?.ageDays || null,
      daysUntilExpiry: registration?.daysUntilExpiry || null,
      expiringSoon: registration?.expiringSoon || false,
      expired: registration?.expired || false
    },
    dates: {
      created: registration?.created,
      expires: registration?.expires,
      updated: registration?.updated,
      lastTransferred: registration?.lastTransferred,
      ageYears: registration?.ageYears,
      ageDays: registration?.ageDays
    },
    registrar: formatRegistrar(registrar),
    nameServers: nameServers?.map(ns => ({
      host: ns,
      type: 'NS'
    })) || [],
    status: status?.map(s => ({
      type: extractStatusType(s),
      description: s,
      active: isStatusActive(s)
    })) || [],
    contacts: {
      registrant: formatContact(contacts?.registrant),
      admin: formatContact(contacts?.admin),
      technical: formatContact(contacts?.technical),
      billing: formatContact(contacts?.billing)
    },
    technical: {
      dnssec: dnssec,
      whoisServer: whoisServer,
      reverseDNS: technical?.reverseDNS
    },
    rawData: rawData,
    metadata: {
      parsedAt: metadata?.parsedAt || new Date().toISOString(),
      dataLength: rawData?.length || 0,
      nameServerCount: nameServers?.length || 0,
      statusCount: status?.length || 0
    }
  };

  // Add IP/Network specific information
  if (queryType === 'ip') {
    formatted.network = {
      range: network?.range,
      cidr: network?.cidr,
      name: network?.name,
      type: network?.type,
      parent: network?.parent,
      country: network?.country,
      description: network?.description
    };

    formatted.asn = {
      number: asn?.number,
      name: asn?.name,
      description: asn?.description,
      route: asn?.route
    };

    formatted.organization = {
      name: organization?.name,
      id: organization?.id,
      address: organization?.address,
      country: organization?.country
    };

    formatted.abuse = {
      email: abuse?.email,
      phone: abuse?.phone,
      contact: abuse?.contact
    };
  }

  return formatted;
};

const formatRegistrar = (registrar) => {
  if (!registrar || Object.keys(registrar).length === 0) {
    return null;
  }

  return {
    name: registrar.name,
    ianaId: registrar.ianaId,
    url: registrar.url,
    email: registrar.email,
    phone: registrar.phone,
    abuseContact: registrar.abuseContact
  };
};

const formatContact = (contact) => {
  if (!contact || (!contact.name && !contact.organization && !contact.email)) {
    return null;
  }

  return {
    name: contact.name,
    organization: contact.organization,
    email: contact.email,
    phone: contact.phone,
    fax: contact.fax,
    address: {
      street: contact.address?.street,
      city: contact.address?.city,
      state: contact.address?.state,
      postalCode: contact.address?.postalCode,
      country: contact.address?.country
    },
    id: contact.id,
    type: contact.type
  };
};

const extractStatusType = (status) => {
  if (!status) return 'unknown';
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('ok')) return 'active';
  if (statusLower.includes('active')) return 'active';
  if (statusLower.includes('inactive')) return 'inactive';
  if (statusLower.includes('pending')) return 'pending';
  if (statusLower.includes('hold')) return 'hold';
  if (statusLower.includes('client')) return 'client';
  if (statusLower.includes('server')) return 'server';
  if (statusLower.includes('auto')) return 'auto';
  
  return status.split(' ')[0]?.replace(/[^a-zA-Z]/g, '') || 'unknown';
};

const isStatusActive = (status) => {
  if (!status) return false;
  
  const statusLower = status.toLowerCase();
  return !statusLower.includes('inactive') && 
         !statusLower.includes('pending') && 
         !statusLower.includes('hold');
};

export const formatDNSResponse = (records, domain, recordType) => {
  const formatted = {
    domain,
    recordType: recordType.toUpperCase(),
    records: Array.isArray(records) ? records : [records],
    count: Array.isArray(records) ? records.length : 1,
    timestamp: new Date().toISOString()
  };

  // Format specific record types
  switch (recordType.toUpperCase()) {
    case 'A':
      formatted.records = records.map(record => ({
        type: 'A',
        value: record,
        ttl: 'N/A'
      }));
      break;

    case 'AAAA':
      formatted.records = records.map(record => ({
        type: 'AAAA',
        value: record,
        ttl: 'N/A'
      }));
      break;

    case 'MX':
      formatted.records = records.map(record => ({
        type: 'MX',
        priority: record.priority,
        exchange: record.exchange,
        ttl: record.ttl || 'N/A'
      }));
      break;

    case 'TXT':
      formatted.records = records.flat().map(text => ({
        type: 'TXT',
        text: text,
        length: text.length
      }));
      break;

    case 'NS':
      formatted.records = records.map(record => ({
        type: 'NS',
        value: record,
        ttl: 'N/A'
      }));
      break;

    case 'CNAME':
      formatted.records = records.map(record => ({
        type: 'CNAME',
        value: record,
        ttl: 'N/A'
      }));
      break;

    case 'SOA':
      formatted.records = [{
        type: 'SOA',
        nsname: records.nsname,
        hostmaster: records.hostmaster,
        serial: records.serial,
        refresh: records.refresh,
        retry: records.retry,
        expire: records.expire,
        minttl: records.minttl
      }];
      break;

    case 'SRV':
      formatted.records = records.map(record => ({
        type: 'SRV',
        priority: record.priority,
        weight: record.weight,
        port: record.port,
        target: record.name
      }));
      break;

    case 'PTR':
      formatted.records = records.map(record => ({
        type: 'PTR',
        value: record
      }));
      break;

    case 'CAA':
      formatted.records = records.map(record => ({
        type: 'CAA',
        value: record
      }));
      break;

    default:
      formatted.records = Array.isArray(records) ? records.map(record => ({
        type: recordType.toUpperCase(),
        value: record
      })) : [{ type: recordType.toUpperCase(), value: records }];
  }

  return formatted;
};

export const formatBulkResponse = (results) => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  return {
    summary: {
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      successRate: results.length > 0 ? (successful.length / results.length) * 100 : 0
    },
    results: results.map(result => ({
      query: result.query,
      success: result.success,
      data: result.success ? result.data : null,
      error: !result.success ? result.error : null,
      timestamp: new Date().toISOString()
    })),
    metadata: {
      processedAt: new Date().toISOString(),
      totalQueries: results.length
    }
  };
};

export const formatErrorResponse = (error, context = {}) => {
  const errorMap = {
    'No match': 'DOMAIN_NOT_FOUND',
    'NOT FOUND': 'DOMAIN_NOT_FOUND',
    'not found': 'DOMAIN_NOT_FOUND',
    'Timeout': 'TIMEOUT',
    'timeout': 'TIMEOUT',
    'ECONNREFUSED': 'CONNECTION_REFUSED',
    'ENOTFOUND': 'SERVER_NOT_FOUND',
    'rate limit': 'RATE_LIMITED',
    'Query rate exceeded': 'RATE_LIMITED',
    'Limit exceeded': 'RATE_LIMITED'
  };

  let errorCode = 'UNKNOWN_ERROR';
  let errorMessage = error.message;

  for (const [key, code] of Object.entries(errorMap)) {
    if (error.message.toLowerCase().includes(key.toLowerCase())) {
      errorCode = code;
      break;
    }
  }

  return {
    error: {
      code: errorCode,
      message: errorMessage,
      context,
      timestamp: new Date().toISOString(),
      suggestions: getErrorSuggestions(errorCode)
    }
  };
};

const getErrorSuggestions = (errorCode) => {
  const suggestions = {
    'DOMAIN_NOT_FOUND': [
      'Check the domain spelling',
      'Try without www prefix',
      'Verify the TLD extension',
      'The domain might be available for registration'
    ],
    'TIMEOUT': [
      'Try again in a few moments',
      'Check your internet connection',
      'The WHOIS server might be busy',
      'Try a different domain'
    ],
    'RATE_LIMITED': [
      'Wait a few minutes before trying again',
      'Try a different domain',
      'Use bulk lookup for multiple domains',
      'Contact support if you need higher limits'
    ],
    'CONNECTION_REFUSED': [
      'WHOIS server might be down',
      'Try again later',
      'Check your firewall settings',
      'Try a different domain or TLD'
    ],
    'SERVER_NOT_FOUND': [
      'WHOIS server not available for this TLD',
      'Try a different domain',
      'Contact support if problem persists',
      'The TLD might not support WHOIS lookup'
    ]
  };

  return suggestions[errorCode] || [
    'Please try again',
    'Check your input and try again',
    'Contact support if problem persists'
  ];
};

// Format complete domain report
export const formatDomainReport = (whoisData, dnsData) => {
  const report = {
    domain: whoisData.domain,
    summary: {
      registered: whoisData.summary?.registered || false,
      domainAge: whoisData.registration?.ageDays || null,
      daysUntilExpiry: whoisData.registration?.daysUntilExpiry || null,
      nameServerCount: whoisData.nameServers?.length || 0,
      dnsRecordCount: dnsData?.recordCount || 0,
      dnssec: whoisData.technical?.dnssec || 'Unknown'
    },
    registration: {
      created: whoisData.registration?.created,
      expires: whoisData.registration?.expires,
      updated: whoisData.registration?.updated,
      registrar: whoisData.registrar
    },
    contacts: whoisData.contacts,
    nameServers: whoisData.nameServers,
    status: whoisData.status,
    dnsRecords: dnsData?.records || {},
    rawWhois: whoisData.rawData,
    timestamp: new Date().toISOString()
  };

  return report;
};

// Format IP report
export const formatIPReport = (whoisData) => {
  const report = {
    ip: whoisData.ip,
    summary: {
      range: whoisData.network?.range,
      asn: whoisData.asn?.number,
      organization: whoisData.organization?.name,
      country: whoisData.network?.country,
      reverseDNS: whoisData.technical?.reverseDNS || []
    },
    network: whoisData.network,
    asn: whoisData.asn,
    organization: whoisData.organization,
    abuse: whoisData.abuse,
    rawWhois: whoisData.rawData,
    timestamp: new Date().toISOString()
  };

  return report;
};

export default {
  formatWhoisResponse,
  formatDNSResponse,
  formatBulkResponse,
  formatErrorResponse,
  formatDomainReport,
  formatIPReport
};