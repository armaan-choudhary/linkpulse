import React, { useState, useEffect } from 'react';
import { Copy, Check, X } from 'lucide-react';

export function StatusMessage({ lastCreated, loadError }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (lastCreated) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastCreated]);

  if (loadError) {
    return (
      <div className="toast-container">
        <div className="toast-item error" role="alert">
          <span>{loadError}</span>
        </div>
      </div>
    );
  }

  if (!visible || !lastCreated) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lastCreated.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="toast-container">
      <div className="toast-item success" role="status" aria-live="polite">
        <div>
          <span>Short link created: </span>
          <a
            href={lastCreated.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', fontWeight: '600', textDecoration: 'underline' }}
          >
            {lastCreated.shortUrl}
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCopy}
            aria-label="Copy short URL"
            style={{ height: '28px', padding: '0 8px', fontSize: '12px' }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setVisible(false)}
            aria-label="Close notification"
            style={{ height: '28px', width: '28px', padding: 0 }}
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
