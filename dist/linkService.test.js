import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LinkService } from './linkService.js';
function createHttpMock() {
    const calls = [];
    const http = {
        request: async (path, init) => {
            calls.push({ kind: 'request', path, init });
            // @ts-ignore
            return { ok: true };
        },
        delete: async (path) => {
            calls.push({ kind: 'delete', path });
        }
    };
    return { http, calls };
}
describe('LinkService', () => {
    it('createLink posts correct body and path', async () => {
        const { http, calls } = createHttpMock();
        const svc = new LinkService(http);
        await svc.createLink({ appId: 'app_1', slug: 's', deepLink: '/d', redirects: { web: 'https://x' }, utm: { utm_source: 's' }, og: { title: 't' } });
        const c = calls[0];
        assert.equal(c.kind, 'request');
        assert.equal(c.path, '/api/apps/app_1/links');
        const body = JSON.parse(c.init.body);
        assert.equal(body.slug, 's');
        assert.equal(body.deepLink, '/d');
        assert.equal(body.redirects.web, 'https://x');
        assert.equal(body.og_title, 't');
    });
    it('getLink uses correct path', async () => {
        const { http, calls } = createHttpMock();
        const svc = new LinkService(http);
        await svc.getLink('id');
        assert.equal(calls[0].path, '/api/links/id');
    });
    it('listLinks uses correct path', async () => {
        const { http, calls } = createHttpMock();
        const svc = new LinkService(http);
        await svc.listLinks('app_2');
        assert.equal(calls[0].path, '/api/apps/app_2/links');
    });
    it('updateLink sends PATCH with body', async () => {
        const { http, calls } = createHttpMock();
        const svc = new LinkService(http);
        await svc.updateLink('id', { web_fallback_url: 'https://y' });
        const c = calls[0];
        assert.equal(c.init.method, 'PATCH');
        const body = JSON.parse(c.init.body);
        assert.equal(body.web_fallback_url, 'https://y');
    });
    it('deleteLink delegates to http.delete', async () => {
        const { http, calls } = createHttpMock();
        const svc = new LinkService(http);
        await svc.deleteLink('id');
        assert.equal(calls[0].kind, 'delete');
        assert.equal(calls[0].path, '/api/links/id');
    });
});
//# sourceMappingURL=linkService.test.js.map