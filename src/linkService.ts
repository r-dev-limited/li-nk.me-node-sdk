import { HttpClient } from './http.js';
import { CreatedLink, CreateLinkInput, Link, ListedLink, UpdateLinkInput } from './models.js';
import { CreateLinkInputSchema, CreateLinkResponseSchema, ExtendedLinkSchema, LinkSchema, UpdateLinkInputSchema } from './schemas.js';

export class LinkService {
    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    async createLink(input: CreateLinkInput): Promise<CreatedLink> {
        const validated = CreateLinkInputSchema.parse(input);
        const body: any = {
            surface_id: validated.surfaceId,
            domain_id: validated.domainId,
            expires_at: validated.expiresAt,
            one_time_use: validated.oneTimeUse,
            slug: validated.slug,
            deepLink: validated.deepLink ?? undefined,
            redirects: validated.redirects,
            utm: validated.utm,
            utmPresetId: validated.utmPresetId,
            utmOverrides: validated.utmOverrides,
            allowParamPassthrough: validated.allowParamPassthrough,
            // New SDK default: hidden from portal unless explicitly opted in.
            displayInPortal: validated.displayInPortal ?? false,
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

    async listLinks(appId: string): Promise<ListedLink[]> {
        if (appId == null || String(appId).trim() === '') {
            throw new Error('appId is required');
        }
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
