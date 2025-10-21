import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function ConnectionStatus({ status = 'checking' }) {
  const statusConfig = {
    checking: {
      icon: Clock,
      text: 'Checking connection...',
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
      borderColor: 'border-warning-200'
    },
    connected: {
      icon: CheckCircle,
      text: 'Connected to API',
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      borderColor: 'border-success-200'
    },
    error: {
      icon: XCircle,
      text: 'API connection failed',
      color: 'text-error-600',
      bgColor: 'bg-error-100',
      borderColor: 'border-error-200'
    },
    offline: {
      icon: WifiOff,
      text: 'No internet connection',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200'
    }
  }

  const currentStatus = statusConfig[status] || statusConfig.error

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${currentStatus.bgColor} ${currentStatus.borderColor} backdrop-blur-sm`}
      >
        <motion.div
          animate={status === 'checking' ? { rotate: 360 } : {}}
          transition={status === 'checking' ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
        >
          <currentStatus.icon className={`w-4 h-4 ${currentStatus.color}`} />
        </motion.div>
        <span className={`text-sm font-medium ${currentStatus.color}`}>
          {currentStatus.text}
        </span>
        
        {/* Pulsing dot for checking status */}
        {status === 'checking' && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-warning-400 rounded-full"
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}