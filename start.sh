#!/usr/bin/env bash
set -e

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "======================================================"
echo "Starting Lnk Full-Stack Dev Environment"
echo "======================================================"

# Trap SIGINT/SIGTERM/EXIT to clean up child processes gracefully
cleanup() {
  echo ""
  echo "Shutting down backend and frontend servers..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}

trap cleanup EXIT INT TERM

# Start backend server
echo "[Backend] Starting API server on http://localhost:5000..."
(cd "$PROJECT_ROOT/backend" && npm run dev) &

# Start frontend dev server
echo "[Frontend] Starting SPA dev server on http://localhost:5173..."
(cd "$PROJECT_ROOT/frontend" && npm run dev) &

# Wait for process signals
wait
