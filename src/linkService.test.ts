import { LinkService } from './linkService';
import type { HttpClient } from './http';
import { mock, instance, verify, deepEqual, when } from 'ts-mockito';

describe('LinkService', () => {
    it('forwards surface/domain/lifecycle options and retains scoped response metadata', async () => {
        const request = jest.fn().mockResolvedValue({ id: 'new', app_id: 'app_1', domain_id: 'domain-1', environment_id: 'prod', surface_id: 'customer', expires_at: '2030-01-01T00:00:00Z', one_time_use: 1, slug: 'new', slugUrl: 'https://h/customer/i/new' });
        const service = new LinkService({ request } as unknown as HttpClient);
        const result = await service.createLink({ appId: 'app_1', surfaceId: 'customer', domainId: 'domain-1', expiresAt: '2030-01-01T00:00:00Z', oneTimeUse: true, redirects: { desktopMode: 'hosted' } });
        expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({ surface_id: 'customer', domain_id: 'domain-1', expires_at: '2030-01-01T00:00:00Z', one_time_use: true, redirects: { desktopMode: 'hosted' } });
        expect(result).toMatchObject({ environment_id: 'prod', surface_id: 'customer', expires_at: '2030-01-01T00:00:00Z', one_time_use: 1 });
    });

    it('rejects unsupported creation options before making a request', async () => {
        const request = jest.fn();
        const service = new LinkService({ request } as unknown as HttpClient);
        await expect(service.createLink({ appId: 'app_1', surface_id: 'misspelled' } as any)).rejects.toThrow();
        expect(request).not.toHaveBeenCalled();
    });

    it('retains environment, surface and lifecycle metadata when reading a link', async () => {
        const request = jest.fn().mockResolvedValue({ id: 'id', app_id: 'app', slug: 's', allow_param_passthrough: 1, force_redirect_web: 0, enabled: 1, click_count: 0, environment_id: 'prod', surface_id: 'customer', path_prefix: '/customer', expires_at: '2030-01-01T00:00:00Z', one_time_use: 1, consumed_at: null });
        const result = await new LinkService({ request } as unknown as HttpClient).getLink('id');
        expect(result).toMatchObject({ environment_id: 'prod', surface_id: 'customer', path_prefix: '/customer', expires_at: '2030-01-01T00:00:00Z', one_time_use: 1, consumed_at: null });
    });
    it('forwards UTM override flags to the Edge API', async () => {
        const requests: Array<{ path: string; init?: RequestInit }> = [];
        const http: HttpClient = {
            request: async (path, init) => {
                requests.push({ path, init });
                return { id: 's', app_id: 'app_1', domain_id: null, slug: 's', slugUrl: 'https://h/s' } as any;
            },
            delete: async () => undefined,
        } as HttpClient;
        await new LinkService(http).createLink({ appId: 'app_1', slug: 's', utmOverrides: { utm_source: false } });
        expect(JSON.parse(requests[0].init?.body as string).utmOverrides).toEqual({ utm_source: false });
    });

    it('createLink posts correct body and validates response', async () => {
        const httpMock = mock<HttpClient>();
        when(httpMock.request<any>('/api/apps/app_1/links', deepEqual({ method: 'POST', body: JSON.stringify({ slug: 's', deepLink: '/d', redirects: { web: 'https://x' }, utm: { utm_source: 's' }, utmPresetId: undefined, utmOverrides: undefined, allowParamPassthrough: undefined, displayInPortal: false, customData: undefined, og_title: 't', og_description: undefined, og_image_url: undefined }) } as any))).thenResolve({ id: 's', app_id: 'app_1', domain_id: null, slug: 's', slugUrl: 'https://h/s' } as any);
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.createLink({ appId: 'app_1', slug: 's', deepLink: '/d', redirects: { web: 'https://x' }, utm: { utm_source: 's' }, og: { title: 't' } } as any);
        expect(res.slug).toBe('s');
        verify(httpMock.request('/api/apps/app_1/links', deepEqual({ method: 'POST', body: JSON.stringify({ slug: 's', deepLink: '/d', redirects: { web: 'https://x' }, utm: { utm_source: 's' }, utmPresetId: undefined, utmOverrides: undefined, allowParamPassthrough: undefined, displayInPortal: false, customData: undefined, og_title: 't', og_description: undefined, og_image_url: undefined }) } as any))).once();
    });

    it('createLink respects explicit displayInPortal override', async () => {
        const httpMock = mock<HttpClient>();
        when(httpMock.request<any>('/api/apps/app_1/links', deepEqual({ method: 'POST', body: JSON.stringify({ slug: 'visible', deepLink: undefined, redirects: undefined, utm: undefined, utmPresetId: undefined, utmOverrides: undefined, allowParamPassthrough: undefined, displayInPortal: true, customData: undefined, og_title: undefined, og_description: undefined, og_image_url: undefined }) } as any))).thenResolve({ id: 'visible', app_id: 'app_1', domain_id: null, slug: 'visible', slugUrl: 'https://h/visible' } as any);
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.createLink({ appId: 'app_1', slug: 'visible', displayInPortal: true } as any);
        expect(res.slug).toBe('visible');
        verify(httpMock.request('/api/apps/app_1/links', deepEqual({ method: 'POST', body: JSON.stringify({ slug: 'visible', deepLink: undefined, redirects: undefined, utm: undefined, utmPresetId: undefined, utmOverrides: undefined, allowParamPassthrough: undefined, displayInPortal: true, customData: undefined, og_title: undefined, og_description: undefined, og_image_url: undefined }) } as any))).once();
    });

    it('getLink validates response', async () => {
        const httpMock = mock<HttpClient>();
        when(httpMock.request<any>('/api/links/id')).thenResolve({ id: 'id', app_id: 'app', slug: 's', allow_param_passthrough: 0, force_redirect_web: 0, enabled: 1, click_count: 0 } as any);
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.getLink('id');
        expect(res.id).toBe('id');
    });

    it('listLinks validates array response', async () => {
        const httpMock = mock<HttpClient>();
        when(httpMock.request<any>('/api/apps/app_2/links')).thenResolve([{ id: 'id', app_id: 'app', slug: 's', allow_param_passthrough: 0, force_redirect_web: 0, enabled: 1, click_count: 0 }] as any);
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.listLinks('app_2');
        expect(res[0].id).toBe('id');
        verify(httpMock.request('/api/apps/app_2/links')).once();
    });

    it('rejects an empty app ID before making a request', async () => {
        const httpMock = mock<HttpClient>();
        const svc = new LinkService(instance(httpMock));
        await expect(svc.listLinks('   ')).rejects.toThrow('appId is required');
    });

    it('updateLink validates response', async () => {
        const httpMock = mock<HttpClient>();
        when(httpMock.request<any>('/api/links/id', deepEqual({ method: 'PATCH', body: JSON.stringify({ web_fallback_url: 'https://y' }) } as any))).thenResolve({ id: 'id', app_id: 'app', slug: 's', allow_param_passthrough: 0, force_redirect_web: 0, enabled: 1, click_count: 0 } as any);
        const http = instance(httpMock);
        const svc = new LinkService(http);
        const res = await svc.updateLink('id', { web_fallback_url: 'https://y' });
        expect(res.id).toBe('id');
        verify(httpMock.request('/api/links/id', deepEqual({ method: 'PATCH', body: JSON.stringify({ web_fallback_url: 'https://y' }) } as any))).once();
    });

    it('deleteLink delegates to http.delete', async () => {
        const httpMock = mock<HttpClient>();
        const http = instance(httpMock);
        const svc = new LinkService(http);
        await svc.deleteLink('id');
        verify(httpMock.delete('/api/links/id')).once();
    });
}); 
