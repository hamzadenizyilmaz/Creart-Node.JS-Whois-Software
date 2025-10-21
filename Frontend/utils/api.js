import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp for cache busting if needed
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }

    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'An error occurred'
      const status = error.response.status

      switch (status) {
        case 400:
          throw new Error(message || 'Bad request. Please check your input.')
        case 404:
          throw new Error(message || 'Resource not found.')
        case 429:
          throw new Error(message || 'Too many requests. Please wait a moment.')
        case 500:
          throw new Error(message || 'Server error. Please try again later.')
        default:
          throw new Error(message || 'An unexpected error occurred.')
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.')
    } else {
      // Other errors
      throw new Error(error.message || 'An unexpected error occurred.')
    }
  }
)

// API functions
export const searchWhois = async (query, queryType = 'auto') => {
  try {
    const response = await api.post('/whois/lookup', {
      query,
      queryType,
    })
    return response
  } catch (error) {
    console.error('WHOIS search error:', error)
    throw error
  }
}

export const searchDNS = async (domain, recordType = 'A') => {
  try {
    const response = await api.post('/dns/lookup', {
      domain,
      recordType,
    })
    return response
  } catch (error) {
    console.error('DNS search error:', error)
    throw error
  }
}

export const bulkSearch = async (queries, queryType = 'domain') => {
  try {
    const response = await api.post('/whois/bulk', {
      queries,
      queryType,
    })
    return response
  } catch (error) {
    console.error('Bulk search error:', error)
    throw error
  }
}

export const bulkDNS = async (domains, recordType = 'A') => {
  try {
    const response = await api.post('/dns/bulk', {
      queries: domains,
      recordType,
    })
    return response
  } catch (error) {
    console.error('Bulk DNS error:', error)
    throw error
  }
}

export const checkHealth = async () => {
  try {
    const response = await api.get('/health')
    return response
  } catch (error) {
    console.error('Health check error:', error)
    throw error
  }
}

export const getStats = async (days = 7) => {
  try {
    const response = await api.get(`/health/stats?days=${days}`)
    return response
  } catch (error) {
    console.error('Stats fetch error:', error)
    throw error
  }
}

export default api