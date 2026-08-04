import React from 'react';
import { useLinks } from './hooks/useLinks';
import { Navbar } from './components/Navbar';
import { ShortenForm } from './components/ShortenForm';
import { StatusMessage } from './components/StatusMessage';
import { LinkTable } from './components/LinkTable';

export function App() {
  const {
    links,
    isLoading,
    loadError,
    isSubmitting,
    createError,
    lastCreated,
    addLink,
    refreshLinks
  } = useLinks();

  return (
    <>
      <Navbar />
      <main className="main-container">
        {/* Page Header */}
        <header className="page-header">
          <h1 className="page-title">URL Shortener</h1>
          <p className="page-description">Create and manage shortened links.</p>
        </header>

        {/* URL Input Form */}
        <section aria-label="Create Short Link">
          <ShortenForm
            onSubmit={addLink}
            isSubmitting={isSubmitting}
            serverError={createError}
          />
        </section>

        {/* Toast / Status Announcement */}
        <StatusMessage lastCreated={lastCreated} loadError={loadError} />

        {/* Data Table */}
        <section aria-label="Links">
          <LinkTable
            links={links}
            isLoading={isLoading}
            onRefresh={refreshLinks}
          />
        </section>
      </main>
    </>
  );
}

export default App;
