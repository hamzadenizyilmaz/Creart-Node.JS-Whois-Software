export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    return true
  } catch (error) {
    console.error('Failed to copy text:', error)
    return false
  }
}

export function formatDate(dateString) {
  if (!dateString) return 'Bilinmiyor'

  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Geçersiz tarih'
    }

    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    }).format(date)
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Tarih formatı hatası'
  }
}

export function formatTimestamp(timestamp) {
  if (!timestamp) return 'Bilinmiyor'

  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return 'Az önce'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} dakika önce`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} saat önce`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} gün önce`
    } else {
      return formatDate(timestamp)
    }
  } catch (error) {
    console.error('Timestamp formatting error:', error)
    return 'Zaman formatı hatası'
  }
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function truncateText(text, maxLength = 50) {
  if (!text) return ''
  
  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength) + '...'
}

export function formatIPAddress(ip, type = 'ipv4') {
  if (!ip) return ''

  if (type === 'ipv6') {
    // Basic IPv6 formatting
    return ip.toLowerCase()
  }

  return ip
}

export function formatDomain(domain) {
  if (!domain) return ''

  // Remove protocol and www if present
  return domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .toLowerCase()
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidDomain(domain) {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

export function isValidIP(ip) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

export function formatJSON(data, indent = 2) {
  try {
    return JSON.stringify(data, null, indent)
  } catch (error) {
    console.error('JSON formatting error:', error)
    return '{}'
  }
}


export function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('JSON parsing error:', error)
    return null
  }
}

export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

export function capitalizeFirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatPhoneNumber(phone) {
  if (!phone) return ''

  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4')
  }
  
  return phone
}

export function sanitizeHTML(html) {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

export function debounce(func, wait, immediate) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (obj instanceof Object) {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

export function isEmpty(obj) {
  if (obj == null) return true
  if (Array.isArray(obj)) return obj.length === 0
  return Object.keys(obj).length === 0
}

export function getQueryParam(param) {
  if (typeof window === 'undefined') return null
  
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

export function setQueryParam(param, value) {
  if (typeof window === 'undefined') return
  
  const url = new URL(window.location)
  url.searchParams.set(param, value)
  window.history.pushState({}, '', url)
}

export function removeQueryParam(param) {
  if (typeof window === 'undefined') return
  
  const url = new URL(window.location)
  url.searchParams.delete(param)
  window.history.pushState({}, '', url)
}

export default {
  copyToClipboard,
  formatDate,
  formatTimestamp,
  formatFileSize,
  truncateText,
  formatIPAddress,
  formatDomain,
  isValidEmail,
  isValidDomain,
  isValidIP,
  formatJSON,
  parseJSON,
  generateId,
  capitalizeFirst,
  formatPhoneNumber,
  sanitizeHTML,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  getQueryParam,
  setQueryParam,
  removeQueryParam
}