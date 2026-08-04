import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="loading-table-state" role="status" aria-live="polite">
      <Loader2 className="spinner" size={16} />
      <span>Loading links...</span>
    </div>
  );
}
