import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RawData({ data, onCopy }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Raw Data</h3>
          <span className="badge-info text-xs">
            {typeof data === 'string' ? 'Text' : 'JSON'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-success-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          
          <button
            onClick={toggleExpanded}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 200 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-gray-50">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {typeof data === 'string' 
                ? data 
                : JSON.stringify(data, null, 2)
              }
            </pre>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Overlay for collapsed state */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
    </motion.div>
  )
}