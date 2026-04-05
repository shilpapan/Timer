# Visit Tracker API Documentation

This document describes the API endpoints that the Visit Tracker UI expects from the backend service.

## Base URL

```
http://localhost:3000/api
```

Configure this in your `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Endpoints

### 1. Get Visit Statistics (Recommended)

Retrieve both visit count and last visit timestamp in a single request.

**Endpoint:** `GET /visits/stats`

**Response:**
```json
{
  "count": 1234,
  "lastVisit": "2026-04-05T21:30:00.000Z"
}
```

**Response Fields:**
- `count` (number): Total number of visits
- `lastVisit` (string): ISO 8601 timestamp of the last visit in UTC

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Server error

**Example Implementation (Node.js/Express):**
```javascript
app.get('/api/visits/stats', async (req, res) => {
  try {
    const count = await getVisitCount(); // Your database query
    const lastVisit = await getLastVisitTimestamp(); // Your database query
    
    res.json({
      count,
      lastVisit
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch visit statistics' });
  }
});
```

---

### 2. Get Visit Count

Retrieve only the total visit count.

**Endpoint:** `GET /visits/count`

**Response:**
```json
{
  "count": 1234
}
```

**Response Fields:**
- `count` (number): Total number of visits

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Server error

**Example Implementation (Node.js/Express):**
```javascript
app.get('/api/visits/count', async (req, res) => {
  try {
    const count = await getVisitCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch visit count' });
  }
});
```

---

### 3. Get Last Visit Time

Retrieve only the last visit timestamp.

**Endpoint:** `GET /visits/last`

**Response:**
```json
{
  "timestamp": "2026-04-05T21:30:00.000Z"
}
```

**Response Fields:**
- `timestamp` (string): ISO 8601 timestamp of the last visit in UTC

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Server error

**Example Implementation (Node.js/Express):**
```javascript
app.get('/api/visits/last', async (req, res) => {
  try {
    const timestamp = await getLastVisitTimestamp();
    res.json({ timestamp });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch last visit time' });
  }
});
```

---

### 4. Record Visit (Optional)

Record a new visit to the website.

**Endpoint:** `POST /visits`

**Request Body:**
```json
{
  "timestamp": "2026-04-05T21:30:00.000Z"
}
```

**Request Fields:**
- `timestamp` (string): ISO 8601 timestamp of the visit

**Response:**
```json
{
  "success": true,
  "message": "Visit recorded",
  "id": "visit_123456"
}
```

**Response Fields:**
- `success` (boolean): Whether the operation was successful
- `message` (string): Success message
- `id` (string, optional): ID of the recorded visit

**Status Codes:**
- `201 Created`: Visit recorded successfully
- `400 Bad Request`: Invalid request body
- `500 Internal Server Error`: Server error

**Example Implementation (Node.js/Express):**
```javascript
app.post('/api/visits', async (req, res) => {
  try {
    const { timestamp } = req.body;
    
    if (!timestamp) {
      return res.status(400).json({ error: 'Timestamp is required' });
    }
    
    const visitId = await recordVisit(timestamp);
    
    res.status(201).json({
      success: true,
      message: 'Visit recorded',
      id: visitId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record visit' });
  }
});
```

---

## CORS Configuration

The backend must allow requests from the frontend origin. Example CORS configuration:

**Express.js:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-production-url.com'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Nginx:**
```nginx
location /api {
    add_header 'Access-Control-Allow-Origin' 'http://localhost:5173' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    proxy_pass http://backend:3000;
}
```

---

## Database Schema Suggestions

### MongoDB Example:
```javascript
const visitSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  referrer: String
});

const Visit = mongoose.model('Visit', visitSchema);
```

### PostgreSQL Example:
```sql
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT
);

CREATE INDEX idx_visits_timestamp ON visits(timestamp DESC);
```

### MySQL Example:
```sql
CREATE TABLE visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    INDEX idx_timestamp (timestamp DESC)
);
```

---

## Sample Backend Implementation

### Complete Express.js Example:

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/visit-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Visit Schema
const visitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }
});

const Visit = mongoose.model('Visit', visitSchema);

// Routes
app.get('/api/visits/stats', async (req, res) => {
  try {
    const count = await Visit.countDocuments();
    const lastVisit = await Visit.findOne()
      .sort({ timestamp: -1 })
      .select('timestamp');
    
    res.json({
      count,
      lastVisit: lastVisit ? lastVisit.timestamp.toISOString() : null
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

app.get('/api/visits/count', async (req, res) => {
  try {
    const count = await Visit.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

app.get('/api/visits/last', async (req, res) => {
  try {
    const lastVisit = await Visit.findOne()
      .sort({ timestamp: -1 })
      .select('timestamp');
    
    res.json({
      timestamp: lastVisit ? lastVisit.timestamp.toISOString() : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch last visit' });
  }
});

app.post('/api/visits', async (req, res) => {
  try {
    const visit = new Visit({
      timestamp: req.body.timestamp || new Date()
    });
    
    await visit.save();
    
    res.status(201).json({
      success: true,
      message: 'Visit recorded',
      id: visit._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Testing the API

### Using cURL:

**Get Statistics:**
```bash
curl http://localhost:3000/api/visits/stats
```

**Get Count:**
```bash
curl http://localhost:3000/api/visits/count
```

**Get Last Visit:**
```bash
curl http://localhost:3000/api/visits/last
```

**Record Visit:**
```bash
curl -X POST http://localhost:3000/api/visits \
  -H "Content-Type: application/json" \
  -d '{"timestamp":"2026-04-05T21:30:00.000Z"}'
```

### Using Postman:

1. Create a new collection "Visit Tracker API"
2. Add requests for each endpoint
3. Set the base URL to `http://localhost:3000/api`
4. Test each endpoint

---

## Error Handling

All endpoints should return appropriate error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid request parameters"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

---

## Rate Limiting (Recommended)

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

---

## Authentication (Optional)

If you need to secure the API:

```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Apply to routes
app.get('/api/visits/stats', authenticateToken, async (req, res) => {
  // ... handler code
});
```

---

## Performance Optimization

### Caching:
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 30 }); // 30 seconds cache

app.get('/api/visits/stats', async (req, res) => {
  const cacheKey = 'visit-stats';
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return res.json(cachedData);
  }
  
  // Fetch from database
  const stats = await fetchStats();
  cache.set(cacheKey, stats);
  res.json(stats);
});
```

### Database Indexing:
Ensure proper indexes on timestamp fields for faster queries.

---

## Support

For questions or issues with the API implementation, please refer to the main README.md or open an issue on GitHub.