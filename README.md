# LinkMe Node SDK

Official Node.js client for LinkMe — links admin and resolution API.

- **Main Site**: [li-nk.me](https://li-nk.me)
- **Documentation**: [Node Setup](https://li-nk.me/docs/developer/setup/node)
- **Package**: [npm](https://www.npmjs.com/package/@li-nk/node-sdk)

## Installation

```bash
npm install @li-nk/node-sdk
```

## Basic Usage

```ts
import LinkMeClient from '@li-nk/node-sdk';

const client = new LinkMeClient({
  baseUrl: 'https://li-nk.me',
  apiKey: 'YOUR_API_KEY',
});

const created = await client.createLink({ appId: 'app_123', slug: 'welcome', deepLink: '/welcome' });
```

## CommonJS Usage

```js
const LinkMeClient = require('@li-nk/node-sdk').default;

const client = new LinkMeClient({
  baseUrl: 'https://li-nk.me',
  apiKey: 'YOUR_API_KEY',
});
```

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

For full documentation, guides, and API reference, please visit our [Help Center](https://li-nk.me/docs/help).

## License

Apache-2.0
