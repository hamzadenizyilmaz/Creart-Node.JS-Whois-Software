import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import DomainInfo from './DomainInfo'
import IPInfo from './IPInfo'
import RawData from './RawData'
import Loading from '../UI/Loading'
import ErrorMessage from '../UI/ErrorMessage'
import toast from 'react-hot-toast'

export default function ResultDisplay({ results, loading, error, onClear }) {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleDownload = () => {
    if (!results?.data) return

    const dataStr = JSON.stringify(results.data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `whois-lookup-${results.data.query}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Data downloaded!')
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <ErrorMessage 
        error={error} 
        onRetry={onClear}
      />
    )
  }

  if (!results) {
    return null
  }

  const { data, metadata } = results
  const isDomain = metadata.queryType === 'domain'
  const isIP = metadata.queryType === 'ip'
  const isDNS = metadata.queryType === 'dns'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      {/* Result Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {data.query}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="badge-info capitalize">
                  {metadata.queryType}
                  {isDNS && ` • ${metadata.recordType}`}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(metadata.timestamp).toLocaleString()}
                </span>
                {metadata.cached && (
                  <span className="badge-warning text-xs">
                    Cached
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(JSON.stringify(data, null, 2))}
              className="btn-secondary text-sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={onClear}
              className="btn-error text-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Result Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {isDomain && (
            <motion.div
              key="domain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DomainInfo data={data} />
            </motion.div>
          )}

          {isIP && (
            <motion.div
              key="ip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <IPInfo data={data} />
            </motion.div>
          )}

          {isDNS && (
            <motion.div
              key="dns"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.records.map((record, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Record {index + 1}
                      </div>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {typeof record === 'object' 
                          ? JSON.stringify(record, null, 2)
                          : String(record)
                        }
                      </pre>
                    </div>
                  ))}
                </div>
                
                <RawData 
                  data={data} 
                  onCopy={handleCopy}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}