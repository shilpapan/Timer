# Integration Guide: Visit Tracker UI with Main Project

This guide explains various ways to integrate the Visit Tracker UI microservice with your main project.

## Table of Contents

1. [Iframe Integration](#1-iframe-integration)
2. [Subdomain Deployment](#2-subdomain-deployment)
3. [Reverse Proxy Integration](#3-reverse-proxy-integration)
4. [Component Library](#4-component-library)
5. [Micro-frontend Architecture](#5-micro-frontend-architecture)
6. [API Gateway Pattern](#6-api-gateway-pattern)

---

## 1. Iframe Integration

The simplest way to integrate the Visit Tracker UI into your main application.

### Advantages
- Complete isolation
- No dependency conflicts
- Easy to implement
- Works with any framework

### Implementation

**In your main application:**

```html
<!-- Basic iframe -->
<iframe 
  src="https://stats.yourdomain.com" 
  width="100%" 
  height="600px"
  frameborder="0"
  title="Visit Statistics"
></iframe>
```

**With responsive design:**

```html
<div class="stats-container">
  <iframe 
    src="https://stats.yourdomain.com" 
    class="stats-iframe"
    title="Visit Statistics"
  ></iframe>
</div>

<style>
.stats-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.stats-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
```

**React Component:**

```jsx
import React from 'react';

const VisitStatsWidget = () => {
  return (
    <div className="stats-widget">
      <iframe
        src={process.env.REACT_APP_STATS_URL}
        width="100%"
        height="600px"
        frameBorder="0"
        title="Visit Statistics"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default VisitStatsWidget;
```

---

## 2. Subdomain Deployment

Deploy the Visit Tracker UI on a subdomain of your main domain.

### Setup

**DNS Configuration:**
```
A record: stats.yourdomain.com → Your server IP
```

**Nginx Configuration:**

```nginx
# Main application
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://main-app:3000;
    }
}

# Visit Tracker UI
server {
    listen 80;
    server_name stats.yourdomain.com;
    
    root /var/www/visit-tracker-ui/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Apache Configuration:**

```apache
# Main application
<VirtualHost *:80>
    ServerName yourdomain.com
    ProxyPass / http://main-app:3000/
    ProxyPassReverse / http://main-app:3000/
</VirtualHost>

# Visit Tracker UI
<VirtualHost *:80>
    ServerName stats.yourdomain.com
    DocumentRoot /var/www/visit-tracker-ui/dist
    
    <Directory /var/www/visit-tracker-ui/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # API proxy
    ProxyPass /api http://backend:3000/api
    ProxyPassReverse /api http://backend:3000/api
</VirtualHost>
```

---

## 3. Reverse Proxy Integration

Serve the Visit Tracker UI from a specific path on your main domain.

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Main application
    location / {
        proxy_pass http://main-app:3000;
    }
    
    # Visit Tracker UI
    location /stats {
        alias /var/www/visit-tracker-ui/dist;
        try_files $uri $uri/ /stats/index.html;
        
        # Handle SPA routing
        location ~ ^/stats/(.*)$ {
            try_files $uri $uri/ /stats/index.html;
        }
    }
    
    # API
    location /api {
        proxy_pass http://backend:3000;
    }
}
```

**Update Vite config for base path:**

```javascript
// vite.config.js
export default {
  base: '/stats/',
  // ... other config
}
```

**Rebuild the project:**
```bash
npm run build
```

---

## 4. Component Library

Package the Visit Tracker UI as an npm package and import it into your main project.

### Step 1: Prepare the Package

**package.json:**
```json
{
  "name": "@your-org/visit-tracker-ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "files": ["dist"],
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

**Create index.js for exports:**
```javascript
// src/index.js
export { default as VisitStats } from './components/VisitStats';
export { default as VisitCounter } from './components/VisitCounter';
export { default as LastVisitTime } from './components/LastVisitTime';
export * from './services/api';
export * from './utils/timeFormatter';
```

### Step 2: Build and Publish

```bash
# Build the library
npm run build

# Publish to npm
npm publish --access public
```

### Step 3: Use in Main Project

```bash
npm install @your-org/visit-tracker-ui
```

```jsx
import { VisitStats } from '@your-org/visit-tracker-ui';
import '@your-org/visit-tracker-ui/dist/style.css';

function App() {
  return (
    <div>
      <h1>My Main App</h1>
      <VisitStats />
    </div>
  );
}
```

---

## 5. Micro-frontend Architecture

Use Module Federation (Webpack 5) to load the Visit Tracker UI as a micro-frontend.

### Visit Tracker UI Configuration

**webpack.config.js:**
```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'visitTracker',
      filename: 'remoteEntry.js',
      exposes: {
        './VisitStats': './src/components/VisitStats',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

### Main Application Configuration

**webpack.config.js:**
```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'mainApp',
      remotes: {
        visitTracker: 'visitTracker@https://stats.yourdomain.com/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

**Usage in Main App:**
```jsx
import React, { lazy, Suspense } from 'react';

const VisitStats = lazy(() => import('visitTracker/VisitStats'));

function App() {
  return (
    <div>
      <h1>My Main App</h1>
      <Suspense fallback={<div>Loading stats...</div>}>
        <VisitStats />
      </Suspense>
    </div>
  );
}
```

---

## 6. API Gateway Pattern

Use an API gateway to route requests to both your main application and the Visit Tracker backend.

### Kong Gateway Configuration

```yaml
services:
  - name: main-app
    url: http://main-app:3000
    routes:
      - name: main-routes
        paths:
          - /

  - name: visit-tracker-api
    url: http://visit-tracker-backend:3000
    routes:
      - name: stats-api
        paths:
          - /api/visits
```

### AWS API Gateway

```yaml
# serverless.yml
service: api-gateway

provider:
  name: aws
  runtime: nodejs18.x

functions:
  mainApp:
    handler: handlers/main.handler
    events:
      - http:
          path: /
          method: ANY
          
  visitStats:
    handler: handlers/stats.handler
    events:
      - http:
          path: /api/visits/{proxy+}
          method: ANY
```

---

## Environment-Specific Configuration

### Development

```env
# Main App
REACT_APP_STATS_URL=http://localhost:5173

# Visit Tracker UI
VITE_API_BASE_URL=http://localhost:3000/api
```

### Staging

```env
# Main App
REACT_APP_STATS_URL=https://stats.staging.yourdomain.com

# Visit Tracker UI
VITE_API_BASE_URL=https://api.staging.yourdomain.com/visits
```

### Production

```env
# Main App
REACT_APP_STATS_URL=https://stats.yourdomain.com

# Visit Tracker UI
VITE_API_BASE_URL=https://api.yourdomain.com/visits
```

---

## Security Considerations

### 1. CORS Configuration

```javascript
// Backend
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://stats.yourdomain.com'
  ],
  credentials: true
}));
```

### 2. Content Security Policy

```html
<!-- In main app -->
<meta http-equiv="Content-Security-Policy" 
      content="frame-src https://stats.yourdomain.com;">
```

### 3. API Authentication

```javascript
// Add API key to requests
const response = await fetch(`${API_BASE_URL}/visits/stats`, {
  headers: {
    'Authorization': `Bearer ${process.env.VITE_API_KEY}`
  }
});
```

---

## Monitoring and Analytics

### Track Integration Performance

```javascript
// In main app
const trackStatsLoad = () => {
  const startTime = performance.now();
  
  window.addEventListener('message', (event) => {
    if (event.data.type === 'stats-loaded') {
      const loadTime = performance.now() - startTime;
      analytics.track('Stats Widget Load Time', { loadTime });
    }
  });
};
```

### Error Tracking

```javascript
// In Visit Tracker UI
window.addEventListener('error', (event) => {
  // Send to your error tracking service
  errorTracker.captureException(event.error);
});
```

---

## Testing Integration

### End-to-End Tests

```javascript
// Cypress test
describe('Visit Stats Integration', () => {
  it('should load stats widget', () => {
    cy.visit('/');
    cy.get('iframe[title="Visit Statistics"]')
      .should('be.visible')
      .its('0.contentDocument.body')
      .should('contain', 'Total Visits');
  });
});
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from frontend origin
2. **Iframe not loading**: Check Content Security Policy
3. **Styles not applying**: Verify CSS is included in build
4. **API calls failing**: Check network tab and API endpoint configuration

---

## Best Practices

1. **Version Control**: Tag releases and maintain changelog
2. **Documentation**: Keep API documentation up to date
3. **Testing**: Write integration tests
4. **Monitoring**: Set up alerts for errors and performance issues
5. **Caching**: Implement appropriate caching strategies
6. **Security**: Regular security audits and dependency updates

---

## Support

For integration issues, please:
1. Check this guide
2. Review API documentation
3. Open an issue on GitHub
4. Contact the development team

---

Last updated: April 2026