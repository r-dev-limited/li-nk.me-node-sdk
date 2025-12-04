import { CreateLinkInput, Link, NodeSDKOptions, UpdateLinkInput } from './models.js';
export declare class LinkMeClient {
    private readonly linkService;
    constructor(opts?: NodeSDKOptions);
    createLink(input: CreateLinkInput): Promise<{
        id: string;
        app_id: string;
        domain_id: string | null;
        slug: string;
        slugUrl: string;
    }>;
    getLink(id: string): Promise<Link>;
    listLinks(appId: string): Promise<Array<Link & {
        hostname?: string | null;
        idUrl?: string;
        slugUrl?: string;
        clicks?: number;
        installs?: number;
    }>>;
    updateLink(id: string, updates: UpdateLinkInput): Promise<Link>;
    deleteLink(id: string): Promise<void>;
}
export default LinkMeClient;
export * from './models.js';
