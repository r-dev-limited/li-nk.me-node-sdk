export class FetchHttpClient {
    baseUrl;
    fetchImpl;
    apiKey;
    constructor(deps) {
        this.baseUrl = deps.baseUrl.replace(/\/$/, '');
        this.fetchImpl = deps.fetchImpl;
        this.apiKey = deps.apiKey;
    }
    async request(path, init) {
        const url = `${this.baseUrl}${path}`;
        const headers = { 'Content-Type': 'application/json' };
        if (this.apiKey)
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        const res = await this.fetchImpl(url, { ...init, headers: { ...headers, ...init?.headers } });
        if (!res.ok) {
            let detail = undefined;
            try {
                detail = await res.json();
            }
            catch { }
            const err = new Error(`HTTP ${res.status} for ${path}`);
            err.status = res.status;
            err.detail = detail;
            throw err;
        }
        return (await res.json());
    }
    async delete(path) {
        const url = `${this.baseUrl}${path}`;
        const headers = { 'Content-Type': 'application/json' };
        if (this.apiKey)
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        const res = await this.fetchImpl(url, { method: 'DELETE', headers });
        if (!res.ok && res.status !== 204) {
            const err = new Error(`HTTP ${res.status} for DELETE ${path}`);
            err.status = res.status;
            try {
                err.detail = await res.json();
            }
            catch { }
            throw err;
        }
    }
}
//# sourceMappingURL=http.js.map