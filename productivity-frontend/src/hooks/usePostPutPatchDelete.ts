import { useState, useCallback, useRef } from 'react';
import { backendUrl } from '../config';

/**
 * Custom hook for making POST, PUT, PATCH, or DELETE requests to the backend.
 *
 * @template TRequest - The type of the request body.
 * @template TResponse - The expected response type.
 * @param endpoint - The API endpoint. Do not include the base URL, leading slash, or
 *                   parameters. Correct endpoint example: "tasks"
 * @param method - The mutation request method to use.
 * @param customHeaders - Any additional headers beyond the default. Always uses
 *                        `{ 'Content-Type': 'application/json' }` unless a different
 *                        'Content-Type' is passed to override.
 * @returns { data, error, loading, sendRequest }
 *          data - The expected TResponse or null.
 *          error - Any error encountered or null.
 *          loading - Whether the request is currently in progress.
 *          sendRequest - The function to trigger the request.
 */
const usePostPutPatchDelete = <TRequest, TResponse>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  customHeaders: Record<string, string> = {},
) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  // Ref to persist across rerenders and avoid double requests, especially when using React's
  // StrictMode in development
  const isSubmitting = useRef(false);

  /**
   * Triggers the specified request to the backend. Does not return a value directly. The status
   * and results will be stored in data, error, and loading.
   *
   * @param body - The body to be sent in the request.
   */
  const sendRequest = useCallback(
    async (body: TRequest) => {
      if (isSubmitting.current) return;
      isSubmitting.current = true;

      setData(null);
      setLoading(true);
      setError(null);

      // Combine default headers with passed headers
      const defaultHeaders = { 'Content-Type': 'application/json' };
      const finalHeaders = {
        ...defaultHeaders,
        ...customHeaders, // Passed headers override default if same key
      };

      try {
        const response = await fetch(`${backendUrl}/${endpoint}`, {
          method: method,
          headers: finalHeaders,
          ...(body && { body: JSON.stringify(body) }), // No body for DELETE
        });
        const parsedBody = await response.json();
        if (response.ok) setData(parsedBody);
        else throw new Error(parsedBody.error);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('unknown error'));
      } finally {
        setLoading(false);
        isSubmitting.current = false;
      }
    },
    [endpoint, method, customHeaders],
  );

  return { data, error, loading, sendRequest };
};

export default usePostPutPatchDelete;
