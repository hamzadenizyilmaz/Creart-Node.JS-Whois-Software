import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      {/* Animated Globe */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="w-16 h-16 bg-gradient-to-r from-primary-600 to-cyan-600 rounded-full flex items-center justify-center mb-6"
      >
        <Globe className="w-8 h-8 text-white" />
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Searching WHOIS Database
        </h3>
        <p className="text-gray-600 mb-6">
          This may take a few seconds...
        </p>

        {/* Progress Bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-600 to-cyan-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-1 mt-6">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center max-w-md"
      >
        <p className="text-sm text-gray-500">
          <strong>Tip:</strong> Make sure the domain name is spelled correctly
        </p>
      </motion.div>
    </motion.div>
  )
}