/**
 * Utility functions for time formatting
 */

/**
 * Convert UTC timestamp to IST (Indian Standard Time)
 * @param {string} utcTimestamp - ISO timestamp string
 * @returns {string} Formatted date and time in IST
 */
export const formatToIST = (utcTimestamp) => {
  const date = new Date(utcTimestamp);
  
  // Format options for IST
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-IN', options).format(date);
};

/**
 * Get relative time string (e.g., "2 minutes ago")
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
};

/**
 * Format number with commas for better readability
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Made with Bob
