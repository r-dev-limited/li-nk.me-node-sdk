import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FetchHttpClient } from './http.js';
function createMockFetch(responses) {
    let callIndex = 0;
    const fn = async (_url, _init) => {
        const current = responses[Math.min(callIndex, responses.length - 1)];
        callIndex++;
        return new Response(current.body !== undefined ? JSON.stringify(current.body) : undefined, { status: current.status, headers: { 'Content-Type': 'application/json' } });
    };
    return fn;
}
describe('FetchHttpClient', () => {
    it('adds authorization header when apiKey provided', async () => {
        const fetchImpl = async (url, init) => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        const client = new FetchHttpClient({ baseUrl: 'https://api', apiKey: 'key', fetchImpl: fetchImpl });
        let capturedHeaders;
        const spyFetch = (async (url, init) => {
            capturedHeaders = init?.headers;
            return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        });
        const client2 = new FetchHttpClient({ baseUrl: 'https://api', apiKey: 'key', fetchImpl: spyFetch });
        await client2.request('/ping');
        assert.equal(capturedHeaders['Authorization'], 'Bearer key');
    });
    it('throws error with status and detail on non-ok', async () => {
        const fetchImpl = createMockFetch([{ status: 400, body: { error: 'bad' } }]);
        const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl });
        await assert.rejects(client.request('/oops'), (e) => e.status === 400 && e.detail?.error === 'bad');
    });
    it('delete treats 204 as success', async () => {
        const fetchImpl = createMockFetch([{ status: 204 }]);
        const client = new FetchHttpClient({ baseUrl: 'https://api', fetchImpl });
        await assert.doesNotReject(client.delete('/x'));
    });
});
//# sourceMappingURL=http.test.js.map