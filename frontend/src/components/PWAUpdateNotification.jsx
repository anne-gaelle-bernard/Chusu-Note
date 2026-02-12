import { useState, useEffect } from 'react';
import './PWAUpdateNotification.css';

function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              setWaitingWorker(newWorker);
              setShowUpdate(true);
            }
          });
        });
      });

      // Check for updates every hour
      setInterval(() => {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }, 60 * 60 * 1000);
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      waitingWorker.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="pwa-update-notification">
      <div className="pwa-update-content">
        <div className="pwa-update-icon">🔄</div>
        <div className="pwa-update-text">
          <h3>Mise à jour disponible</h3>
          <p>Une nouvelle version de l'application est prête</p>
        </div>
        <div className="pwa-update-buttons">
          <button onClick={handleUpdate} className="pwa-update-btn">
            Actualiser
          </button>
          <button onClick={handleDismiss} className="pwa-update-dismiss-btn">
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}

export default PWAUpdateNotification;
