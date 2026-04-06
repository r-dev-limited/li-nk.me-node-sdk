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
- Node.js 18+

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
    iosStoreUrl: 'https://apps.apple.com/...',
    androidStoreUrl: 'https://play.google.com/...',
    webFallbackUrl: 'https://example.com/spring',
    forceRedirectWeb: false,
  },
});

// List all links for an app
const links = await linkme.listLinks('app_123');

// Update a link
await linkme.updateLink('spring', {
  metadata: { campaign: 'spring-2026' },
});

// Delete a link
await linkme.deleteLink('spring');
```

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

## License

Apache-2.0
