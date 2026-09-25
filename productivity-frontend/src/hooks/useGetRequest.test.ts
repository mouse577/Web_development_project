import { renderHook } from '@testing-library/react';
import useGetRequest from './useGetRequest';
import { backendUrl } from '../config';
import { act } from 'react';

describe('useGetRequest', () => {
  beforeEach(() => (globalThis.fetch = vi.fn()));

  afterEach(() => vi.resetAllMocks());

  afterAll(() => vi.restoreAllMocks());

  it('should set the initial return values correctly', () => {
    const { result } = renderHook(() => useGetRequest<Record<string, string>>('dummy-endpoint'));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toEqual(false);
  });

  it('should call fetch with the correct arguments', async () => {
    const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>;
    const { result } = renderHook(() => useGetRequest<Record<string, string>>('dummy-endpoint'));
    await act(async () => result.current.sendRequest({ parameter: 'dummy-parameter' }));
    expect(mockFetch).toHaveBeenCalledExactlyOnceWith(
      `${backendUrl}/dummy-endpoint?parameter=dummy-parameter`,
      { method: 'GET' },
    );
  });

  it('should correctly handle a successful response', async () => {
    const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'success!' }) });
    const { result } = renderHook(() => useGetRequest<{ message: string }>('dummy-endpoint'));
    await act(async () => result.current.sendRequest({ parameter: 'dummy-parameter' }));
    expect(result.current.loading).toEqual(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({ message: 'success!' });
  });

  it('should correctly handle an error response', async () => {
    const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad Request'),
    });
    const { result } = renderHook(() => useGetRequest<{ message: string }>('dummy-endpoint'));
    await act(async () => result.current.sendRequest({ parameter: 'dummy-parameter' }));
    expect(result.current.loading).toEqual(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error?.message).toEqual('HTTP 400: Bad Request');
  });
});
