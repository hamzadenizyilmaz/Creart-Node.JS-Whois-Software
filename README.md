# Creart-Whois - Comprehensive WHOIS Lookup Platform

![WHOIS Lookup](https://img.shields.io/badge/WHOIS-Lookup-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Next.js](https://img.shields.io/badge/Next.js-13%2B-black)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Version](https://img.shields.io/badge/Version-1.2.5--beta-orange)

**Creart-Whois** is a modern, full-featured WHOIS lookup platform designed for querying domains, IPv4, IPv6, ASN, and CIDR. Built with a cutting-edge tech stack including **Node.js**, **Next.js 14+**, **Tailwind CSS**, and **Framer Motion**, it offers a fast, secure, and extensible solution with a sleek, user-friendly interface. This is the **first beta release (v1.2.5-beta)**, and we’re excited to share it with the community! Whether you're a developer, network administrator, or cybersecurity enthusiast, Creart-Whois provides powerful tools to explore and analyze network data.

## 🚀 Features

### 🔍 Query Capabilities
- **Domain WHOIS**: Retrieve detailed domain information, including registrar details, creation/expiry dates, name servers, and ownership data.
- **IPv4/IPv6 Lookup**: Access IP geolocation, ISP details, and security analysis for both IPv4 and IPv6 addresses.
- **ASN (Autonomous System Number)**: Query network details for ASNs, including provider and routing information.
- **CIDR Blocks**: Analyze IP ranges and subnets with robust CIDR parsing.
- **DNS Records**: Comprehensive querying for all DNS record types (A, AAAA, MX, CNAME, TXT, etc.).

### 💻 Technical Highlights
- **Modern Tech Stack**: Powered by **Node.js 18+** for the backend and **Next.js 14+** for the frontend, with **Tailwind CSS** for styling and **Framer Motion** for animations.
- **Real-Time Queries**: Fast and reliable WHOIS and DNS lookups with optimized backend performance.
- **Responsive Design**: Fully responsive UI for seamless use on mobile, tablet, and desktop devices.
- **RESTful API**: Developer-friendly API with rate limiting, caching, and detailed documentation.
- **Security First**: Equipped with **Helmet**, **CORS**, input validation (Joi), and XSS/SQL injection protection.
- **Performance Optimized**: Server-side rendering (SSR), static site generation (SSG), Gzip/Brotli compression, and Redis/node-cache integration.

### 🎨 User Experience
- **Modern UI/UX**: Glass-morphism design, gradient backgrounds, and smooth animations at 60 FPS.
- **Dark/Light Mode**: Automatic theme switching based on user preferences.
- **Smart Search**: Features autocomplete, query suggestions, and search history for quick lookups.
- **Detailed Reports**: View results in formatted or raw data modes for flexibility.
- **Accessibility**: Built with ARIA standards for inclusive access.

## 📁 Project Structure

```
Creart-Node.JS-Whois-Software/
├── 📁 backend/                          # Node.js API Server
│   ├── 📁 config/                       # Configuration files
│   │   └── constants.js                 # Application constants and settings
│   ├── 📁 middleware/                   # Express middleware
│   │   ├── validation.js                # Joi validation schemas
│   │   ├── rateLimit.js                 # Rate limiting configuration
│   │   ├── errorHandler.js              # Global error handling
│   │   ├── cache.js                     # Redis/node-cache middleware
│   │   └── asyncHandler.js              # Async/await error handler
│   ├── 📁 routes/                       # API routes
│   │   ├── whois.js                     # WHOIS query endpoints
│   │   ├── dns.js                       # DNS query endpoints
│   │   └── health.js                    # Health check endpoints
│   ├── 📁 utils/                        # Utility functions
│   │   ├── whoisParser.js               # WHOIS data parser and analyzer
│   │   ├── ipTools.js                   # IP address utilities
│   │   ├── responseFormatter.js         # Standardized response formatting
│   │   ├── database.js                  # Database connection utilities
│   │   └── cache.js                     # Cache management
│   ├── package.json                     # Backend dependencies
│   └── server.js                        # Main server file
├── 📁 frontend/                         # Next.js React Application
│   ├── 📁 components/                   # React components
│   │   ├── 📁 Layout/                   # Layout components
│   │   │   ├── Layout.js                # Main layout component
│   │   │   ├── Header.js                # Navigation header
│   │   │   └── Footer.js                # Site footer
│   │   ├── 📁 Search/                   # Search components
│   │   │   ├── SearchForm.js            # Main search form
│   │   │   └── QueryTypes.js            # Query type selector
│   │   ├── 📁 Results/                  # Result display components
│   │   │   ├── ResultDisplay.js         # Main results view
│   │   │   ├── DomainInfo.js            # Domain information display
│   │   │   ├── IPInfo.js                # IP information display
│   │   │   └── RawData.js               # Raw data view
│   │   └── 📁 UI/                       # UI components
│   │       ├── Button.js                # Button components
│   │       ├── Loading.js               # Loading animations
│   │       └── ErrorMessage.js          # Error message component
│   ├── 📁 pages/                        # Next.js pages
│   │   ├── index.js                     # Homepage
│   │   ├── _app.js                      # Next.js app wrapper
│   │   └── 📁 api/                      # API routes
│   │       └── hello.js                 # Sample API route
│   ├── 📁 styles/                       # Style files
│   │   └── globals.css                  # Global CSS and Tailwind
│   ├── 📁 utils/                        # Frontend utilities
│   │   ├── api.js                       # API call utilities
│   │   └── formatters.js                # Data formatting utilities
│   ├── public/                          # Static assets
│   ├── next.config.js                   # Next.js configuration
│   ├── tailwind.config.js               # Tailwind CSS configuration
│   ├── postcss.config.js                # PostCSS configuration
│   └── package.json                     # Frontend dependencies
├── 📁 docs/                             # Documentation
├── 📁 scripts/                          # Deployment scripts
├── LICENSE                              # MIT License
└── README.md                            # This file
```

## 🛠️ Installation and Setup

### Prerequisites
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Git**: For cloning the repository
- Optional: **Docker** for containerized deployment, **Redis** for caching, **MongoDB** for database (if enabled)

### 🏃‍♂️ Quick Start (Local Development)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/hamzadenizyilmaz/Creart-Node.JS-Whois-Software.git
   cd Creart-Node.JS-Whois-Software
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://test:test@test.mongodb.net/

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **Run the Application**:
   - **Backend** (in one terminal):
     ```bash
     cd backend
     npm run start
     ```
     Expected output:
     ```
     WHOIS API Server Started!
     Port: 5000
     Environment: development
     API URL: http://localhost:5000/api/v1
     Health Check: http://localhost:5000/health
     ```
   - **Frontend** (in another terminal):
     ```bash
     cd frontend
     npm run dev
     ```
     Expected output:
     ```
     ▲ Next.js 14.2.33
     - Local: http://localhost:3000
     ```

5. **Test in Browser**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api/v1`
   - Health Check: `http://localhost:5000/health`

### 🌐 Production Deployment

#### 1. Environment Setup
Update environment files for production:
- **Backend `.env`**:
  ```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://test:test@test.mongodb.net/

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
  ```

#### 2. Build Process
- **Backend**:
  ```bash
  cd backend
  npm run build
  npm start
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm run build
  npm start
  # Or for static export:
  npm run build && npm run export
  ```

#### 3. Deployment Options

##### A) VPS/Cloud Server (Ubuntu 20.04+)
```bash
# Connect to server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/hamzadenizyilmaz/Creart-Node.JS-Whois-Software.git
cd Creart-Node.JS-Whois-Software

# Backend setup
cd backend
npm install --production
pm2 start server.js --name "whois-backend"

# Frontend setup
cd ../frontend
npm install --production
npm run build
```

**Nginx Configuration** (`/etc/nginx/sites-available/whois-app`):
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /path/to/Creart-Node.JS-Whois-Software/frontend/out;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

##### B) Docker Deployment
**`docker-compose.yml`**:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/whois-app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongodb_data:
  redis_data:
```

Run:
```bash
docker-compose up -d
```

##### C) Platform-as-a-Service
- **Vercel (Frontend)**:
  ```bash
  cd frontend
  npm i -g vercel
  vercel --prod
  ```
- **Railway/Heroku (Backend)**:
  ```bash
  cd backend
  railway add
  railway deploy
  ```

## 🔧 API Documentation

### Base URL
- Development: `http://localhost:5000/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

### Endpoints

#### 🔍 WHOIS Lookup
**POST** `/whois`
- **Request Body**:
  ```json
  {
    "query": "example.com",
    "type": "domain"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "domainName": "example.com",
      "registrar": "Example Registrar",
      "creationDate": "1995-08-13T00:00:00Z",
      "expiryDate": "2026-08-12T00:00:00Z",
      "nameServers": ["ns1.example.com", "ns2.example.com"],
      "status": "clientTransferProhibited"
    },
    "metadata": {
      "responseTime": "245ms",
      "cached": false,
      "timestamp": "2025-10-22T02:02:00Z"
    }
  }
  ```

#### 🌐 DNS Lookup
**POST** `/dns`
- **Request Body**:
  ```json
  {
    "domain": "example.com",
    "recordType": "A"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "domain": "example.com",
      "recordType": "A",
      "records": ["93.184.216.34"]
    }
  }
  ```

#### 📊 Batch Query
**POST** `/whois/batch`
- **Request Body**:
  ```json
  {
    "queries": [
      {"query": "example.com", "type": "domain"},
      {"query": "8.8.8.8", "type": "ipv4"},
      {"query": "AS15169", "type": "asn"}
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      { "query": "example.com", "type": "domain", "result": {...} },
      { "query": "8.8.8.8", "type": "ipv4", "result": {...} },
      { "query": "AS15169", "type": "asn", "result": {...} }
    ]
  }
  ```

#### ❤️ Health Check
**GET** `/health`
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2025-10-22T02:02:00Z",
    "uptime": 12345.67,
    "version": "1.2.5-beta"
  }
  ```

### Supported Query Types
| Type     | Format            | Example                     | Description                     |
|----------|-------------------|-----------------------------|---------------------------------|
| `domain` | FQDN              | `example.com`               | Domain WHOIS information        |
| `ipv4`   | IPv4 Address      | `8.8.8.8`                   | IPv4 address details            |
| `ipv6`   | IPv6 Address      | `2001:4860:4860::8888`      | IPv6 address details            |
| `asn`    | AS Number         | `AS15169` or `15169`        | Autonomous System information   |
| `cidr`   | CIDR Notation     | `192.168.1.0/24`            | CIDR block information          |

## 🎨 Customization

### Theme Customization
Edit `frontend/tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#your-custom-color',
        },
      },
    },
  },
};
```

### Branding
Update the logo and app name in `frontend/components/Layout/Header.js`:
```javascript
// Customize logo and site title
const Header = () => {
  return (
    <header>
      <img src="/path/to/your-logo.png" alt="Creart-Whois" />
      <h1>Your Custom App Name</h1>
    </header>
  );
};
```

### Adding New Query Types
1. Update `backend/config/constants.js` to include the new query type in `SUPPORTED_QUERY_TYPES`.
2. Add a parser in `backend/utils/whoisParser.js` for the new type.
3. Update the frontend UI in `frontend/components/Search/QueryTypes.js`.

## 🔒 Security Features
- **Rate Limiting**: Configurable per-IP limits for WHOIS and API requests.
- **CORS**: Restrict access to trusted domains only.
- **Input Validation**: Joi schemas for all API inputs to prevent injection attacks.
- **Helmet**: Security headers to protect against common vulnerabilities.
- **XSS Protection**: Input sanitization using libraries like `sanitize-html`.
- **SQL Injection Protection**: Parameterized queries for database interactions (if applicable).

## 📊 Performance Optimizations

### Backend
- **Caching**: 5-minute TTL for WHOIS results using Redis or node-cache.
- **Compression**: Gzip/Brotli for reduced response sizes.
- **Connection Pooling**: Optimized database connections for high throughput.
- **Cluster Mode**: Multi-process support for scalability.

### Frontend
- **SSR/SSG**: Next.js server-side rendering and static site generation for fast page loads.
- **Image Optimization**: Using Next.js `Image` component for efficient asset delivery.
- **Code Splitting**: Dynamic imports to reduce bundle size.
- **CDN Support**: Ready for static asset distribution via CDNs.

## 🐛 Troubleshooting

### Common Issues
1. **Backend Fails to Start**:
   ```bash
   netstat -tulpn | grep :5000
   pkill -f node
   cd backend && npm start
   ```

2. **CORS Errors**:
   Check `backend/.env`:
   ```env
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

3. **WHOIS Query Timeouts**:
   Update `backend/utils/whoisParser.js`:
   ```javascript
   const WHOIS_CONFIG = {
     timeout: 30000, // Increase to 30 seconds
     retries: 3,     // Retry up to 3 times
   };
   ```

4. **High Memory Usage**:
   ```bash
   pm2 start server.js --name "whois-backend" --max-memory-restart 512M
   ```

### Logs
- **Backend**:
  ```bash
  cd backend && npm run dev
  # Production logs
  pm2 logs whois-backend
  tail -f ~/.pm2/logs/whois-backend-out.log
  ```
- **Frontend**:
  Check browser console (`F12 > Console`) or build logs:
  ```bash
  cd frontend && npm run build
  ```

## 🤝 Contributing

We welcome contributions to make Creart-Whois even better! Here's how to get started:

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/your-username/Creart-Node.JS-Whois-Software.git
   cd Creart-Node.JS-Whois-Software
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Changes and Commit**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and Create a Pull Request**:
   ```bash
   git push origin feature/your-feature
   ```

### Coding Standards
- **ESLint**: Follow Airbnb style guide.
- **Prettier**: Auto-format code for consistency.
- **Commit Messages**: Use conventional commits (e.g., `feat:`, `fix:`, `docs:`).
- **Testing**: Write Jest tests for new features.

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# End-to-end tests
npm run test:e2e
```

## 📈 Monitoring and Analytics

### Health Monitoring
```bash
curl http://localhost:5000/health
curl http://localhost:5000/health/detailed
```

### Performance Metrics
```bash
curl http://localhost:5000/api/v1/stats
curl http://localhost:5000/api/v1/cache/stats
```

## 🔄 Updates and Maintenance

### Dependency Updates
```bash
cd backend && npm update
cd frontend && npm update
npm audit
npm audit fix
```

### Backup and Recovery
```bash
# Database backup (if used)
mongodump --uri="mongodb://localhost:27017/whois" --out=./backup/

# Environment backup
cp .env .env.backup

# Code backup
git tag v1.2.5-beta-backup
git push --tags
```

## 📞 Support and Community

- **GitHub Issues**: [Report Bugs](https://github.com/hamzadenizyilmaz/Creart-Node.JS-Whois-Software/issues)
- **Email**: [support@yourdomain.com](mailto:support@yourdomain.com)
- **Discord**: [Join our Community](https://discord.gg/your-invite-link)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **WHOIS Protocol**: Thanks to the Internet Systems Consortium.
- **Node.js Community**: For a robust ecosystem.
- **Next.js Team**: For an exceptional React framework.
- **Tailwind CSS**: For a utility-first CSS framework.
- **Framer Motion**: For smooth and delightful animations.

---

**⭐ Star us on [GitHub](https://github.com/hamzadenizyilmaz/Creart-Node.JS-Whois-Software) if you find this project useful!**

**Creart-Whois** is your go-to solution for modern WHOIS lookups. Join us in building the future of network querying! 🚀
