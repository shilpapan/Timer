/**
 * API Service for Visit Tracker
 * This service handles all API calls to fetch visit statistics
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Fetch the total visit count
 * @returns {Promise<number>} Total number of visits
 */
export const fetchVisitCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/visits/count`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching visit count:', error);
    // Return dummy data for development
    return 1234;
  }
};

/**
 * Fetch the last visit timestamp
 * @returns {Promise<string>} ISO timestamp of last visit
 */
export const fetchLastVisitTime = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/visits/last`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.timestamp || new Date().toISOString();
  } catch (error) {
    console.error('Error fetching last visit time:', error);
    // Return dummy data for development
    return new Date().toISOString();
  }
};

/**
 * Fetch all visit statistics in one call
 * @returns {Promise<{count: number, lastVisit: string}>}
 */
export const fetchVisitStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/visits/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      count: data.count || 0,
      lastVisit: data.lastVisit || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching visit stats:', error);
    // Return dummy data for development
    return {
      count: 1234,
      lastVisit: new Date().toISOString()
    };
  }
};

/**
 * Record a new visit (optional - if you want to track visits from this UI)
 * @returns {Promise<void>}
 */
export const recordVisit = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error recording visit:', error);
    throw error;
  }
};

// Made with Bob
