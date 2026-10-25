import { FetchHttpClient } from './http';

describe('FetchHttpClient', () => {
    afterEach(() => jest.useRealTimers());

    it('uses the 15-second default and aborts a fetch that ignores cancellation', async () => {
        jest.useFakeTimers();
        const fetchImpl = jest.fn(() => new Promise<Response>(() => {}));
        const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl });
        const request = client.request('/stalled');
        let finished = false;
        const result = expect(request.finally(() => { finished = true; })).rejects.toMatchObject({ name: 'TimeoutError' });
        await jest.advanceTimersByTimeAsync(14_999);
        expect(finished).toBe(false);
        await jest.advanceTimersByTimeAsync(1);
        await result;
        expect((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].signal?.aborted).toBe(true);
        expect(jest.getTimerCount()).toBe(0);
    });

    it('bounds success and error body reads for requests and deletion', async () => {
        jest.useFakeTimers();
        for (const [method, ok] of [['request', true], ['request', false], ['delete', false]] as const) {
            const fetchImpl = jest.fn(async () => ({ ok, status: ok ? 200 : 500, json: () => new Promise(() => {}) } as Response));
            const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl, requestTimeoutMs: 50 });
            const result = expect(client[method]('/slow-body')).rejects.toMatchObject({ name: 'TimeoutError' });
            await jest.advanceTimersByTimeAsync(50);
            await result;
            expect((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].signal?.aborted).toBe(true);
        }
        expect(jest.getTimerCount()).toBe(0);
    });

    it('honors cancellation and remains usable after cancelling pending requests', async () => {
        const fetchImpl = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>().mockImplementation(() => new Promise(() => {}));
        const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl });
        const result = expect(client.request('/pending')).rejects.toMatchObject({ name: 'AbortError' });
        await Promise.resolve();
        client.cancelPendingRequests();
        await result;
        expect(fetchImpl.mock.calls[0][1]?.signal?.aborted).toBe(true);
        fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify({ recovered: true })));
        await expect(client.request('/reconnect')).resolves.toEqual({ recovered: true });

        const host = new AbortController();
        const external = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl, signal: host.signal });
        const requestAbort = new AbortController();
        const aborted = expect(external.request('/external', { signal: requestAbort.signal })).rejects.toMatchObject({ name: 'AbortError' });
        await Promise.resolve();
        host.abort();
        await aborted;
        const calls = fetchImpl.mock.calls.length;
        await expect(external.delete('/already-aborted')).rejects.toMatchObject({ name: 'AbortError' });
        expect(fetchImpl).toHaveBeenCalledTimes(calls);
    });

    it('rejects invalid deadline overrides before performing HTTP', () => {
        for (const requestTimeoutMs of [0, -1, NaN, Infinity, 1.5, 2_147_483_648]) {
            expect(() => new FetchHttpClient({ baseUrl: 'https://api', fetchImpl: fetch, requestTimeoutMs })).toThrow(RangeError);
        }
    });

    it('does not cancel a new request started by an abort listener', async () => {
        let reconnect!: Promise<unknown>;
        const fetchImpl = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();
        const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl });
        fetchImpl.mockImplementationOnce(async (_url, init) => {
            init?.signal?.addEventListener('abort', () => { reconnect = client.request('/reconnect'); });
            return new Promise(() => {});
        }).mockResolvedValueOnce(new Response(JSON.stringify({ recovered: true })));
        const result = expect(client.request('/old')).rejects.toMatchObject({ name: 'AbortError' });
        await Promise.resolve();
        client.cancelPendingRequests();
        await result;
        await expect(reconnect).resolves.toEqual({ recovered: true });
        expect(fetchImpl.mock.calls[1][1]?.signal?.aborted).toBe(false);
    });
    it('adds authorization header when apiKey provided', async () => {
        let capturedHeaders: any;
        const spyFetch = (async (_url: string, init?: RequestInit) => {
            capturedHeaders = init?.headers;
            return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }) as any as typeof fetch;
        const client = new FetchHttpClient({ baseUrl: 'https://api', apiKey: 'key', fetchImpl: spyFetch });
        await client.request('/ping');
        expect((capturedHeaders as any)['Authorization']).toBe('Bearer key');
    });

    it('throws error with status and detail on non-ok', async () => {
        const fetchImpl = (async () => new Response(JSON.stringify({ error: 'bad' }), { status: 400, headers: { 'Content-Type': 'application/json' } })) as any as typeof fetch;
        const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl });
        await expect(client.request('/oops')).rejects.toMatchObject({ status: 400, detail: { error: 'bad' } });
    });

    it('delete treats 204 as success', async () => {
        const fetchImpl = (async () => new Response(undefined, { status: 204 })) as any as typeof fetch;
        const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl });
        await expect(client.delete('/x')).resolves.toBeUndefined();
    });

    it('delete reports non-success status and malformed error bodies', async () => {
        const fetchImpl = (async () => new Response('not-json', { status: 500 })) as any as typeof fetch;
        const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl });
        await expect(client.delete('/x')).rejects.toMatchObject({ status: 500 });
    });
});
