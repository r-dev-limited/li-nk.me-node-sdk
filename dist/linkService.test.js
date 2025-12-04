import { LinkService } from './linkService';
import { mock, instance, verify, deepEqual, when } from 'ts-mockito';
describe('LinkService', () => {
    it('createLink posts correct body and validates response', async () => {
        const httpMock = mock();
        when(httpMock.request('/api/apps/app_1/links', deepEqual({ method: 'POST', body: JSON.stringify({ id: 's', slug: 's', deepLink: '/d', redirects: { web: 'https://x' }, utm: { utm_source: 's' }, utmPresetId: undefined, allowParamPassthrough: undefined, customData: undefined, og_title: 't', og_description: undefined, og_image_url: undefined }) }))).thenResolve({ id: 's', app_id: 'app_1', domain_id: null, slug: 's', slugUrl: 'https://h/s' });
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.createLink({ appId: 'app_1', slug: 's', deepLink: '/d', redirects: { web: 'https://x' }, utm: { utm_source: 's' }, og: { title: 't' } });
        expect(res.slug).toBe('s');
        verify(httpMock.request('/api/apps/app_1/links', deepEqual({ method: 'POST', body: JSON.stringify({ id: 's', slug: 's', deepLink: '/d', redirects: { web: 'https://x' }, utm: { utm_source: 's' }, utmPresetId: undefined, allowParamPassthrough: undefined, customData: undefined, og_title: 't', og_description: undefined, og_image_url: undefined }) }))).once();
    });
    it('getLink validates response', async () => {
        const httpMock = mock();
        when(httpMock.request('/api/links/id')).thenResolve({ id: 'id', app_id: 'app', slug: 's', allow_param_passthrough: 0, force_redirect_web: 0, enabled: 1, click_count: 0 });
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.getLink('id');
        expect(res.id).toBe('id');
    });
    it('listLinks validates array response', async () => {
        const httpMock = mock();
        when(httpMock.request('/api/apps/app_2/links')).thenResolve([{ id: 'id', app_id: 'app', slug: 's', allow_param_passthrough: 0, force_redirect_web: 0, enabled: 1, click_count: 0 }]);
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.listLinks('app_2');
        expect(res[0].id).toBe('id');
        verify(httpMock.request('/api/apps/app_2/links')).once();
    });
    it('updateLink validates response', async () => {
        const httpMock = mock();
        when(httpMock.request('/api/links/id', deepEqual({ method: 'PATCH', body: JSON.stringify({ web_fallback_url: 'https://y' }) }))).thenResolve({ id: 'id', app_id: 'app', slug: 's', allow_param_passthrough: 0, force_redirect_web: 0, enabled: 1, click_count: 0 });
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.updateLink('id', { web_fallback_url: 'https://y' });
        expect(res.id).toBe('id');
        verify(httpMock.request('/api/links/id', deepEqual({ method: 'PATCH', body: JSON.stringify({ web_fallback_url: 'https://y' }) }))).once();
    });
    it('deleteLink delegates to http.delete', async () => {
        const httpMock = mock();
        const http = instance(httpMock);
        const svc = new LinkService(http);
        await svc.deleteLink('id');
        verify(httpMock.delete('/api/links/id')).once();
    });
});
//# sourceMappingURL=linkService.test.js.map