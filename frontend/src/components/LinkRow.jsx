import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

export function LinkRow({ link }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const formattedDate = link.createdAt
    ? new Date(link.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  return (
    <tr>
      <td>
        <a
          href={link.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="short-url-link"
        >
          <span>{link.shortUrl}</span>
          <ExternalLink size={14} style={{ opacity: 0.6 }} />
        </a>
      </td>
      <td>
        <span className="original-url-text" title={link.originalUrl}>
          {link.originalUrl}
        </span>
      </td>
      <td className="click-count-cell">{link.clickCount}</td>
      <td className="date-cell">{formattedDate}</td>
      <td className="actions-cell">
        <div className="actions-group">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              type="button"
              className="btn-secondary btn-icon"
              onClick={handleCopy}
              title="Copy short link"
              aria-label={`Copy short link ${link.shortUrl}`}
            >
              {copied ? <Check size={14} style={{ color: 'var(--success-text)' }} /> : <Copy size={14} />}
            </button>
            {copied && <div className="tooltip-box">Copied!</div>}
          </div>
        </div>
      </td>
    </tr>
  );
}
