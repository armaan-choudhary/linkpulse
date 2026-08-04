import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

export function ShortenForm({ onSubmit, isSubmitting, serverError }) {
  const [url, setUrl] = useState('');
  const [clientError, setClientError] = useState('');
  const [justCreated, setJustCreated] = useState(false);

  const validate = (value) => {
    if (!value.trim()) {
      return 'Please enter a URL to shorten';
    }
    const trimmed = value.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return 'URL must begin with http:// or https://';
    }
    try {
      new URL(trimmed);
    } catch {
      return 'Please enter a valid absolute URL';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validate(url);
    if (errorMsg) {
      setClientError(errorMsg);
      return;
    }

    setClientError('');
    const result = await onSubmit(url.trim());
    if (result && result.success) {
      setUrl('');
      setJustCreated(true);
      setTimeout(() => setJustCreated(false), 1500);
    }
  };

  const displayError = clientError || (serverError ? serverError.message : '');

  return (
    <div className="section-box">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="url-input" className="section-label">
          URL
        </label>
        <div className="form-row">
          <div className="input-container">
            <input
              id="url-input"
              type="url"
              className={`text-input ${displayError ? 'has-error' : ''}`}
              placeholder="https://example.com/my-long-link-destination"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (clientError) setClientError('');
              }}
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={!!displayError}
              aria-describedby={displayError ? 'url-input-error' : undefined}
            />
            {displayError && (
              <div id="url-input-error" className="input-error-message" role="alert">
                {displayError}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || justCreated}
            aria-label={
              isSubmitting
                ? 'Creating short link...'
                : justCreated
                ? 'Link created'
                : 'Shorten URL'
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="spinner" size={14} />
                <span>Creating...</span>
              </>
            ) : justCreated ? (
              <>
                <Check size={14} />
                <span>Created</span>
              </>
            ) : (
              <span>Shorten URL</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
