export class LinkService {
    http;
    constructor(http) {
        this.http = http;
    }
    async createLink(input) {
        const body = {
            id: input.slug,
            slug: input.slug,
            deepLink: input.deepLink ?? undefined,
            redirects: input.redirects,
            utm: input.utm,
            utmPresetId: input.utmPresetId,
            allowParamPassthrough: input.allowParamPassthrough,
            customData: input.customData,
            og_title: input.og?.title,
            og_description: input.og?.description,
            og_image_url: input.og?.imageUrl,
        };
        return await this.http.request(`/api/apps/${encodeURIComponent(input.appId)}/links`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }
    async getLink(id) {
        return await this.http.request(`/api/links/${encodeURIComponent(id)}`);
    }
    async listLinks(appId) {
        return await this.http.request(`/api/apps/${encodeURIComponent(appId)}/links`);
    }
    async updateLink(id, updates) {
        return await this.http.request(`/api/links/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }
    async deleteLink(id) {
        await this.http.delete(`/api/links/${encodeURIComponent(id)}`);
    }
}
//# sourceMappingURL=linkService.js.map