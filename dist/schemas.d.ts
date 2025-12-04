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
export declare const LinkSchema: z.ZodObject<{
    id: z.ZodString;
    app_id: z.ZodString;
    domain_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    slug: z.ZodString;
    deep_link_path: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    deep_link_params: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ios_custom_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    android_custom_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    web_fallback_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    allow_param_passthrough: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>;
    force_redirect_web: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>;
    og_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    og_description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    og_image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    utm: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    utm_override: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enabled: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>;
    click_count: z.ZodNumber;
    last_click_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    allow_param_passthrough: 0 | 1;
    force_redirect_web: 0 | 1;
    enabled: 0 | 1;
    id: string;
    app_id: string;
    slug: string;
    click_count: number;
    deep_link_path?: string | null | undefined;
    ios_custom_url?: string | null | undefined;
    android_custom_url?: string | null | undefined;
    web_fallback_url?: string | null | undefined;
    og_title?: string | null | undefined;
    og_description?: string | null | undefined;
    og_image_url?: string | null | undefined;
    utm?: string | null | undefined;
    utm_override?: string | null | undefined;
    domain_id?: string | null | undefined;
    deep_link_params?: string | null | undefined;
    last_click_at?: string | null | undefined;
    created_at?: string | undefined;
}, {
    allow_param_passthrough: 0 | 1;
    force_redirect_web: 0 | 1;
    enabled: 0 | 1;
    id: string;
    app_id: string;
    slug: string;
    click_count: number;
    deep_link_path?: string | null | undefined;
    ios_custom_url?: string | null | undefined;
    android_custom_url?: string | null | undefined;
    web_fallback_url?: string | null | undefined;
    og_title?: string | null | undefined;
    og_description?: string | null | undefined;
    og_image_url?: string | null | undefined;
    utm?: string | null | undefined;
    utm_override?: string | null | undefined;
    domain_id?: string | null | undefined;
    deep_link_params?: string | null | undefined;
    last_click_at?: string | null | undefined;
    created_at?: string | undefined;
}>;
/**
 * Link with computed/extended fields used in list responses.
 */
export declare const ExtendedLinkSchema: z.ZodObject<{
    id: z.ZodString;
    app_id: z.ZodString;
    domain_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    slug: z.ZodString;
    deep_link_path: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    deep_link_params: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ios_custom_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    android_custom_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    web_fallback_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    allow_param_passthrough: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>;
    force_redirect_web: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>;
    og_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    og_description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    og_image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    utm: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    utm_override: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enabled: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>;
    click_count: z.ZodNumber;
    last_click_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
} & {
    hostname: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    idUrl: z.ZodOptional<z.ZodString>;
    slugUrl: z.ZodOptional<z.ZodString>;
    clicks: z.ZodOptional<z.ZodNumber>;
    installs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    allow_param_passthrough: 0 | 1;
    force_redirect_web: 0 | 1;
    enabled: 0 | 1;
    id: string;
    app_id: string;
    slug: string;
    click_count: number;
    deep_link_path?: string | null | undefined;
    ios_custom_url?: string | null | undefined;
    android_custom_url?: string | null | undefined;
    web_fallback_url?: string | null | undefined;
    og_title?: string | null | undefined;
    og_description?: string | null | undefined;
    og_image_url?: string | null | undefined;
    utm?: string | null | undefined;
    utm_override?: string | null | undefined;
    domain_id?: string | null | undefined;
    deep_link_params?: string | null | undefined;
    last_click_at?: string | null | undefined;
    created_at?: string | undefined;
    hostname?: string | null | undefined;
    idUrl?: string | undefined;
    slugUrl?: string | undefined;
    clicks?: number | undefined;
    installs?: number | undefined;
}, {
    allow_param_passthrough: 0 | 1;
    force_redirect_web: 0 | 1;
    enabled: 0 | 1;
    id: string;
    app_id: string;
    slug: string;
    click_count: number;
    deep_link_path?: string | null | undefined;
    ios_custom_url?: string | null | undefined;
    android_custom_url?: string | null | undefined;
    web_fallback_url?: string | null | undefined;
    og_title?: string | null | undefined;
    og_description?: string | null | undefined;
    og_image_url?: string | null | undefined;
    utm?: string | null | undefined;
    utm_override?: string | null | undefined;
    domain_id?: string | null | undefined;
    deep_link_params?: string | null | undefined;
    last_click_at?: string | null | undefined;
    created_at?: string | undefined;
    hostname?: string | null | undefined;
    idUrl?: string | undefined;
    slugUrl?: string | undefined;
    clicks?: number | undefined;
    installs?: number | undefined;
}>;
/**
 * Client input for creating a Link via the Node SDK.
 */
export declare const CreateLinkInputSchema: z.ZodObject<{
    appId: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    deepLink: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    redirects: z.ZodOptional<z.ZodObject<{
        ios: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        android: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        web: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        forceWeb: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        ios?: string | null | undefined;
        android?: string | null | undefined;
        web?: string | null | undefined;
        forceWeb?: boolean | undefined;
    }, {
        ios?: string | null | undefined;
        android?: string | null | undefined;
        web?: string | null | undefined;
        forceWeb?: boolean | undefined;
    }>>;
    utm: z.ZodOptional<z.ZodObject<{
        utm_source: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        utm_medium: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        utm_campaign: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        utm_term: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        utm_content: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        utm_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        utm_source_platform: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        utm_creative_format: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        utm_marketing_tactic: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        tags: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_term?: string | undefined;
        utm_content?: string | undefined;
        utm_id?: string | undefined;
        utm_source_platform?: string | undefined;
        utm_creative_format?: string | undefined;
        utm_marketing_tactic?: string | undefined;
        tags?: string | undefined;
    }, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_term?: string | undefined;
        utm_content?: string | undefined;
        utm_id?: string | undefined;
        utm_source_platform?: string | undefined;
        utm_creative_format?: string | undefined;
        utm_marketing_tactic?: string | undefined;
        tags?: string | undefined;
    }>>;
    utmPresetId: z.ZodOptional<z.ZodString>;
    utmOverrides: z.ZodOptional<z.ZodObject<{
        utm_source: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        utm_medium: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        utm_campaign: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        utm_term: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        utm_content: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        utm_id: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        utm_source_platform: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        utm_creative_format: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        utm_marketing_tactic: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        tags: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        utm_source?: boolean | undefined;
        utm_medium?: boolean | undefined;
        utm_campaign?: boolean | undefined;
        utm_term?: boolean | undefined;
        utm_content?: boolean | undefined;
        utm_id?: boolean | undefined;
        utm_source_platform?: boolean | undefined;
        utm_creative_format?: boolean | undefined;
        utm_marketing_tactic?: boolean | undefined;
        tags?: boolean | undefined;
    }, {
        utm_source?: boolean | undefined;
        utm_medium?: boolean | undefined;
        utm_campaign?: boolean | undefined;
        utm_term?: boolean | undefined;
        utm_content?: boolean | undefined;
        utm_id?: boolean | undefined;
        utm_source_platform?: boolean | undefined;
        utm_creative_format?: boolean | undefined;
        utm_marketing_tactic?: boolean | undefined;
        tags?: boolean | undefined;
    }>>;
    allowParamPassthrough: z.ZodOptional<z.ZodBoolean>;
    customData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodUndefined]>>>;
    og: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        imageUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        description?: string | undefined;
        imageUrl?: string | undefined;
    }, {
        title?: string | undefined;
        description?: string | undefined;
        imageUrl?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    appId: string;
    utm?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_term?: string | undefined;
        utm_content?: string | undefined;
        utm_id?: string | undefined;
        utm_source_platform?: string | undefined;
        utm_creative_format?: string | undefined;
        utm_marketing_tactic?: string | undefined;
        tags?: string | undefined;
    } | undefined;
    slug?: string | undefined;
    deepLink?: string | null | undefined;
    redirects?: {
        ios?: string | null | undefined;
        android?: string | null | undefined;
        web?: string | null | undefined;
        forceWeb?: boolean | undefined;
    } | undefined;
    utmPresetId?: string | undefined;
    utmOverrides?: {
        utm_source?: boolean | undefined;
        utm_medium?: boolean | undefined;
        utm_campaign?: boolean | undefined;
        utm_term?: boolean | undefined;
        utm_content?: boolean | undefined;
        utm_id?: boolean | undefined;
        utm_source_platform?: boolean | undefined;
        utm_creative_format?: boolean | undefined;
        utm_marketing_tactic?: boolean | undefined;
        tags?: boolean | undefined;
    } | undefined;
    allowParamPassthrough?: boolean | undefined;
    customData?: Record<string, string | number | boolean | null | undefined> | undefined;
    og?: {
        title?: string | undefined;
        description?: string | undefined;
        imageUrl?: string | undefined;
    } | undefined;
}, {
    appId: string;
    utm?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_term?: string | undefined;
        utm_content?: string | undefined;
        utm_id?: string | undefined;
        utm_source_platform?: string | undefined;
        utm_creative_format?: string | undefined;
        utm_marketing_tactic?: string | undefined;
        tags?: string | undefined;
    } | undefined;
    slug?: string | undefined;
    deepLink?: string | null | undefined;
    redirects?: {
        ios?: string | null | undefined;
        android?: string | null | undefined;
        web?: string | null | undefined;
        forceWeb?: boolean | undefined;
    } | undefined;
    utmPresetId?: string | undefined;
    utmOverrides?: {
        utm_source?: boolean | undefined;
        utm_medium?: boolean | undefined;
        utm_campaign?: boolean | undefined;
        utm_term?: boolean | undefined;
        utm_content?: boolean | undefined;
        utm_id?: boolean | undefined;
        utm_source_platform?: boolean | undefined;
        utm_creative_format?: boolean | undefined;
        utm_marketing_tactic?: boolean | undefined;
        tags?: boolean | undefined;
    } | undefined;
    allowParamPassthrough?: boolean | undefined;
    customData?: Record<string, string | number | boolean | null | undefined> | undefined;
    og?: {
        title?: string | undefined;
        description?: string | undefined;
        imageUrl?: string | undefined;
    } | undefined;
}>;
/**
 * Partial update payload accepted by the Edge API for Link updates.
 */
export declare const UpdateLinkInputSchema: z.ZodObject<{
    deep_link_path: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    ios_custom_url: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    android_custom_url: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    web_fallback_url: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    allow_param_passthrough: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>>>;
    force_redirect_web: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>>>;
    og_title: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    og_description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    og_image_url: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    utm: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    utm_override: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    enabled: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>>>;
}, "strip", z.ZodTypeAny, {
    deep_link_path?: string | null | undefined;
    ios_custom_url?: string | null | undefined;
    android_custom_url?: string | null | undefined;
    web_fallback_url?: string | null | undefined;
    allow_param_passthrough?: 0 | 1 | undefined;
    force_redirect_web?: 0 | 1 | undefined;
    og_title?: string | null | undefined;
    og_description?: string | null | undefined;
    og_image_url?: string | null | undefined;
    utm?: string | null | undefined;
    utm_override?: string | null | undefined;
    enabled?: 0 | 1 | undefined;
}, {
    deep_link_path?: string | null | undefined;
    ios_custom_url?: string | null | undefined;
    android_custom_url?: string | null | undefined;
    web_fallback_url?: string | null | undefined;
    allow_param_passthrough?: 0 | 1 | undefined;
    force_redirect_web?: 0 | 1 | undefined;
    og_title?: string | null | undefined;
    og_description?: string | null | undefined;
    og_image_url?: string | null | undefined;
    utm?: string | null | undefined;
    utm_override?: string | null | undefined;
    enabled?: 0 | 1 | undefined;
}>;
/**
 * Response shape returned by Edge when a link is created.
 */
export declare const CreateLinkResponseSchema: z.ZodObject<{
    id: z.ZodString;
    app_id: z.ZodString;
    domain_id: z.ZodNullable<z.ZodString>;
    slug: z.ZodString;
    slugUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    app_id: string;
    domain_id: string | null;
    slug: string;
    slugUrl: string;
}, {
    id: string;
    app_id: string;
    domain_id: string | null;
    slug: string;
    slugUrl: string;
}>;
export type LinkParsed = z.infer<typeof LinkSchema>;
export type ExtendedLinkParsed = z.infer<typeof ExtendedLinkSchema>;
export type CreateLinkInputParsed = z.infer<typeof CreateLinkInputSchema>;
export type UpdateLinkInputParsed = z.infer<typeof UpdateLinkInputSchema>;
export type CreateLinkResponseParsed = z.infer<typeof CreateLinkResponseSchema>;
