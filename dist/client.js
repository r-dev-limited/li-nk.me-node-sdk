import { FetchHttpClient } from './http.js';
import { LinkService } from './linkService.js';
export class LinkMeClient {
    linkService;
    constructor(opts) {
        if (!opts?.baseUrl)
            throw new Error('baseUrl is required');
        const fetchImpl = opts.fetch || globalThis.fetch;
        if (!fetchImpl)
            throw new Error('fetch is not available; provide opts.fetch in Node <18');
        const http = new FetchHttpClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey, fetchImpl });
        this.linkService = new LinkService(http);
    }
    // --- Links ---
    async createLink(input) {
        return await this.linkService.createLink(input);
    }
    async getLink(id) {
        return await this.linkService.getLink(id);
    }
    async listLinks(appId) {
        return await this.linkService.listLinks(appId);
    }
    async updateLink(id, updates) {
        return await this.linkService.updateLink(id, updates);
    }
    async deleteLink(id) {
        return await this.linkService.deleteLink(id);
    }
}
export default LinkMeClient;
export * from './models.js';
//# sourceMappingURL=client.js.map