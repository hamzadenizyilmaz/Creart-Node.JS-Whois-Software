import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import SearchForm from '../components/Search/SearchForm'
import ResultDisplay from '../components/Results/ResultDisplay'
import ConnectionStatus from '../components/UI/ConnectionStatus'
import { searchWhois, searchDNS, checkHealth } from '../utils/api'

export default function Home() {
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('checking')

  useEffect(() => {
    checkConnection()
    const savedHistory = localStorage.getItem('whoisSearchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  const checkConnection = async () => {
    try {
      const health = await checkHealth()
      setConnectionStatus(health.success ? 'connected' : 'error')
    } catch (err) {
      setConnectionStatus('error')
    }
  }

  const handleSearch = async (searchData) => {
    const { query, queryType, recordType } = searchData
    setLoading(true)
    setError(null)

    try {
      let result
      
      if (queryType === 'dns') {
        result = await searchDNS(query, recordType)
      } else {
        result = await searchWhois(query, queryType)
      }

      if (result.success) {
        setSearchResults(result)
        
        const newSearch = {
          query,
          queryType,
          recordType,
          timestamp: new Date().toISOString(),
          result: result.data
        }
        
        const updatedHistory = [
          newSearch,
          ...searchHistory.filter(item => item.query !== query).slice(0, 9)
        ]
        
        setSearchHistory(updatedHistory)
        localStorage.setItem('whoisSearchHistory', JSON.stringify(updatedHistory))
      } else {
        setError(result.error || 'An error occurred during search')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setSearchResults(null)
    setError(null)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('whoisSearchHistory')
  }

  return (
    <>
      <Head>
        <title>WHOIS Lookup - Professional Domain & DNS Search Tool</title>
        <meta 
          name="description" 
          content="Free WHOIS lookup, domain availability check, DNS records search, and IP information. Professional tool for developers and network administrators." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        
        {/* SEO Meta Tags */}
        <meta name="keywords" content="whois, dns lookup, domain search, ip lookup, network tools" />
        <meta name="author" content="WHOIS Lookup" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="WHOIS Lookup - Professional Domain & DNS Search Tool" />
        <meta property="og:description" content="Free WHOIS lookup, domain availability check, DNS records search, and IP information." />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="WHOIS Lookup - Professional Domain & DNS Search Tool" />
        <meta name="twitter:description" content="Free WHOIS lookup, domain availability check, DNS records search, and IP information." />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
              
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      >
        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Professional{' '}
                <span className="bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">
                  WHOIS Lookup
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Free domain availability check, DNS records lookup, and comprehensive 
                WHOIS information. Trusted by developers and network professionals worldwide.
              </motion.p>

              <ConnectionStatus status={connectionStatus} />
            </div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <SearchForm 
                onSearch={handleSearch}
                loading={loading}
                searchHistory={searchHistory}
                onClearHistory={clearHistory}
              />
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-12 max-w-7xl mx-auto"
            >
              <ResultDisplay 
                results={searchResults}
                loading={loading}
                error={error}
                onClear={clearResults}
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need for comprehensive domain and network analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-smooth hover:shadow-glow transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </>
  )
}

const features = [
  {
    title: 'WHOIS Lookup',
    description: 'Get comprehensive domain registration details, ownership information, and expiration dates.',
    icon: 'Globe',
  },
  {
    title: 'DNS Records',
    description: 'Query all DNS record types including A, AAAA, MX, TXT, NS, CNAME, and more.',
    icon: 'Server',
  },
  {
    title: 'IP Information',
    description: 'Look up IP address details, network information, and geographic location data.',
    icon: 'MapPin',
  },
]