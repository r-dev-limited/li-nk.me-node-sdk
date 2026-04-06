# Changelog

All notable changes to the LinkMe Node SDK.

## 0.2.13

- General improvements and alignment with platform release.

## 0.2.12

- Adds support for `displayInPortal` flag on `createLink`.
- Improved link management reliability.

## 0.2.11

- Internal improvements to API request handling.

## 0.2.10

- Improved slug resolution and link listing behavior.

## 0.2.7

- Webhook helpers: `verifyLinkMeWebhookSignature` and `parseLinkMeWebhookEnvelope`.
- HMAC signature verification via `X-LinkMe-Signature`.
- Zod schemas for runtime validation of webhook payloads.

## 0.2.5

- Improved error handling for API responses.

## 0.2.4

- SDK alignment release across all platforms.

## 0.2.3

- Internal improvements.

## 0.2.1

- Improved link update and delete operations.

## 0.2.0

- `createLink`, `getLink`, `listLinks`, `updateLink`, `deleteLink` methods.
- Typed responses with Zod schemas (`LinkSchema`, `ExtendedLinkSchema`, `CreateLinkInputSchema`, etc.).
- CommonJS and ESM dual-publish support.

## 0.1.0

- Initial public release on npm.
- Basic link management client.
