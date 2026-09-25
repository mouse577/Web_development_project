import { useState, useCallback } from "react";
import { backendUrl } from "../config";

/**
 * Custom hook for making POST requests to the backend.
 *
 * @template TResponse - The expected response type.
 * @param endpoint - The API endpoint. Do not include the base URL or leading slash.
 * @returns { data, error, loading, sendRequest }
 *          data - The expected TResponse or null.
 *          error - Any error encountered or null.
 *          loading - Whether the request is currently in progress.
 *          sendRequest - The function to trigger the request.
 */
const usePostRequest = <TResponse>(endpoint: string) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Sends a POST request with the given body.
   * 
   * @param body - The request payload (e.g., { email, password }).
   */
  const sendRequest = useCallback(
    async (body: Record<string, any>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${backendUrl}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        setData(responseData);
        return responseData;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { data, error, loading, sendRequest };
};

export default usePostRequest;
