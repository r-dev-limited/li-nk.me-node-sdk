import { RequestScope, normalizeRequestTimeout } from './requestScope.js';
export type HttpRequestInit = RequestInit & { headers?: Record<string, string> };

export interface HttpClient {
    request<T>(path: string, init?: HttpRequestInit): Promise<T>;
    delete(path: string): Promise<void>;
}

export type HttpClientDeps = {
    baseUrl: string;
    apiKey?: string;
    fetchImpl: typeof fetch;
    requestTimeoutMs?: number;
    signal?: AbortSignal;
};

export class FetchHttpClient implements HttpClient {
    private readonly baseUrl: string;
    private readonly fetchImpl: typeof fetch;
    private readonly apiKey?: string;
    private readonly requestTimeoutMs: number;
    private readonly signal?: AbortSignal;
    private readonly requests = new RequestScope();

    constructor(deps: HttpClientDeps) {
        this.baseUrl = deps.baseUrl.replace(/\/$/, '');
        this.fetchImpl = deps.fetchImpl;
        this.apiKey = deps.apiKey;
        this.requestTimeoutMs = normalizeRequestTimeout(deps.requestTimeoutMs);
        this.signal = deps.signal;
    }

    cancelPendingRequests(): void {
        this.requests.cancelAll();
    }

    async request<T>(path: string, init?: HttpRequestInit): Promise<T> {
        return this.requests.run(this.requestTimeoutMs, async (signal) => {
            const url = `${this.baseUrl}${path.replace(/\/+/g, '/')}`;
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;
            const res = await this.fetchImpl(url, { ...init, signal, headers: { ...headers, ...(init?.headers as any) } });
            if (!res.ok) {
                let detail: any = undefined;
                try { detail = await res.json(); } catch { }
                const err = new Error(`HTTP ${res.status} for ${path}`) as any;
                (err as any).status = res.status;
                (err as any).detail = detail;
                throw err;
            }
            return (await res.json()) as T;
        }, [init?.signal, this.signal]);
    }

    async delete(path: string): Promise<void> {
        return this.requests.run(this.requestTimeoutMs, async (signal) => {
            const url = `${this.baseUrl}${path}`;
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;
            const res = await this.fetchImpl(url, { method: 'DELETE', headers, signal });
            if (!res.ok && res.status !== 204) {
                const err = new Error(`HTTP ${res.status} for DELETE ${path}`) as any;
                (err as any).status = res.status;
                try { (err as any).detail = await res.json(); } catch { }
                throw err;
            }
            await res.body?.cancel();
        }, [this.signal]);
    }
}
