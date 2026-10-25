import { FetchHttpClient } from './http.js';
import { LinkService } from './linkService.js';
import { CreatedLink, CreateLinkInput, Link, ListedLink, NodeSDKOptions, UpdateLinkInput } from './models.js';

export class LinkMeClient {
    private readonly linkService: LinkService;
    private readonly http: FetchHttpClient;

    constructor(opts: NodeSDKOptions = {}) {
        const baseUrl = opts?.baseUrl || 'https://li-nk.me';
        const fetchImpl = opts.fetch || (globalThis as any).fetch;
        if (!fetchImpl) throw new Error('fetch is not available; provide opts.fetch in Node <18');
        const http = new FetchHttpClient({ baseUrl, apiKey: opts.apiKey, fetchImpl, requestTimeoutMs: opts.requestTimeoutMs, signal: opts.signal });
        this.http = http;
        this.linkService = new LinkService(http);
    }

    cancelPendingRequests(): void {
        this.http.cancelPendingRequests();
    }

    async createLink(input: CreateLinkInput): Promise<CreatedLink> {
        return await this.linkService.createLink(input);
    }

    async getLink(id: string): Promise<Link> {
        return await this.linkService.getLink(id);
    }

    async listLinks(appId: string): Promise<ListedLink[]> {
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
