import Link from 'next/link'
import { Globe, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    Product: [
      { name: 'WHOIS Lookup', href: '#whois' },
      { name: 'DNS Search', href: '#dns' },
      { name: 'IP Lookup', href: '#ip' },
      { name: 'Bulk Search', href: '#bulk' },
    ],
    Resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Status', href: '/status' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                WHOIS<span className="text-primary-400">Lookup</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Professional WHOIS lookup, DNS records search, and domain information tool. 
              Trusted by developers and network professionals worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/hamzadenizyilmaz/Creart-Node.JS-Whois-Software"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/HamzaDenizYİL"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hamza@creartcloud.com"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-base text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} WHOIS Lookup. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with Hamza Deniz Yılmaz for the developer community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}