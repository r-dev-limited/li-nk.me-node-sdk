# LinkMe Node SDK

Server-side client for LinkMe — programmatic link management, webhook verification, and backend automation.

[![npm](https://img.shields.io/npm/v/@li-nk.me/node-sdk)](https://www.npmjs.com/package/@li-nk.me/node-sdk)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

- [Main Site](https://li-nk.me)
- [Setup Guide](https://help.li-nk.me/hc/link-me/en/developer-setup/developer-setup)
- [SDK Reference](https://help.li-nk.me/hc/link-me/en/sdks/node-sdk-reference)
- [Help Center](https://help.li-nk.me/hc/link-me/en)

## Quick start

### 1. Prerequisites

- A LinkMe workspace with at least one app
- A server/API key from the portal (write scope for link management)
- Node.js 22 or 24 recommended (package minimum: Node.js 18)

### 2. Install

```bash
npm install @li-nk.me/node-sdk
```

### 3. Create and manage links

```ts
import LinkMeClient from '@li-nk.me/node-sdk';

const linkme = new LinkMeClient({
  apiKey: process.env.LINKME_SERVER_KEY,
});

// Create a short link
const link = await linkme.createLink({
  appId: 'app_123',
  slug: 'spring',
  deepLink: '/promo/spring',
  redirects: {
    ios: 'https://apps.apple.com/...',
    android: 'https://play.google.com/...',
    web: 'https://example.com/spring',
    forceWeb: false,
  },
});

// List all links for an app
const links = await linkme.listLinks('app_123');

// Update a link
await linkme.updateLink('spring', {
  web_fallback_url: 'https://example.com/spring-2026',
});

// Delete a link
await linkme.deleteLink('spring');
```

### Surface and lifecycle options in the next release

For an app with multiple surface bindings, choose a surface explicitly. The domain must belong to the app's environment. The expiry uses an ISO 8601 timestamp, and a one-time link can be consumed by one eligible navigation.

```ts
const link = await linkme.createLink({
  appId: 'app_123',
  surfaceId: 'surface_customer',
  domainId: 'domain_production',
  expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  oneTimeUse: true,
  deepLink: '/invite/accept',
  redirects: { web: 'https://example.com/invite', desktopMode: 'web' },
});
```

Creation results retain `environment_id`, `surface_id`, `expires_at`, and `one_time_use` when returned by Edge. Reads preserve the link's surface, expiry, consumption, and desktop-mode metadata. Unknown creation options are rejected so a misspelled policy field cannot silently disappear. These additions are unreleased; published 0.2.14 does not include them.

### CommonJS usage

```js
const LinkMeClient = require('@li-nk.me/node-sdk').default;
```

## Webhook verification

The SDK exports helpers for verifying and parsing webhook payloads:

```ts
import {
  parseLinkMeWebhookEnvelope,
  verifyLinkMeWebhookSignature,
} from '@li-nk.me/node-sdk';

const rawBody = req.rawBody.toString('utf8');
const signature = req.get('X-LinkMe-Signature');

if (!verifyLinkMeWebhookSignature(rawBody, signature, process.env.LINKME_WEBHOOK_SIGNING_SECRET!)) {
  res.status(401).send('Invalid signature');
  return;
}

const envelope = parseLinkMeWebhookEnvelope(JSON.parse(rawBody));
// envelope.event — e.g. 'link.click', 'link.claim', 'link.app_open'
```

Supported webhook events: `link.click`, `link.token_created`, `link.claim`, `link.app_open`, `link.deferred_claim_attempt`. Configure webhooks in **Developer Settings > Webhooks** in the portal.

## API reference

| Method | Description |
| --- | --- |
| `createLink(input)` | Create a short link. Returns `{ id, app_id, domain_id, slug, slugUrl }` |
| `getLink(id)` | Fetch a link by slug or ID |
| `listLinks(appId)` | List all links for an app |
| `updateLink(id, updates)` | Partial update (snake_case fields, `0 \| 1` flags) |
| `deleteLink(id)` | Permanently delete a link |

### `createLink` options

`displayInPortal` controls portal visibility:
- `false` (default in this SDK) — hides the link from the Portal links list (still works as a universal link)
- `true` — shows it in the Portal

## Zod schemas

The SDK exports Zod schemas and inferred types for runtime validation:

- `LinkSchema` / `ExtendedLinkSchema`
- `CreateLinkInputSchema` / `CreateLinkResponseSchema`
- `UpdateLinkInputSchema`
- `LinkMeWebhookEnvelopeSchema`

## Development

For SDK development, run `nvm install && nvm use` to select the patched Node 24.22.1 LTS runtime. CI tests Node 22.23.4 and 24.22.1 and audits the independent lockfile.

## License

Apache-2.0

## Trusted management credentials (unreleased Edge)

Node management reads require a trusted key with `can_manage_read: true` or
`can_write: true`. Management writes require `can_write`. Keep these keys on
secure servers. Publishable client `can_read` and `can_ingest` credentials only
serve SDK resolution/telemetry; they cannot list private management data or
visitor diagnostics. Existing server read-only integrations need an owner to
create/rotate an explicit management-read key before deploying the new policy.

## Request deadlines and cancellation (unreleased)

`new LinkMeClient({ requestTimeoutMs: 15000 })` bounds the complete fetch/body
operation, including success/error bodies. The default is 15 seconds. Overrides
must be positive integers up to 2147483647 milliseconds. The client rejects with
an error named `TimeoutError` at the deadline.

Call `client.cancelPendingRequests()` to abort current work; later requests can
still run. Pass `signal: controller.signal` in the constructor to bind the client
to a host `AbortController`; requests reject with `AbortError` after cancellation,
including requests made with an already-aborted host signal. An injected fetch
that ignores abort cannot leave the public call waiting indefinitely. These
operations add no automatic retry and cannot retract a mutation already accepted
by the server.
