import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      const data = snap.data();
      const trackingId = data?.gaTrackingId;

      if (trackingId && !window.gtag) {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', trackingId);
      }

      if (window.gtag && trackingId) {
        window.gtag('config', trackingId, {
          page_path: location.pathname + location.search,
        });
      }
    });

    return () => unsubscribe();
  }, [location]);

  return null;
};

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default GoogleAnalytics;
