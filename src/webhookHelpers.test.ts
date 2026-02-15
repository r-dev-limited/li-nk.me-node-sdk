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
});
