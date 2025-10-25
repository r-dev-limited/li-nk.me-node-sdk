import { HttpClient } from './http.js';
import { CreateLinkInput, Link, UpdateLinkInput } from './models.js';
import { CreateLinkInputSchema, CreateLinkResponseSchema, ExtendedLinkSchema, LinkSchema, UpdateLinkInputSchema } from './schemas';

export class LinkService {
    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    async createLink(input: CreateLinkInput): Promise<{ id: string; app_id: string; domain_id: string | null; slug: string; slugUrl: string }> {
        const validated = CreateLinkInputSchema.parse(input);
        const body: any = {
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
        const res = await this.http.request<any>(`/api/apps/${encodeURIComponent(validated.appId)}/links`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return CreateLinkResponseSchema.parse(res);
    }

    async getLink(id: string): Promise<Link> {
        const res = await this.http.request<any>(`/api/links/${encodeURIComponent(id)}`);
        return LinkSchema.parse(res);
    }

    async listLinks(appId: string): Promise<Array<Link & { hostname?: string | null; idUrl?: string; slugUrl?: string; clicks?: number; installs?: number }>> {
        const res = await this.http.request<any>(`/api/apps/${encodeURIComponent(appId)}/links`);
        return ExtendedLinkSchema.array().parse(res);
    }

    async updateLink(id: string, updates: UpdateLinkInput): Promise<Link> {
        const validated = UpdateLinkInputSchema.parse(updates);
        const res = await this.http.request<any>(`/api/links/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            body: JSON.stringify(validated),
        });
        return LinkSchema.parse(res);
    }

    async deleteLink(id: string): Promise<void> {
        await this.http.delete(`/api/links/${encodeURIComponent(id)}`);
    }
} 