const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw { code: 'TIMEOUT', message: 'Request timed out. Please check your connection and try again.' };
    }
    throw { code: 'NETWORK_ERROR', message: 'Unable to connect to server. Please ensure the backend API is running.' };
  }
}

export async function createShortLink(url) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = data.error || {};
      throw {
        status: res.status,
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'Failed to create short link',
        details: err.details || null
      };
    }

    return data;
  } catch (err) {
    if (err.status || err.code) throw err;
    throw { code: 'NETWORK_ERROR', message: err.message || 'Failed to create short link' };
  }
}

export async function fetchLinks() {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/links`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = data.error || {};
      throw {
        status: res.status,
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'Failed to fetch links'
      };
    }

    return data;
  } catch (err) {
    if (err.status || err.code) throw err;
    throw { code: 'NETWORK_ERROR', message: err.message || 'Failed to fetch links' };
  }
}
