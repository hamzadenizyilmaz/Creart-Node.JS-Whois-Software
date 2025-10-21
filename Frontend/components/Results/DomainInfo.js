import { motion } from 'framer-motion'
import { Calendar, Globe, User, Server, Shield, Clock } from 'lucide-react'

export default function DomainInfo({ data }) {
  const {
    summary,
    dates,
    registrar,
    nameServers,
    status,
    contacts
  } = data

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    if (status.includes('ok') || status.includes('active')) return 'success'
    if (status.includes('pending') || status.includes('hold')) return 'warning'
    if (status.includes('inactive') || status.includes('suspended')) return 'error'
    return 'info'
  }

  const InfoSection = ({ title, icon: Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-green-600 font-medium">Status</div>
              <div className="text-lg font-bold text-green-900">
                {summary.available ? 'Available' : 'Registered'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-blue-600 font-medium">Created</div>
              <div className="text-lg font-bold text-blue-900">
                {dates.created ? formatDate(dates.created) : 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-4 border border-orange-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-orange-600 font-medium">Expires</div>
              <div className="text-lg font-bold text-orange-900">
                {dates.expires ? formatDate(dates.expires) : 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-purple-600 font-medium">Name Servers</div>
              <div className="text-lg font-bold text-purple-900">
                {nameServers?.length || 0}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrar Information */}
        <InfoSection title="Registrar Information" icon={User}>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Registrar</div>
              <div className="font-medium text-gray-900">
                {registrar?.name || 'N/A'}
              </div>
            </div>
            {registrar?.ianaId && (
              <div>
                <div className="text-sm text-gray-500">IANA ID</div>
                <div className="font-medium text-gray-900">{registrar.ianaId}</div>
              </div>
            )}
          </div>
        </InfoSection>

        {/* Domain Status */}
        <InfoSection title="Domain Status" icon={Shield}>
          <div className="space-y-2">
            {status?.length > 0 ? (
              status.map((statusItem, index) => (
                <div
                  key={index}
                  className={`badge-${getStatusColor(statusItem.type)} capitalize`}
                >
                  {statusItem.type}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No status information available</div>
            )}
          </div>
        </InfoSection>

        {/* Name Servers */}
        <InfoSection title="Name Servers" icon={Server}>
          <div className="space-y-2">
            {nameServers?.length > 0 ? (
              nameServers.map((ns, index) => (
                <div
                  key={index}
                  className="font-mono text-sm bg-gray-100 px-3 py-1 rounded border border-gray-200"
                >
                  {ns.host}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No name servers found</div>
            )}
          </div>
        </InfoSection>

        {/* Contact Information */}
        <InfoSection title="Contact Information" icon={User}>
          <div className="space-y-4">
            {['registrant', 'admin', 'technical'].map((contactType) => {
              const contact = contacts[contactType]
              if (!contact) return null

              return (
                <div key={contactType}>
                  <div className="text-sm font-medium text-gray-900 capitalize mb-2">
                    {contactType}
                  </div>
                  <div className="space-y-1 text-sm">
                    {contact.name && (
                      <div className="text-gray-600">Name: {contact.name}</div>
                    )}
                    {contact.organization && (
                      <div className="text-gray-600">Organization: {contact.organization}</div>
                    )}
                    {contact.email && (
                      <div className="text-gray-600">Email: {contact.email}</div>
                    )}
                  </div>
                </div>
              )
            })}
            {!contacts.registrant && !contacts.admin && !contacts.technical && (
              <div className="text-gray-500">No contact information available</div>
            )}
          </div>
        </InfoSection>
      </div>
    </div>
  )
}