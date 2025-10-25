# li-nk.me Node SDK

Install

```bash
npm install @li-nk/node-sdk
# or
pnpm add @li-nk/node-sdk
# or
yarn add @li-nk/node-sdk
```

Usage

```ts
import LinkMeClient from '@li-nk/node-sdk';

const client = new LinkMeClient({ baseUrl: 'http://localhost:8080' });

// Create a link
const created = await client.createLink({
  appId: 'app_123',
  slug: 'welcome',
  deepLink: '/welcome',
  redirects: { web: 'https://example.com/download', forceWeb: false },
  utm: { utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'spring' },
});

// Get link by id (slug equals id)
const link = await client.getLink('welcome');

// Update link
await client.updateLink('welcome', { web_fallback_url: 'https://example.com/new' });

// List links by app
const links = await client.listLinks('app_123');

// Delete link
await client.deleteLink('welcome');
```

Validation with Zod
- The Node SDK validates inputs and responses using Zod.
- Schemas are exported from `@li-nk/node-sdk`:

```ts
import { CreateLinkInputSchema, LinkSchema } from '@li-nk/node-sdk';
```

Related documentation
- SDKs overview: ../../sdks/README.md
- API overview: ../../docs/help/docs/api/overview.md

License: Apache-2.0
