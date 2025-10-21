import { motion } from 'framer-motion'
import { Globe, Server, MapPin, ChevronDown } from 'lucide-react'

export default function QueryTypes({ 
  queryTypes, 
  selectedType, 
  onTypeChange,
  recordType,
  onRecordTypeChange 
}) {
  const dnsRecordTypes = [
    { value: 'A', label: 'A Record' },
    { value: 'AAAA', label: 'AAAA Record' },
    { value: 'MX', label: 'MX Record' },
    { value: 'TXT', label: 'TXT Record' },
    { value: 'NS', label: 'NS Record' },
    { value: 'CNAME', label: 'CNAME Record' },
    { value: 'SOA', label: 'SOA Record' },
  ]

  return (
    <div className="space-y-4">
      {/* Query Type Selection */}
      <div className="flex flex-col sm:flex-row gap-3">
        {queryTypes.map((type) => (
          <motion.button
            key={type.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onTypeChange(type.value)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all duration-200 flex-1 text-left ${
              selectedType === type.value
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <type.icon className={`w-5 h-5 ${
              selectedType === type.value ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{type.label}</div>
              <div className="text-xs text-gray-500 truncate">{type.description}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* DNS Record Type Selection (only show when DNS is selected) */}
      {selectedType === 'dns' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Record Type:
          </span>
          <div className="relative flex-1 max-w-xs">
            <select
              value={recordType}
              onChange={(e) => onRecordTypeChange(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              {dnsRecordTypes.map((record) => (
                <option key={record.value} value={record.value}>
                  {record.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">
              {recordType === 'A' && 'IPv4 address record'}
              {recordType === 'AAAA' && 'IPv6 address record'}
              {recordType === 'MX' && 'Mail exchange record'}
              {recordType === 'TXT' && 'Text record (often used for verification)'}
              {recordType === 'NS' && 'Name server record'}
              {recordType === 'CNAME' && 'Canonical name record (alias)'}
              {recordType === 'SOA' && 'Start of authority record'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}