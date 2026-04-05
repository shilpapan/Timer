import { useState, useEffect } from 'react';
import { formatToIST, getRelativeTime } from '../utils/timeFormatter';
import './LastVisitTime.css';

/**
 * LastVisitTime Component
 * Displays the timestamp of the last visit in IST with real-time updates
 */
const LastVisitTime = ({ timestamp, loading, error }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [relativeTime, setRelativeTime] = useState('');

  // Update current time every second for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update relative time when timestamp changes
  useEffect(() => {
    if (timestamp) {
      setRelativeTime(getRelativeTime(timestamp));
      
      // Update relative time every 10 seconds
      const timer = setInterval(() => {
        setRelativeTime(getRelativeTime(timestamp));
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [timestamp]);

  if (error) {
    return (
      <div className="last-visit-time error">
        <div className="time-icon">⚠️</div>
        <div className="time-label">Error Loading Time</div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="last-visit-time">
      <div className="time-icon">🕐</div>
      <div className="time-label">Last Visit</div>
      
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <div className="time-display">
            <div className="time-main">
              {timestamp ? formatToIST(timestamp) : 'No data available'}
            </div>
            {timestamp && (
              <div className="time-relative">
                {relativeTime}
              </div>
            )}
          </div>
          
          <div className="current-time">
            <div className="current-time-label">Current IST Time</div>
            <div className="current-time-value">
              {formatToIST(currentTime.toISOString())}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LastVisitTime;

// Made with Bob
