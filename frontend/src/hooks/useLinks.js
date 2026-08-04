import { useState, useEffect, useCallback } from 'react';
import { fetchLinks as apiFetchLinks, createShortLink as apiCreateShortLink } from '../api/linksApi';

export function useLinks() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [lastCreated, setLastCreated] = useState(null);

  const loadLinks = useCallback(async (retryCount = 0) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await apiFetchLinks();
      setLinks(response.data || []);
      setLoadError(null);
    } catch (err) {
      if (err.code === 'NETWORK_ERROR' && retryCount < 2) {
        // Auto retry after 1 second if backend is still starting up
        setTimeout(() => loadLinks(retryCount + 1), 1000);
        return;
      }
      setLoadError(err.message || 'Unable to load existing links');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const addLink = async (url) => {
    setIsSubmitting(true);
    setCreateError(null);
    setLastCreated(null);

    try {
      const response = await apiCreateShortLink(url);
      const newLink = response.data;
      setLinks((prev) => [newLink, ...prev]);
      setLastCreated(newLink);
      return { success: true, link: newLink };
    } catch (err) {
      setCreateError(err);
      return { success: false, error: err };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    links,
    isLoading,
    loadError,
    isSubmitting,
    createError,
    lastCreated,
    addLink,
    refreshLinks: () => loadLinks(0)
  };
}
