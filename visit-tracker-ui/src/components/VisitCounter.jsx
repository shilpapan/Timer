import { useState, useEffect } from 'react';
import { formatNumber } from '../utils/timeFormatter';
import './VisitCounter.css';

/**
 * VisitCounter Component
 * Displays the total number of website visits
 */
const VisitCounter = ({ count, loading, error }) => {
  const [displayCount, setDisplayCount] = useState(0);

  // Animate counter on count change
  useEffect(() => {
    if (count > 0) {
      const duration = 1000; // Animation duration in ms
      const steps = 50;
      const increment = count / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= count) {
          setDisplayCount(count);
          clearInterval(timer);
        } else {
          setDisplayCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [count]);

  if (error) {
    return (
      <div className="visit-counter error">
        <div className="counter-icon">⚠️</div>
        <div className="counter-label">Error Loading Count</div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="visit-counter">
      <div className="counter-icon">👥</div>
      <div className="counter-value">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <span className="count-number">{formatNumber(displayCount)}</span>
        )}
      </div>
      <div className="counter-label">Total Visits</div>
    </div>
  );
};

export default VisitCounter;

// Made with Bob
