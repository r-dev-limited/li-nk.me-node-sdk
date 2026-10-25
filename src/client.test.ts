import { LinkMeClient } from './client';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

describe('LinkMeClient public facade', () => {
    it.each(['headers', 'body'])('aborts a real local HTTP request stalled at %s', async (phase) => {
        let received!: () => void;
        let disconnected!: () => void;
        const requestReceived = new Promise<void>(resolve => { received = resolve; });
        const connectionClosed = new Promise<void>(resolve => { disconnected = resolve; });
        const server = createServer((_req, res) => {
            res.once('close', disconnected);
            if (phase === 'body') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write('{"id":');
            }
            received();
        });
        await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
        try {
            const address = server.address() as AddressInfo;
            const client = new LinkMeClient({ baseUrl: `http://127.0.0.1:${address.port}`, requestTimeoutMs: 250 });
            const result = expect(client.getLink('stalled')).rejects.toMatchObject({ name: 'TimeoutError' });
            await requestReceived;
            await result;
            await connectionClosed;
        } finally {
            server.closeAllConnections();
            await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        }
    });
    it('exposes request deadlines, host abort and reusable pending cancellation', async () => {
        jest.useFakeTimers();
        try {
            const fetchImpl = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>().mockImplementation(() => new Promise(() => {}));
            const client = new LinkMeClient({ fetch: fetchImpl, requestTimeoutMs: 40 });
            const timedOut = expect(client.getLink('link-1')).rejects.toMatchObject({ name: 'TimeoutError' });
            await jest.advanceTimersByTimeAsync(40);
            await timedOut;
            expect(fetchImpl.mock.calls[0][1]?.signal?.aborted).toBe(true);
            const cancelled = expect(client.deleteLink('link-1')).rejects.toMatchObject({ name: 'AbortError' });
            await Promise.resolve();
            client.cancelPendingRequests();
            await cancelled;
            expect(fetchImpl.mock.calls[1][1]?.signal?.aborted).toBe(true);
            fetchImpl.mockResolvedValueOnce(new Response(null, { status: 204 }));
            await expect(client.deleteLink('link-1')).resolves.toBeUndefined();
            const host = new AbortController();
            host.abort();
            const external = new LinkMeClient({ fetch: fetchImpl, signal: host.signal });
            await expect(external.getLink('link-1')).rejects.toMatchObject({ name: 'AbortError' });
            expect(fetchImpl).toHaveBeenCalledTimes(3);
            expect(jest.getTimerCount()).toBe(0);
        } finally { jest.useRealTimers(); }
    });
    it('delegates CRUD calls to the validated LinkService', async () => {
        const fetchImpl = (async (url: string, init?: RequestInit) => {
            const path = new URL(url).pathname;
            if (init?.method === 'DELETE') return new Response(null, { status: 204 });
            if (path.endsWith('/links') && init?.method === 'POST') {
                return new Response(JSON.stringify({ id: 'link-1', app_id: 'app-1', domain_id: null, slug: 'hello', slugUrl: 'https://links.example/hello' }), { status: 200 });
            }
            if (path.endsWith('/links') && !init?.method) {
                return new Response(JSON.stringify([{
                    id: 'link-1', app_id: 'app-1', domain_id: null, slug: 'hello',
                    allow_param_passthrough: 0, force_redirect_web: 0, enabled: 1, click_count: 0,
                }]), { status: 200 });
            }
            return new Response(JSON.stringify({
                id: 'link-1', app_id: 'app-1', domain_id: null, slug: 'hello',
                allow_param_passthrough: 0, force_redirect_web: 0, enabled: 1, click_count: 0,
            }), { status: 200 });
        }) as any;
        const client = new LinkMeClient({ baseUrl: 'https://links.example/', apiKey: 'key', fetch: fetchImpl });
        await expect(client.createLink({ appId: 'app-1', slug: 'hello' })).resolves.toMatchObject({ id: 'link-1' });
        await expect(client.getLink('link-1')).resolves.toMatchObject({ slug: 'hello' });
        await expect(client.listLinks('app-1')).resolves.toHaveLength(1);
        await expect(client.updateLink('link-1', { enabled: 1 })).resolves.toMatchObject({ id: 'link-1' });
        await expect(client.deleteLink('link-1')).resolves.toBeUndefined();
    });
});
