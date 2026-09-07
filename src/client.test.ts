import { LinkMeClient } from './client';

describe('LinkMeClient public facade', () => {
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
