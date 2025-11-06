export interface Link {
    id: string;
    app_id: string;
    domain_id?: string | null;
    slug: string;
    deep_link_path?: string | null;
    deep_link_params?: string | null;
    ios_custom_url?: string | null;
    android_custom_url?: string | null;
    web_fallback_url?: string | null;
    allow_param_passthrough: 0 | 1;
    force_redirect_web: 0 | 1;
    og_title?: string | null;
    og_description?: string | null;
    og_image_url?: string | null;
    utm?: string | null;
    enabled: 0 | 1;
    click_count: number;
    last_click_at?: string | null;
    created_at?: string;
}

export type NodeSDKOptions = {
    baseUrl?: string; // Defaults to https://li-nk.me. Only override for local development.
    apiKey?: string;
    fetch?: typeof fetch;
};

export type CreateLinkInput = {
    appId: string;
    slug?: string;
    deepLink?: string | null;
    redirects?: {
        ios?: string | null;
        android?: string | null;
        web?: string | null;
        forceWeb?: boolean;
    };
    utm?: Partial<{ utm_source: string; utm_medium: string; utm_campaign: string; tags: string }>;
    utmPresetId?: string;
    allowParamPassthrough?: boolean;
    customData?: Record<string, string | number | boolean | null | undefined>;
    og?: { title?: string; description?: string; imageUrl?: string };
};

export type UpdateLinkInput = Partial<Pick<Link,
    'deep_link_path' | 'ios_custom_url' | 'android_custom_url' | 'web_fallback_url' | 'allow_param_passthrough' | 'force_redirect_web' | 'og_title' | 'og_description' | 'og_image_url' | 'utm' | 'enabled'
>>; 