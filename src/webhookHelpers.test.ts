import crypto from 'node:crypto';
import {
    parseLinkMeWebhookEnvelope,
    verifyLinkMeWebhookSignature,
} from './webhookHelpers';

describe('webhookHelpers', () => {
    const sampleEnvelope = {
        id: 'evt_123',
        event: 'link.click',
        app_id: 'app_456',
        data: {
            link_id: 'lnk_1',
            platform: 'ios',
            nested: { ignored: true },
        },
    };

    it('parses LinkMe webhook envelope', () => {
        const parsed = parseLinkMeWebhookEnvelope(sampleEnvelope);
        expect(parsed.id).toBe('evt_123');
    });

    it('verifies LinkMe webhook signature', () => {
        const rawBody = JSON.stringify(sampleEnvelope);
        const secret = 'test-secret';
        const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
        expect(verifyLinkMeWebhookSignature(rawBody, `sha256=${digest}`, secret)).toBe(true);
        expect(verifyLinkMeWebhookSignature(rawBody, 'sha256=bad', secret)).toBe(false);
    });

    it('rejects malformed digests instead of accepting their valid hex prefix', () => {
        const body = Buffer.from(JSON.stringify(sampleEnvelope));
        const secret = 'test-secret';
        const digest = crypto.createHmac('sha256', secret).update(body).digest('hex');
        expect(verifyLinkMeWebhookSignature(body, `sha256=${digest.toUpperCase()}`, secret)).toBe(true);
        for (const malformed of [digest + 'garbage', digest + '0', digest + '00', digest + '\n', digest.slice(0, -1)]) {
            expect(verifyLinkMeWebhookSignature(body, `sha256=${malformed}`, secret)).toBe(false);
        }
    });
});
