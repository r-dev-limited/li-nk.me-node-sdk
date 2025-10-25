import { FetchHttpClient } from './http';

describe('FetchHttpClient', () => {
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
});
