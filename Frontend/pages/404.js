import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* 404 Graphic */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-primary-600 to-cyan-600 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-white">404</span>
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
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or deleted.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/" className="btn-primary flex items-center justify-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-smooth"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Search className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Try a WHOIS Search</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Search for domain information, DNS records, or IP addresses
          </p>
          <Link href="/" className="btn-primary w-full text-center">
            Start Searching
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}