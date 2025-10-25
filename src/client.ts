import { FetchHttpClient } from './http.js';
import { LinkService } from './linkService.js';
import { CreateLinkInput, Link, NodeSDKOptions, UpdateLinkInput } from './models.js';

export class LinkMeClient {
    private readonly linkService: LinkService;

    constructor(opts: NodeSDKOptions) {
        if (!opts?.baseUrl) throw new Error('baseUrl is required');
        const fetchImpl = opts.fetch || (globalThis as any).fetch;
        if (!fetchImpl) throw new Error('fetch is not available; provide opts.fetch in Node <18');
        const http = new FetchHttpClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey, fetchImpl });
        this.linkService = new LinkService(http);
    }

    async createLink(input: CreateLinkInput): Promise<{ id: string; app_id: string; domain_id: string | null; slug: string; slugUrl: string }> {
        return await this.linkService.createLink(input);
    }

    async getLink(id: string): Promise<Link> {
        return await this.linkService.getLink(id);
    }

    async listLinks(appId: string): Promise<Array<Link & { hostname?: string | null; idUrl?: string; slugUrl?: string; clicks?: number; installs?: number }>> {
        return await this.linkService.listLinks(appId);
    }

    async updateLink(id: string, updates: UpdateLinkInput): Promise<Link> {
        return await this.linkService.updateLink(id, updates);
    }

    async deleteLink(id: string): Promise<void> {
        return await this.linkService.deleteLink(id);
    }
}

export default LinkMeClient;
export * from './models.js'; 