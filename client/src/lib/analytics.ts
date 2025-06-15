// Google Analytics 4 Implementation
// Professional tracking system with proper page view and event handling

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let isInitialized = false;

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Google Analytics: VITE_GA_MEASUREMENT_ID non configurato');
    return;
  }

  if (isInitialized) {
    console.log('Google Analytics già inizializzato');
    return;
  }

  try {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Configure gtag with current timestamp
    window.gtag('js', new Date());
    
    // Configure Google Analytics with enhanced settings
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true,
      // Enhanced ecommerce and engagement tracking
      allow_enhanced_conversions: true,
      allow_google_signals: true,
      cookie_flags: 'secure;samesite=strict',
    });

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.onload = () => {
      console.log('Google Analytics caricato con successo');
      isInitialized = true;
    };
    script.onerror = () => {
      console.error('Errore nel caricamento di Google Analytics');
    };
    
    document.head.appendChild(script);

    console.log(`Google Analytics inizializzato: ${measurementId}`);
  } catch (error) {
    console.error('Errore nell\'inizializzazione di Google Analytics:', error);
  }
};

// Track page views with enhanced data
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics non disponibile per trackPageView');
    return;
  }
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  try {
    window.gtag('config', measurementId, {
      page_path: url,
      page_title: title || document.title,
      page_location: window.location.origin + url,
    });

    // Send page_view event with additional context
    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: window.location.origin + url,
      page_path: url,
    });

    console.log(`GA Page View: ${url}`);
  } catch (error) {
    console.error('Errore nel tracking page view:', error);
  }
};

// Track custom events with enhanced parameters
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number,
  customParameters?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics non disponibile per trackEvent');
    return;
  }
  
  try {
    const eventParameters: Record<string, any> = {
      event_category: category,
      event_label: label,
      value: value,
      ...customParameters
    };

    // Remove undefined values
    Object.keys(eventParameters).forEach(key => {
      if (eventParameters[key] === undefined) {
        delete eventParameters[key];
      }
    });

    window.gtag('event', action, eventParameters);
    console.log(`GA Event: ${action}`, eventParameters);
  } catch (error) {
    console.error('Errore nel tracking evento:', error);
  }
};

// Track business-specific events for WebPro Italia
export const trackBusinessEvent = {
  // Contact form interactions
  contactFormStart: () => trackEvent('contact_form_start', 'engagement', 'form_interaction'),
  contactFormSubmit: (businessType?: string) => trackEvent('contact_form_submit', 'conversion', 'form_completion', undefined, { business_type: businessType }),
  
  // Portfolio interactions
  portfolioView: (projectTitle?: string) => trackEvent('portfolio_view', 'engagement', 'project_view', undefined, { project: projectTitle }),
  portfolioClick: (projectTitle?: string, projectUrl?: string) => trackEvent('portfolio_click', 'engagement', 'external_link', undefined, { project: projectTitle, destination: projectUrl }),
  
  // Pricing interactions
  pricingView: (plan?: string) => trackEvent('pricing_view', 'engagement', 'plan_interest', undefined, { plan }),
  ctaClick: (location?: string, plan?: string) => trackEvent('cta_click', 'engagement', 'call_to_action', undefined, { location, plan }),
  
  // Communication channels
  phoneClick: () => trackEvent('phone_click', 'engagement', 'phone_call'),
  whatsappClick: () => trackEvent('whatsapp_click', 'engagement', 'whatsapp_chat'),
  emailClick: () => trackEvent('email_click', 'engagement', 'email_contact'),
  
  // Blog engagement
  blogPostView: (postTitle?: string) => trackEvent('blog_post_view', 'content', 'blog_read', undefined, { post_title: postTitle }),
  blogListView: () => trackEvent('blog_list_view', 'content', 'blog_browse'),
  
  // Navigation patterns
  menuClick: (section?: string) => trackEvent('menu_click', 'navigation', 'menu_interaction', undefined, { section }),
  scrollDepth: (percentage: number) => trackEvent('scroll', 'engagement', 'scroll_depth', percentage),
};

// Track scroll depth automatically
let maxScrollDepth = 0;
let scrollThresholds = [25, 50, 75, 90, 100];

export const initScrollTracking = () => {
  if (typeof window === 'undefined') return;

  const trackScrollDepth = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
      
      // Track at specific thresholds
      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && maxScrollDepth < threshold) {
          trackBusinessEvent.scrollDepth(threshold);
        }
      });
    }
  };

  // Throttled scroll listener
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScrollDepth, 100);
  });
};

// Utility to check if GA is properly loaded
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.gtag && isInitialized;
};