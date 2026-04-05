# Visit Tracker UI

A standalone React microservice for displaying real-time website visit statistics, including total visit count and last visit timestamp in Indian Standard Time (IST).

## 🚀 Features

- **Real-time Visit Counter**: Displays the total number of website visits with animated counting
- **Last Visit Timestamp**: Shows the last visit time in IST with relative time display
- **Auto-refresh**: Configurable auto-refresh intervals (10s, 30s, 1min, 5min)
- **Manual Refresh**: Button to manually refresh statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean UI**: Modern gradient design with smooth animations
- **Error Handling**: Graceful error handling with fallback to dummy data during development

## 📁 Project Structure

```
visit-tracker-ui/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── VisitStats.jsx          # Main container component
│   │   ├── VisitStats.css
│   │   ├── VisitCounter.jsx        # Visit count display component
│   │   ├── VisitCounter.css
│   │   ├── LastVisitTime.jsx       # Last visit time display component
│   │   └── LastVisitTime.css
│   ├── services/
│   │   └── api.js                  # API service layer
│   ├── utils/
│   │   └── timeFormatter.js        # Time formatting utilities
│   ├── App.jsx                     # Root component
│   ├── App.css
│   ├── main.jsx                    # Entry point
│   └── index.css
├── .env                            # Environment variables (not in git)
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd visit-tracker-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   The production build will be in the `dist/` folder.

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔌 API Integration

The UI expects the following API endpoints:

### 1. Get Visit Statistics (Recommended)
```
GET /api/visits/stats
```

**Response:**
```json
{
  "count": 1234,
  "lastVisit": "2026-04-05T21:30:00.000Z"
}
```

### 2. Get Visit Count (Alternative)
```
GET /api/visits/count
```

**Response:**
```json
{
  "count": 1234
}
```

### 3. Get Last Visit Time (Alternative)
```
GET /api/visits/last
```

**Response:**
```json
{
  "timestamp": "2026-04-05T21:30:00.000Z"
}
```

### 4. Record Visit (Optional)
```
POST /api/visits
```

**Request Body:**
```json
{
  "timestamp": "2026-04-05T21:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Visit recorded"
}
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Base URL for the API (default: `http://localhost:3000/api`)

### Auto-refresh Intervals

The UI supports the following auto-refresh intervals:
- 10 seconds
- 30 seconds (default)
- 1 minute
- 5 minutes

Users can change the interval using the dropdown in the UI.

## 🎨 Customization

### Changing Colors

Edit the gradient colors in the CSS files:
- `src/components/VisitStats.css` - Main background gradient
- `src/components/VisitCounter.css` - Counter card gradient
- `src/components/LastVisitTime.css` - Time card gradient

### Modifying API Endpoints

Edit `src/services/api.js` to change API endpoint paths or add authentication headers.

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to Netlify

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## 🔗 Integration with Main Project

This microservice can be integrated with your main project in several ways:

### 1. Iframe Integration
Embed the UI in your main application using an iframe:
```html
<iframe 
  src="https://your-visit-tracker-url.com" 
  width="100%" 
  height="600px"
  frameborder="0"
></iframe>
```

### 2. Subdomain
Host the microservice on a subdomain:
- Main app: `https://example.com`
- Visit tracker: `https://stats.example.com`

### 3. Route-based Integration
If using a reverse proxy (nginx, Apache), route a specific path to this microservice:
- Main app: `https://example.com/*`
- Visit tracker: `https://example.com/stats/*`

### 4. Component Library
Export components as a package and import them into your main project:
```bash
npm install @your-org/visit-tracker-ui
```

### 5. Micro-frontend Architecture
Use Module Federation (Webpack 5) or similar to load this as a micro-frontend.

## 🧪 Development Mode

In development mode, the API service returns dummy data if the backend is not available:
- Visit count: 1234
- Last visit: Current timestamp

This allows you to develop and test the UI without a running backend.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend API has proper CORS headers:
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

### Environment Variables Not Loading
- Ensure `.env` file is in the root directory
- Restart the development server after changing `.env`
- Environment variables must start with `VITE_` prefix

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React + Vite
