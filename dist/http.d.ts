export type HttpRequestInit = RequestInit & {
    headers?: Record<string, string>;
};
export interface HttpClient {
    request<T>(path: string, init?: HttpRequestInit): Promise<T>;
    delete(path: string): Promise<void>;
}
export type HttpClientDeps = {
    baseUrl: string;
    apiKey?: string;
    fetchImpl: typeof fetch;
};
export declare class FetchHttpClient implements HttpClient {
    private readonly baseUrl;
    private readonly fetchImpl;
    private readonly apiKey?;
    constructor(deps: HttpClientDeps);
    request<T>(path: string, init?: HttpRequestInit): Promise<T>;
    delete(path: string): Promise<void>;
}
