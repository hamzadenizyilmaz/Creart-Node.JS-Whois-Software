import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

export default function Custom500() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Error Graphic */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-error-600 to-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Server Error
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Something went wrong on our end. Please try again later or contact support if the problem persists.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button 
            onClick={handleRetry}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          
          <Link href="/" className="btn-secondary flex items-center justify-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </motion.div>

        {/* Technical Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-smooth"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Need Help?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            If this error continues, please check our service status or contact our support team.
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>Error Code: 500 - Internal Server Error</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}