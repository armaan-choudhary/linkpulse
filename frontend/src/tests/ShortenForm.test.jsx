import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ShortenForm } from '../components/ShortenForm';

describe('ShortenForm', () => {
  it('renders input field and submit button', () => {
    render(<ShortenForm onSubmit={vi.fn()} isSubmitting={false} serverError={null} />);
    expect(screen.getByLabelText(/^URL$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shorten URL/i })).toBeInTheDocument();
  });

  it('displays client-side validation error for empty submission', async () => {
    render(<ShortenForm onSubmit={vi.fn()} isSubmitting={false} serverError={null} />);
    const submitBtn = screen.getByRole('button', { name: /Shorten URL/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter a URL to shorten/i)).toBeInTheDocument();
  });

  it('displays validation error for non-http(s) scheme', async () => {
    render(<ShortenForm onSubmit={vi.fn()} isSubmitting={false} serverError={null} />);
    const input = screen.getByLabelText(/^URL$/i);
    fireEvent.change(input, { target: { value: 'ftp://example.com' } });
    
    const submitBtn = screen.getByRole('button', { name: /Shorten URL/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/URL must begin with http:\/\/ or https:\/\//i)).toBeInTheDocument();
  });

  it('calls onSubmit callback with trimmed valid URL', () => {
    const mockSubmit = vi.fn();
    render(<ShortenForm onSubmit={mockSubmit} isSubmitting={false} serverError={null} />);
    const input = screen.getByLabelText(/^URL$/i);
    fireEvent.change(input, { target: { value: '  https://www.example.com  ' } });

    const submitBtn = screen.getByRole('button', { name: /Shorten URL/i });
    fireEvent.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledWith('https://www.example.com');
  });

  it('disables input and button when isSubmitting is true', () => {
    render(<ShortenForm onSubmit={vi.fn()} isSubmitting={true} serverError={null} />);
    expect(screen.getByLabelText(/^URL$/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Creating short link.../i })).toBeDisabled();
  });
});
