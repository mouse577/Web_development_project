import { useState, useCallback } from 'react';
import { backendUrl } from '../config';
import AuthService from '../utils/Auth';

/**
 * Custom hook for making GET requests to the backend with query parameters.
 *
 * @template TResponse - The expected response type.
 * @param endpoint - The API endpoint. Do not include the base URL or, leading slash, or
 *                   parameters. Correct endpoint example: "tasks"
 * @returns { data, error, loading, sendRequest }
 *          data - The expected TResponse or null.
 *          error - Any error encountered or null.
 *          loading - Whether the request is currently in progress.
 *          sendRequest - The function to trigger the request.
 */
const useGetRequest = <TResponse>(endpoint: string, auth?: boolean) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Sends a GET request using the specified query parameters.
   *
   * @param queryParams - An object representing the query parameters.
   */
  const sendRequest = useCallback(
    async (queryParams: Record<string, string>) => {
      setLoading(true);
      setError(null);

      // Don't need to send 'Content-Type' since there is no body.
      // DO need to send 'Authorization' for protected endpoints.
      let header = undefined;
      if (auth) header = { Authorization: 'Bearer ' + AuthService.getToken() };

      // Don't append the question mark if there are no query params
      let fullUrl;
      if (Object.keys(queryParams).length === 0) {
        fullUrl = `${backendUrl}/${endpoint}`;
      } else {
        const queryString = new URLSearchParams(queryParams).toString();
        fullUrl = `${backendUrl}/${endpoint}?${queryString}`;
      }

      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          ...(header && { headers: header }), // Only add the header if necessary (for auth)
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    },
    [endpoint, auth],
  );

  return { data, error, loading, sendRequest };
};

export default useGetRequest;
