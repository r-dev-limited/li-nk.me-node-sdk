import crypto from 'node:crypto';
import { LinkMeWebhookEnvelopeSchema, type LinkMeWebhookEnvelopeParsed } from './schemas';

export type LinkMeWebhookEnvelope = LinkMeWebhookEnvelopeParsed;

export function parseLinkMeWebhookEnvelope(input: unknown): LinkMeWebhookEnvelope {
    return LinkMeWebhookEnvelopeSchema.parse(input);
}

export function verifyLinkMeWebhookSignature(
    rawBody: string | Buffer,
    signatureHeader: string | undefined,
    secret: string,
): boolean {
    if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
        return false;
    }

    const receivedHex = signatureHeader.slice('sha256='.length);
    const expectedHex = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

    const received = Buffer.from(receivedHex, 'hex');
    const expected = Buffer.from(expectedHex, 'hex');

    if (received.length === 0 || received.length !== expected.length) {
        return false;
    }

    return crypto.timingSafeEqual(received, expected);
}
