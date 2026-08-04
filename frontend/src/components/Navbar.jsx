import React from 'react';
import { Link2, Github } from 'lucide-react';

export function Navbar() {
  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <div className="navbar-top-inner">
          {/* Brand Logo & Name */}
          <a href="/" className="navbar-brand-link">
            <div className="navbar-logo">
              <Link2 size={16} />
            </div>
            <span className="navbar-brand-name">LinkPulse</span>
          </a>

          {/* GitHub Repository Link */}
          <div className="navbar-actions-group">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-action-icon-btn"
              aria-label="GitHub Repository"
              title="GitHub Repository"
            >
              <Github size={17} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
