import { motion } from 'framer-motion'
import { MapPin, Server, Shield, Network, Globe, Clock } from 'lucide-react'

export default function IPInfo({ data }) {
  const {
    summary,
    network,
    location,
    asn,
    rawData
  } = data

  const InfoCard = ({ title, icon: Icon, children, className = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  )

  const StatusBadge = ({ isPublic }) => (
    <span className={`badge-${isPublic ? 'success' : 'warning'} text-sm`}>
      {isPublic ? 'Public IP' : 'Private IP'}
    </span>
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-blue-600 font-medium">IP Address</div>
              <div className="text-lg font-bold text-blue-900 font-mono">
                {data.query}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-green-600 font-medium">Status</div>
              <div className="text-lg font-bold text-green-900">
                <StatusBadge isPublic={summary?.isPublic} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-purple-600 font-medium">Network</div>
              <div className="text-lg font-bold text-purple-900">
                {network?.name || 'Unknown'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Information */}
        <InfoCard title="Network Information" icon={Network}>
          <div className="space-y-3">
            {network?.cidr && (
              <div>
                <div className="text-sm text-gray-500">CIDR</div>
                <div className="font-medium text-gray-900 font-mono">
                  {network.cidr}
                </div>
              </div>
            )}
            {network?.range && (
              <div>
                <div className="text-sm text-gray-500">IP Range</div>
                <div className="font-medium text-gray-900 font-mono">
                  {network.range.start} - {network.range.end}
                </div>
              </div>
            )}
            {network?.name && (
              <div>
                <div className="text-sm text-gray-500">Network Name</div>
                <div className="font-medium text-gray-900">
                  {network.name}
                </div>
              </div>
            )}
          </div>
        </InfoCard>

        {/* ASN Information */}
        <InfoCard title="ASN Information" icon={Server}>
          <div className="space-y-3">
            {asn?.number && (
              <div>
                <div className="text-sm text-gray-500">AS Number</div>
                <div className="font-medium text-gray-900">
                  AS{asn.number}
                </div>
              </div>
            )}
            {asn?.name && (
              <div>
                <div className="text-sm text-gray-500">AS Name</div>
                <div className="font-medium text-gray-900">
                  {asn.name}
                </div>
              </div>
            )}
            {asn?.route && (
              <div>
                <div className="text-sm text-gray-500">Route</div>
                <div className="font-medium text-gray-900 font-mono">
                  {asn.route}
                </div>
              </div>
            )}
          </div>
        </InfoCard>

        {/* Location Information */}
        <InfoCard title="Geographic Location" icon={MapPin}>
          <div className="space-y-3">
            {location?.country && (
              <div>
                <div className="text-sm text-gray-500">Country</div>
                <div className="font-medium text-gray-900">
                  {location.country} {location.countryCode && `(${location.countryCode})`}
                </div>
              </div>
            )}
            {location?.region && (
              <div>
                <div className="text-sm text-gray-500">Region</div>
                <div className="font-medium text-gray-900">
                  {location.region}
                </div>
              </div>
            )}
            {location?.city && (
              <div>
                <div className="text-sm text-gray-500">City</div>
                <div className="font-medium text-gray-900">
                  {location.city}
                </div>
              </div>
            )}
            {location?.timezone && (
              <div>
                <div className="text-sm text-gray-500">Timezone</div>
                <div className="font-medium text-gray-900">
                  {location.timezone}
                </div>
              </div>
            )}
            {!location?.country && (
              <div className="text-gray-500">Location data not available</div>
            )}
          </div>
        </InfoCard>

        {/* Additional Information */}
        <InfoCard title="Additional Details" icon={Clock}>
          <div className="space-y-3">
            {summary?.ipVersion && (
              <div>
                <div className="text-sm text-gray-500">IP Version</div>
                <div className="font-medium text-gray-900">
                  IPv{summary.ipVersion}
                </div>
              </div>
            )}
            {summary?.type && (
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium text-gray-900 capitalize">
                  {summary.type}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500">Lookup Type</div>
              <div className="font-medium text-gray-900">
                WHOIS IP Lookup
              </div>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Raw Data Section */}
      {rawData && (
        <InfoCard title="Raw WHOIS Data" icon={Shield} className="col-span-full">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
              {rawData}
            </pre>
          </div>
        </InfoCard>
      )}
    </div>
  )
}