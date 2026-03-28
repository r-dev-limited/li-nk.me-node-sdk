# LinkMe Node SDK

Official Node.js client for LinkMe — link management and webhook helpers.

- **Main Site**: [li-nk.me](https://li-nk.me)
- **Documentation**: [Node Setup](https://li-nk.me/docs/developer/setup/node)
- **Package**: [npm](https://www.npmjs.com/package/@li-nk.me/node-sdk)

## Installation

```bash
npm install @li-nk.me/node-sdk
```

## Basic Usage

```ts
import LinkMeClient from '@li-nk.me/node-sdk';

const client = new LinkMeClient({
  apiKey: 'YOUR_API_KEY',
});

const created = await client.createLink({ appId: 'app_123', slug: 'welcome', deepLink: '/welcome' });
```

## CommonJS Usage

```js
const LinkMeClient = require('@li-nk.me/node-sdk').default;

const client = new LinkMeClient({
  apiKey: 'YOUR_API_KEY',
});
```

## Methods

| Method | Description |
| --- | --- |
| `createLink(input)` | Create a short link. Returns `{ id, app_id, domain_id, slug, slugUrl }`. |
| `getLink(id)` | Fetch a link by slug or ID. |
| `listLinks(appId)` | List all links for an app with computed extras. |
| `updateLink(id, updates)` | Partial update using snake_case fields and `0 \| 1` flags. |
| `deleteLink(id)` | Permanently delete a link. |

## Webhook Helpers

The SDK also exports helpers for common webhook receiver logic:

- verify `X-LinkMe-Signature`
- parse the LinkMe webhook envelope

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
```

## Zod Schemas

The SDK exports Zod schemas and inferred types for runtime validation: `LinkSchema`, `ExtendedLinkSchema`, `CreateLinkInputSchema`, `UpdateLinkInputSchema`, `CreateLinkResponseSchema`, `LinkMeWebhookEnvelopeSchema`.

For full documentation, guides, and API reference, please visit our [Help Center](https://li-nk.me/docs/help).

## License

Apache-2.0
