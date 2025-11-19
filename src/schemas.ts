/**
 * Zod schemas for Node SDK models and API contracts.
 *
 * These schemas validate inputs (client-side) and responses (server-side) at runtime
 * and provide typed inference for consumers.
 *
 * Useful links:
 * - SDKs overview: ../../sdks/README.md
 * - Node SDK README: ./README.md (package root)
 * - API overview: ../../docs/help/docs/api/overview.md
 */
import { z } from 'zod';

/**
 * Link entity as returned by the Edge API.
 */
export const LinkSchema = z.object({
    id: z.string(),
    app_id: z.string(),
    domain_id: z.string().nullable().optional(),
    slug: z.string(),
    deep_link_path: z.string().nullable().optional(),
    deep_link_params: z.string().nullable().optional(),
    ios_custom_url: z.string().nullable().optional(),
    android_custom_url: z.string().nullable().optional(),
    web_fallback_url: z.string().nullable().optional(),
    allow_param_passthrough: z.union([z.literal(0), z.literal(1)]),
    force_redirect_web: z.union([z.literal(0), z.literal(1)]),
    og_title: z.string().nullable().optional(),
    og_description: z.string().nullable().optional(),
    og_image_url: z.string().nullable().optional(),
    utm: z.string().nullable().optional(),
    utm_override: z.string().nullable().optional(),
    enabled: z.union([z.literal(0), z.literal(1)]),
    click_count: z.number(),
    last_click_at: z.string().nullable().optional(),
    created_at: z.string().optional(),
});

/**
 * Link with computed/extended fields used in list responses.
 */
export const ExtendedLinkSchema = LinkSchema.extend({
    hostname: z.string().nullable().optional(),
    idUrl: z.string().optional(),
    slugUrl: z.string().optional(),
    clicks: z.number().optional(),
    installs: z.number().optional(),
});

/**
 * Client input for creating a Link via the Node SDK.
 */
export const CreateLinkInputSchema = z.object({
    appId: z.string(),
    slug: z.string().optional(),
    deepLink: z.string().nullable().optional(),
    redirects: z.object({
        ios: z.string().nullable().optional(),
        android: z.string().nullable().optional(),
        web: z.string().nullable().optional(),
        forceWeb: z.boolean().optional(),
    }).optional(),
    utm: z.object({
        utm_source: z.string().optional(),
        utm_medium: z.string().optional(),
        utm_campaign: z.string().optional(),
        utm_term: z.string().optional(),
        utm_content: z.string().optional(),
        utm_id: z.string().optional(),
        utm_source_platform: z.string().optional(),
        utm_creative_format: z.string().optional(),
        utm_marketing_tactic: z.string().optional(),
        tags: z.string().optional(),
    }).partial().optional(),
    utmPresetId: z.string().optional(),
    utmOverrides: z.object({
        utm_source: z.boolean().optional(),
        utm_medium: z.boolean().optional(),
        utm_campaign: z.boolean().optional(),
        utm_term: z.boolean().optional(),
        utm_content: z.boolean().optional(),
        utm_id: z.boolean().optional(),
        utm_source_platform: z.boolean().optional(),
        utm_creative_format: z.boolean().optional(),
        utm_marketing_tactic: z.boolean().optional(),
        tags: z.boolean().optional(),
    }).partial().optional(),
    allowParamPassthrough: z.boolean().optional(),
    customData: z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()])).optional(),
    og: z.object({ title: z.string().optional(), description: z.string().optional(), imageUrl: z.string().optional() }).optional(),
});

/**
 * Partial update payload accepted by the Edge API for Link updates.
 */
export const UpdateLinkInputSchema = z.object({
    deep_link_path: z.string().nullable().optional(),
    ios_custom_url: z.string().nullable().optional(),
    android_custom_url: z.string().nullable().optional(),
    web_fallback_url: z.string().nullable().optional(),
    allow_param_passthrough: z.union([z.literal(0), z.literal(1)]).optional(),
    force_redirect_web: z.union([z.literal(0), z.literal(1)]).optional(),
    og_title: z.string().nullable().optional(),
    og_description: z.string().nullable().optional(),
    og_image_url: z.string().nullable().optional(),
    utm: z.string().nullable().optional(),
    utm_override: z.string().nullable().optional(),
    enabled: z.union([z.literal(0), z.literal(1)]).optional(),
}).partial();

/**
 * Response shape returned by Edge when a link is created.
 */
export const CreateLinkResponseSchema = z.object({
    id: z.string(),
    app_id: z.string(),
    domain_id: z.string().nullable(),
    slug: z.string(),
    slugUrl: z.string(),
});

export type LinkParsed = z.infer<typeof LinkSchema>;
export type ExtendedLinkParsed = z.infer<typeof ExtendedLinkSchema>;
export type CreateLinkInputParsed = z.infer<typeof CreateLinkInputSchema>;
export type UpdateLinkInputParsed = z.infer<typeof UpdateLinkInputSchema>;
export type CreateLinkResponseParsed = z.infer<typeof CreateLinkResponseSchema>;
