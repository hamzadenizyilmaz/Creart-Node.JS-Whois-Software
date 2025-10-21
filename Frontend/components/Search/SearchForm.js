import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, X, Globe, Server, MapPin } from 'lucide-react'
import QueryTypes from './QueryTypes'
import toast from 'react-hot-toast'

export default function SearchForm({ 
  onSearch, 
  loading, 
  searchHistory, 
  onClearHistory 
}) {
  const [query, setQuery] = useState('')
  const [queryType, setQueryType] = useState('auto')
  const [recordType, setRecordType] = useState('A')
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef(null)

  const queryTypes = [
    { value: 'auto', label: 'Auto Detect', icon: Globe, description: 'Automatically detect domain or IP' },
    { value: 'domain', label: 'Domain', icon: Globe, description: 'WHOIS domain information' },
    { value: 'ip', label: 'IP Address', icon: MapPin, description: 'IP address information' },
    { value: 'dns', label: 'DNS Records', icon: Server, description: 'DNS record lookup' },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowHistory(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!query.trim()) {
      toast.error('Please enter a domain or IP address')
      return
    }

    // Basic validation
    if (queryType === 'domain' && !isValidDomain(query)) {
      toast.error('Please enter a valid domain name')
      return
    }

    if (queryType === 'ip' && !isValidIP(query)) {
      toast.error('Please enter a valid IP address')
      return
    }

    onSearch({
      query: query.trim(),
      queryType,
      recordType: queryType === 'dns' ? recordType : undefined
    })
    setShowHistory(false)
  }

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem.query)
    setQueryType(historyItem.queryType)
    if (historyItem.recordType) {
      setRecordType(historyItem.recordType)
    }
    setShowHistory(false)
    
    // Trigger search
    onSearch({
      query: historyItem.query,
      queryType: historyItem.queryType,
      recordType: historyItem.recordType
    })
  }

  const isValidDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
    return domainRegex.test(domain)
  }

  const isValidIP = (ip) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipRegex.test(ip)
  }

  const getPlaceholder = () => {
    switch (queryType) {
      case 'domain': return 'example.com'
      case 'ip': return '192.168.1.1 or 2001:db8::1'
      case 'dns': return 'example.com'
      default: return 'example.com or 192.168.1.1'
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Query Type Selection */}
        <QueryTypes
          queryTypes={queryTypes}
          selectedType={queryType}
          onTypeChange={setQueryType}
          recordType={recordType}
          onRecordTypeChange={setRecordType}
        />

        {/* Search Input */}
        <div className="relative" ref={inputRef}>
          <div className="flex shadow-smooth rounded-xl bg-white border border-gray-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-opacity-20 transition-all duration-200">
            <div className="flex items-center pl-4">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              placeholder={getPlaceholder()}
              className="flex-1 border-0 focus:ring-0 py-4 px-3 text-lg bg-transparent placeholder-gray-400"
              disabled={loading}
            />
            
            <div className="flex items-center pr-4">
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="btn-primary px-6 py-2 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>

          {/* Search History Dropdown */}
          <AnimatePresence>
            {showHistory && searchHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-80 overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </h3>
                  <button
                    onClick={onClearHistory}
                    className="text-xs text-gray-500 hover:text-error-600 transition-colors duration-200"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="p-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {item.query}
                          </span>
                          <span className="badge-info text-xs capitalize">
                            {item.queryType}
                            {item.recordType && ` • ${item.recordType}`}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()} • 
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <Search className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Examples */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-gray-500">Try:</span>
          {['google.com', 'github.com', '8.8.8.8', 'cloudflare.com'].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setQuery(example)}
              className="text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full transition-colors duration-200"
            >
              {example}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}