export type HttpRequestInit = RequestInit & { headers?: Record<string, string> };

export interface HttpClient {
    request<T>(path: string, init?: HttpRequestInit): Promise<T>;
    delete(path: string): Promise<void>;
}

export type HttpClientDeps = {
    baseUrl: string;
    apiKey?: string;
    fetchImpl: typeof fetch;
};

export class FetchHttpClient implements HttpClient {
    private readonly baseUrl: string;
    private readonly fetchImpl: typeof fetch;
    private readonly apiKey?: string;

    constructor(deps: HttpClientDeps) {
        this.baseUrl = deps.baseUrl.replace(/\/$/, '');
        this.fetchImpl = deps.fetchImpl;
        this.apiKey = deps.apiKey;
    }

    async request<T>(path: string, init?: HttpRequestInit): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;
        const res = await this.fetchImpl(url, { ...init, headers: { ...headers, ...(init?.headers as any) } });
        if (!res.ok) {
            let detail: any = undefined;
            try { detail = await res.json(); } catch { }
            const err = new Error(`HTTP ${res.status} for ${path}`) as any;
            (err as any).status = res.status;
            (err as any).detail = detail;
            throw err;
        }
        return (await res.json()) as T;
    }

    async delete(path: string): Promise<void> {
        const url = `${this.baseUrl}${path}`;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;
        const res = await this.fetchImpl(url, { method: 'DELETE', headers });
        if (!res.ok && res.status !== 204) {
            const err = new Error(`HTTP ${res.status} for DELETE ${path}`) as any;
            (err as any).status = res.status;
            try { (err as any).detail = await res.json(); } catch { }
            throw err;
        }
    }
} 