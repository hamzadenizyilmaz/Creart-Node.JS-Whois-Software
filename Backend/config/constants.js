export const WHOIS_SERVERS = {
  'com': 'whois.verisign-grs.com',
  'net': 'whois.verisign-grs.com',
  'org': 'whois.pir.org',
  'info': 'whois.afilias.net',
  'biz': 'whois.biz',
  'io': 'whois.nic.io',
  'co': 'whois.nic.co',
  'ai': 'whois.nic.ai',
  'me': 'whois.nic.me',
  'tv': 'whois.nic.tv',
  'uk': 'whois.nic.uk',
  'de': 'whois.denic.de',
  'fr': 'whois.nic.fr',
  'it': 'whois.nic.it',
  'es': 'whois.nic.es',
  'nl': 'whois.domain-registry.nl',
  'eu': 'whois.eu',
  'ca': 'whois.cira.ca',
  'au': 'whois.auda.org.au',
  'jp': 'whois.jprs.jp',
  'cn': 'whois.cnnic.cn',
  'in': 'whois.registry.in',
  'br': 'whois.registro.br',
  'ru': 'whois.tcinet.ru',
  'ch': 'whois.nic.ch',
  'se': 'whois.iis.se',
  'no': 'whois.norid.no',
  'dk': 'whois.dk-hostmaster.dk',
  'fi': 'whois.fi',
  'pl': 'whois.dns.pl',
  'cz': 'whois.nic.cz',
  'sk': 'whois.sk-nic.sk',
  'hu': 'whois.nic.hu',
  'ro': 'whois.rotld.ro',
  'bg': 'whois.register.bg',
  'gr': 'whois.iana.org',
  'tr': 'whois.nic.tr',
  'app': 'whois.nic.google',
  'dev': 'whois.nic.google',
  'page': 'whois.nic.google',
  'xyz': 'whois.nic.xyz',
  'online': 'whois.nic.online',
  'site': 'whois.nic.site',
  'tech': 'whois.nic.tech',
  'store': 'whois.nic.store',
  'fun': 'whois.nic.fun',
  'live': 'whois.nic.live',
  'club': 'whois.nic.club',
  'news': 'whois.nic.news',
  'blog': 'whois.nic.blog',
  'asia': 'whois.nic.asia',
  'eu': 'whois.eu',
  'us': 'whois.nic.us',
  'mobi': 'whois.afilias.net',
  'tel': 'whois.nic.tel',
  'travel': 'whois.nic.travel',
  'arpa': 'whois.iana.org',
  'int': 'whois.iana.org'
};

export const DEFAULT_WHOIS_SERVER = 'whois.ripe.org';

export const RIR_SERVERS = {
  'arin': 'whois.arin.net',      
  'iana': 'whois.iana.net',      
  'apnic': 'whois.apnic.net',   
  'lacnic': 'whois.lacnic.net', 
  'afrinic': 'whois.afrinic.net' 
};

export const CACHE_CONFIG = {
  WHOIS_TTL: 3600, // 1 hour
  DNS_TTL: 300,    // 5 minutes
  BULK_TTL: 1800,  // 30 minutes
  AVAILABILITY_TTL: 300 // 5 minutes
};

export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 900000, // 15 minutes
  MAX_REQUESTS: 100,
  BULK_MAX_QUERIES: 10
};

export const ERROR_MESSAGES = {
  INVALID_DOMAIN: 'Invalid domain format',
  INVALID_IP: 'Invalid IP address',
  WHOIS_TIMEOUT: 'WHOIS lookup timeout',
  DNS_ERROR: 'DNS lookup failed',
  RATE_LIMITED: 'Rate limit exceeded',
  SERVER_ERROR: 'Internal server error',
  DOMAIN_NOT_FOUND: 'Domain not found in WHOIS database',
  IP_NOT_FOUND: 'IP address not found in WHOIS database'
};

export const SUPPORTED_RECORD_TYPES = [
  'A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'SRV', 'PTR', 'CAA', 'NAPTR'
];

export default {
  WHOIS_SERVERS,
  DEFAULT_WHOIS_SERVER,
  RIR_SERVERS,
  CACHE_CONFIG,
  RATE_LIMIT_CONFIG,
  ERROR_MESSAGES,
  SUPPORTED_RECORD_TYPES
};