// frontend/src/api/client.js

import { supabase } from '../lib/supabaseClient';
import { debugLog, decodeJwtStructure } from './debugLog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function request(path, options = {}) {
  // Body may already be a JSON string (some callers, e.g. auth.js, do
  // this themselves) or a plain object (groups.js's convention, which
  // assumes this function stringifies it). Handle both without
  // double-stringifying an already-stringified body.
  const { body, headers: optionHeaders, ...restOptions } = options;

  const serializedBody =
    body === undefined || body === null || typeof body === 'string'
      ? body
      : JSON.stringify(body);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = {
    'Content-Type': 'application/json',
    ...(optionHeaders || {}),
  };

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  debugLog(`--> ${options.method || 'GET'} ${path}`, {
    headers,
    body: body ?? null,
    jwt: session?.access_token ? decodeJwtStructure(session.access_token) : '(no session token)',
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    credentials: 'include',
    ...restOptions,
    ...(serializedBody !== undefined && { body: serializedBody }),
  });

  const data = await response.json().catch(() => null);

  debugLog(`<-- ${options.method || 'GET'} ${path} [${response.status}]`, data);

  /*
   * --------------------------------------------------
   * Authentication failure
   * --------------------------------------------------
   */
  if (response.status === 401) {
    const isAuthEndpoint =
      path.includes('/api/auth/login') ||
      path.includes('/api/auth/signup');

    if (!isAuthEndpoint) {
      if (import.meta.env.DEV) {
        console.warn(
          '[API Client] Authentication failed. Session may have expired:',
          path
        );
      }

      window.dispatchEvent(
        new CustomEvent('auth-expired')
      );
    }
  }

  /*
   * --------------------------------------------------
   * General API errors
   * --------------------------------------------------
   */
  if (!response.ok) {
    const error = new Error(
      data?.message ||
        data?.error ||
        'Something went wrong. Please try again.'
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}