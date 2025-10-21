# Creart-Whois - Comprehensive WHOIS Lookup Platform

![WHOIS Lookup](https://img.shields.io/badge/WHOIS-Lookup-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Next.js](https://img.shields.io/badge/Next.js-14%2B-black)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Version](https://img.shields.io/badge/Version-1.2.5--beta-orange)

**Creart-Whois** is a modern WHOIS lookup platform for querying domains, IPv4, IPv6, ASN, and CIDR. Powered by **Node.js 18+**, **Next.js 14+**, **Tailwind CSS**, and **Framer Motion**, it delivers a fast, secure, and extensible solution with a sleek, responsive interface. As the **first beta release (v1.2.5-beta)**, we’re excited to share this with the community and welcome feedback to shape its future!

## 🚀 Features

### 🔍 Query Capabilities
- **Domain WHOIS**: Detailed registrar, ownership, and name server data.
- **IPv4/IPv6 Lookup**: Geolocation, ISP, and security details.
- **ASN Queries**: Autonomous System Number details, including provider and routing.
- **CIDR Blocks**: Subnet and IP range analysis.
- **DNS Records**: Support for A, AAAA, MX, CNAME, TXT, and more.

### 💻 Technical Highlights
- **Tech Stack**: Node.js (backend), Next.js 14+ (frontend), Tailwind CSS, Framer Motion.
- **Real-Time Queries**: Optimized for speed with caching support.
- **Responsive UI**: Mobile, tablet, and desktop compatibility.
- **RESTful API**: Developer-friendly with rate limiting and caching.
- **Security**: Helmet, CORS, Joi validation, XSS/SQL injection protection.
- **Performance**: SSR/SSG, Gzip/Brotli compression, Redis/node-cache.

### 🎨 User Experience
- **Modern Design**: Glass-morphism, gradients, 60 FPS animations.
- **Dark/Light Mode**: Auto-switching themes.
- **Smart Search**: Autocomplete, suggestions, and history.
- **Reports**: Formatted or raw data views.
- **Accessibility**: ARIA-compliant for inclusivity.

## 📁 Project Structure

```
Creart-Node.JS-Whois-Software/
├── 📁 backend/                          # Node.js API Server
│   ├── 📁 config/                       # Configuration
│   │   └── constants.js                 # App constants
│   ├── 📁 middleware/                   # Express middleware
│   │   ├── validation.js                # Joi schemas
│   │   ├── rateLimit.js                 # Rate limiting
│   │   ├── errorHandler.js              # Error handling
│   │   ├── cache.js                     # Redis/node-cache
│   │   └── asyncHandler.js              # Async error handler
│   ├── 📁 routes/                       # API routes
│   │   ├── whois.js                     # WHOIS endpoints
│   │   ├── dns.js                       # DNS endpoints
│   │   └── health.js                    # Health checks
│   ├── 📁 utils/                        # Utilities
│   │   ├── whoisParser.js               # WHOIS parser
│   │   ├── ipTools.js                   # IP utilities
│   │   ├── responseFormatter.js         # Response formatting
│   │   ├── database.js                  # DB utilities
│   │   └── cache.js                     # Cache management
│   ├── package.json                     # Dependencies
│   └── server.js                        # Main server
├── 📁 frontend/                         # Next.js Application
│   ├── 📁 components/                   # React components
│   │   ├── 📁 Layout/                   # Layout components
│   │   │   ├── Layout.js                # Main layout
│   │   │   ├── Header.js                # Navigation
│   │   │   └── Footer.js                # Footer
│   │   ├── 📁 Search/                   # Search components
│   │   │   ├── SearchForm.js            # Search form
│   │   │   └── QueryTypes.js            # Query type selector
│   │   ├── 📁 Results/                  # Result components
│   │   │   ├── ResultDisplay.js         # Results view
│   │   │   ├── DomainInfo.js            # Domain display
│   │   │   ├── IPInfo.js                # IP display
│   │   │   └── RawData.js               # Raw data view
│   │   └── 📁 UI/                       # UI components
│   │       ├── Button.js                # Buttons
│   │       ├── Loading.js               # Loading animations
│   │       └── ErrorMessage.js          # Error messages
│   ├── 📁 pages/                        # Next.js pages
│   │   ├── index.js                     # Homepage
│   │   ├── _app.js                      # App wrapper
│   │   └── 📁 api/                      # API routes
│   │       └── hello.js                 # Sample route
│   ├── 📁 styles/                       # Styles
│   │   └── globals.css                  # Global CSS & Tailwind
│   ├── 📁 utils/                        # Frontend utilities
│   │   ├── api.js                       # API calls
│   │   └── formatters.js                # Data formatters
│   ├── public/                          # Static assets
│   ├── next.config.js                   # Next.js config
│   ├── tailwind.config.js               # Tailwind config
│   ├── postcss.config.js                # PostCSS config
│   └── package.json                     # Dependencies
├── 📁 docs/                             # Documentation
├── 📁 scripts/                          # Deployment scripts
├── LICENSE                              # MIT License
└── README.md                            # This file
```

## 🛠️ Installation

### Prerequisites
- **Node.js**: 18.0+
- **npm**: 9.0+
- **Git**
- Optional: **Docker**, **Redis**, **MongoDB**

### 🏃‍♂️ Local Setup

1. **Clone Repository**:
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
   Edit `.env`:
   ```env
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb+srv://test:test@test.mongodb.net/
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **Run Application**:
   - **Backend**:
     ```bash
     cd backend
     npm start
     ```
     Output:
     ```
     WHOIS API Server Started!
     Port: 3001
     Environment: development
     API URL: http://localhost:3001/api/v1
     Health Check: http://localhost:3001/health
     ```
   - **Frontend**:
     ```bash
     cd frontend
     npm run dev
     ```
     Output:
     ```
     ▲ Next.js 14.2.33
     Local: http://localhost:3000
     ```

5. **Test**:
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:3001/api/v1`
   - Health Check: `http://localhost:3001/health`

### 🌐 Production Deployment

#### Environment
- **Backend `.env`**:
  ```env
  NODE_ENV=production
  PORT=3001
  FRONTEND_URL=https://yourdomain.com
  MONGODB_URI=mongodb+srv://test:test@test.mongodb.net/
  RATE_LIMIT_WINDOW_MS=900000
  RATE_LIMIT_MAX_REQUESTS=100
  ```

#### Build
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
  # Or static export:
  npm run build && npm run export
  ```

#### Deployment Options

##### A) VPS (Ubuntu 20.04+)
```bash
ssh user@your-server-ip
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install nginx -y
sudo npm install -g pm2
git clone https://github.com/hamzadenizyilmaz/Creart-Node.JS-Whois-Software.git
cd Creart-Node.JS-Whois-Software
cd backend
npm install --production
pm2 start server.js --name "whois-backend"
cd ../frontend
npm install --production
npm run build
```

**Nginx Config** (`/etc/nginx/sites-available/whois-app`):
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /path/to/Creart-Node.JS-Whois-Software/frontend/out;
    index index.html;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

##### B) Docker
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

##### C) PaaS
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
- Development: `http://localhost:3001/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

### Endpoints

#### 🔍 WHOIS Lookup
**POST** `/whois`
- **Request**:
  ```json
  { "query": "example.com", "type": "domain" }
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
    "metadata": { "responseTime": "245ms", "cached": false, "timestamp": "2025-10-22T02:10:00Z" }
  }
  ```

#### 🌐 DNS Lookup
**POST** `/dns`
- **Request**:
  ```json
  { "domain": "example.com", "recordType": "A" }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": { "domain": "example.com", "recordType": "A", "records": ["93.184.216.34"] }
  }
  ```

#### 📊 Batch Query
**POST** `/whois/batch`
- **Request**:
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
  { "success": true, "data": [{ "query": "example.com", "type": "domain", "result": {...} }, ...] }
  ```

#### ❤️ Health Check
**GET** `/health`
- **Response**:
  ```json
  { "status": "healthy", "timestamp": "2025-10-22T02:10:00Z", "uptime": 12345.67, "version": "1.2.5-beta" }
  ```

### Query Types
| Type     | Format         | Example                  | Description                    |
|----------|----------------|--------------------------|--------------------------------|
| `domain` | FQDN           | `example.com`            | Domain WHOIS info             |
| `ipv4`   | IPv4 Address   | `8.8.8.8`                | IPv4 details                  |
| `ipv6`   | IPv6 Address   | `2001:4860:4860::8888`   | IPv6 details                  |
| `asn`    | AS Number      | `AS15169` or `15169`     | ASN info                      |
| `cidr`   | CIDR Notation  | `192.168.1.0/24`         | CIDR block info               |

## 🎨 Customization

### Theme
Edit `frontend/tailwind.config.js`:
```javascript
module.exports = {
  theme: { extend: { colors: { primary: { 500: '#your-custom-color' } } } }
};
```

### Branding
Update `frontend/components/Layout/Header.js`:
```javascript
const Header = () => (
  <header>
    <img src="/path/to/your-logo.png" alt="Creart-Whois" />
    <h1>Your Custom App Name</h1>
  </header>
);
```

### New Query Types
1. Add to `backend/config/constants.js` (`SUPPORTED_QUERY_TYPES`).
2. Create parser in `backend/utils/whoisParser.js`.
3. Update UI in `frontend/components/Search/QueryTypes.js`.

## 🔒 Security
- **Rate Limiting**: Per-IP query limits.
- **CORS**: Trusted domains only.
- **Input Validation**: Joi schemas.
- **Helmet**: Security headers.
- **XSS/SQL Protection**: Sanitization and parameterized queries.

## 📊 Performance
- **Backend**: 5-min cache, Gzip/Brotli, connection pooling, cluster mode.
- **Frontend**: SSR/SSG, image optimization, code splitting, CDN-ready.

## 🐛 Troubleshooting

### Issues
1. **Backend Failure**:
   ```bash
   netstat -tulpn | grep :3001
   pkill -f node
   cd backend && npm start
   ```
2. **CORS Errors**:
   Check `backend/.env`:
   ```env
   FRONTEND_URL=http://localhost:3000
   ```
3. **Timeouts**:
   Edit `backend/utils/whoisParser.js`:
   ```javascript
   const WHOIS_CONFIG = { timeout: 30000, retries: 3 };
   ```
4. **Memory Usage**:
   ```bash
   pm2 start server.js --name "whois-backend" --max-memory-restart 512M
   ```

### Logs
- **Backend**:
  ```bash
  cd backend && npm run dev
  pm2 logs whois-backend
  ```
- **Frontend**:
  ```bash
  cd frontend && npm run build
  # Check browser console (F12)
  ```

## 🤝 Contributing

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/your-username/Creart-Node.JS-Whois-Software.git
   ```
2. **Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit**:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```
4. **Push & PR**:
   ```bash
   git push origin feature/your-feature
   ```

### Standards
- **ESLint**: Airbnb style.
- **Prettier**: Code formatting.
- **Commits**: Conventional (e.g., `feat:`, `fix:`).
- **Tests**: Jest.

### Testing
```bash
cd backend && npm test
cd frontend && npm test
npm run test:e2e
```

## 📈 Monitoring
- **Health**:
  ```bash
  curl http://localhost:3001/health
  ```
- **Metrics**:
  ```bash
  curl http://localhost:3001/api/v1/stats
  ```

## 🔄 Maintenance
- **Updates**:
  ```bash
  cd backend && npm update
  cd frontend && npm update
  npm audit fix
  ```
- **Backup**:
  ```bash
  mongodump --uri="mongodb://localhost:27017/whois" --out=./backup/
  cp .env .env.backup
  git tag v1.2.5-beta-backup
  git push --tags
  ```

## 📞 Support
- **GitHub**: [Issues](https://github.com/hamzadenizyilmaz/Creart-Node.JS-Whois-Software/issues)
- **Email**: [hamza@creartcloud.com](mailto:hamza@creartcloud.com)

## 📄 License
[MIT License](LICENSE)

## 🙏 Acknowledgments
- WHOIS Protocol (ISC)
- Node.js, Next.js, Tailwind CSS, Framer Motion

---

**⭐ Star us on [GitHub](https://github.com/hamzadenizyilmaz/Creart-Node.JS-Whois-Software)!**

Join us to build the future of WHOIS lookups! 🚀
