import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '../lib/analytics';

// Hook for automatic page view tracking
export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  
  useEffect(() => {
    // Only track if location actually changed
    if (location !== prevLocationRef.current) {
      // Get page title for better tracking
      const pageTitle = document.title;
      
      // Track the page view with enhanced data
      trackPageView(location, pageTitle);
      
      // Update the previous location reference
      prevLocationRef.current = location;
    }
  }, [location]);
  
  // Return current location for components that need it
  return location;
};