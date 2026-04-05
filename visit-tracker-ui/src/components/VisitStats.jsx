import { useState, useEffect } from 'react';
import { fetchVisitStats } from '../services/api';
import VisitCounter from './VisitCounter';
import LastVisitTime from './LastVisitTime';
import './VisitStats.css';

/**
 * VisitStats Component
 * Main container component that fetches and displays visit statistics
 */
const VisitStats = () => {
  const [stats, setStats] = useState({
    count: 0,
    lastVisit: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds default

  // Fetch visit statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchVisitStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch visit statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and set up auto-refresh
  useEffect(() => {
    fetchStats();

    // Set up auto-refresh interval
    const interval = setInterval(fetchStats, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchStats();
  };

  return (
    <div className="visit-stats-container">
      <header className="stats-header">
        <h1 className="stats-title">
          <span className="title-icon">📊</span>
          Visit Tracker Dashboard
        </h1>
        <p className="stats-subtitle">
          Real-time website visit statistics
        </p>
      </header>

      <div className="stats-controls">
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={loading}
        >
          <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>🔄</span>
          Refresh
        </button>
        
        <div className="refresh-interval">
          <label htmlFor="interval-select">Auto-refresh: </label>
          <select 
            id="interval-select"
            value={refreshInterval} 
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="interval-select"
          >
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <VisitCounter 
          count={stats.count} 
          loading={loading} 
          error={error}
        />
        <LastVisitTime 
          timestamp={stats.lastVisit} 
          loading={loading} 
          error={error}
        />
      </div>

      <footer className="stats-footer">
        <p>
          Last updated: {new Date().toLocaleTimeString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            hour12: true 
          })} IST
        </p>
      </footer>
    </div>
  );
};

export default VisitStats;

// Made with Bob
