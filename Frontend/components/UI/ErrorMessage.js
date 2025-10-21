import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Home, Search } from 'lucide-react'

export default function ErrorMessage({ error, onRetry }) {
  const getErrorDetails = (errorMessage) => {
    if (errorMessage.includes('not found') || errorMessage.includes('No match')) {
      return {
        title: 'Domain Not Found',
        description: 'The domain or IP address you searched for was not found in the WHOIS database.',
        icon: Search,
        color: 'warning'
      }
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return {
        title: 'Request Timeout',
        description: 'The request took too long to complete. Please try again in a moment.',
        icon: RefreshCw,
        color: 'warning'
      }
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return {
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        icon: AlertCircle,
        color: 'error'
      }
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return {
        title: 'Rate Limit Exceeded',
        description: 'You have made too many requests. Please wait a few minutes before trying again.',
        icon: AlertCircle,
        color: 'warning'
      }
    }
    
    return {
      title: 'Something Went Wrong',
      description: errorMessage || 'An unexpected error occurred. Please try again.',
      icon: AlertCircle,
      color: 'error'
    }
  }

  const errorDetails = getErrorDetails(error)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
            errorDetails.color === 'error' 
              ? 'bg-error-100 border border-error-200' 
              : 'bg-warning-100 border border-warning-200'
          }`}
        >
          <errorDetails.icon className={`w-10 h-10 ${
            errorDetails.color === 'error' ? 'text-error-600' : 'text-warning-600'
          }`} />
        </motion.div>

        {/* Error Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className={`text-2xl font-bold mb-3 ${
            errorDetails.color === 'error' ? 'text-error-900' : 'text-warning-900'
          }`}>
            {errorDetails.title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            {errorDetails.description}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {onRetry && (
            <button
              onClick={onRetry}
              className={`btn-${
                errorDetails.color === 'error' ? 'error' : 'warning'
              } px-6 py-3 text-base font-medium flex items-center space-x-2`}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary px-6 py-3 text-base font-medium flex items-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
        </motion.div>

        {/* Technical Details (Collapsible) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md mx-auto"
        >
          <details className="cursor-pointer">
            <summary className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Technical Details
            </summary>
            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                {error}
              </pre>
            </div>
          </details>
        </motion.div>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 mb-3">Need help? Try these:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Check the domain spelling',
              'Try a different domain',
              'Ensure proper format (example.com)',
              'Wait a moment and retry'
            ].map((tip, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200"
              >
                {tip}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}