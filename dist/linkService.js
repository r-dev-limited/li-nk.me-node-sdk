import { CreateLinkInputSchema, CreateLinkResponseSchema, ExtendedLinkSchema, LinkSchema, UpdateLinkInputSchema } from './schemas';
export class LinkService {
    http;
    constructor(http) {
        this.http = http;
    }
    async createLink(input) {
        const validated = CreateLinkInputSchema.parse(input);
        const body = {
            id: validated.slug,
            slug: validated.slug,
            deepLink: validated.deepLink ?? undefined,
            redirects: validated.redirects,
            utm: validated.utm,
            utmPresetId: validated.utmPresetId,
            allowParamPassthrough: validated.allowParamPassthrough,
            customData: validated.customData,
            og_title: validated.og?.title,
            og_description: validated.og?.description,
            og_image_url: validated.og?.imageUrl,
        };
        const res = await this.http.request(`/api/apps/${encodeURIComponent(validated.appId)}/links`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return CreateLinkResponseSchema.parse(res);
    }
    async getLink(id) {
        const res = await this.http.request(`/api/links/${encodeURIComponent(id)}`);
        return LinkSchema.parse(res);
    }
    async listLinks(appId) {
        const res = await this.http.request(`/api/apps/${encodeURIComponent(appId)}/links`);
        return ExtendedLinkSchema.array().parse(res);
    }
    async updateLink(id, updates) {
        const validated = UpdateLinkInputSchema.parse(updates);
        const res = await this.http.request(`/api/links/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            body: JSON.stringify(validated),
        });
        return LinkSchema.parse(res);
    }
    async deleteLink(id) {
        await this.http.delete(`/api/links/${encodeURIComponent(id)}`);
    }
}
//# sourceMappingURL=linkService.js.map