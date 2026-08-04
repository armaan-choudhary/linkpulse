import React from 'react';
import { RefreshCw } from 'lucide-react';
import { LinkRow } from './LinkRow';
import { EmptyState } from './EmptyState';
import { LoadingIndicator } from './LoadingIndicator';

export function LinkTable({ links, isLoading, onRefresh }) {
  return (
    <div className="table-container">
      <div className="table-header-bar">
        <span className="table-title">Links</span>
        <button
          type="button"
          className="btn-secondary"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh links list"
          title="Refresh list"
        >
          <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingIndicator />
      ) : links.length === 0 ? (
        <EmptyState />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Original URL</th>
              <th style={{ textAlign: 'center' }}>Clicks</th>
              <th>Created</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <LinkRow key={link.id} link={link} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
