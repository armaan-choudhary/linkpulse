import React from 'react';

export function EmptyState() {
  return (
    <div className="empty-table-state">
      <div className="empty-title">No links created yet.</div>
      <div className="empty-subtext">Paste a URL above to create your first shortened link.</div>
    </div>
  );
}
