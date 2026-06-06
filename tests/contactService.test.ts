import { describe, expect, it } from 'vitest';
import { MockContactService } from '../src/lib/contactService';

describe('MockContactService', () => {
  it('successful submission returns ok=true', async () => {
    const service = new MockContactService();
    const res = await service.sendMessage({
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'SOC help',
      message: 'This is a sufficiently long message.'
    });

    expect(res).toEqual({ ok: true });
  });
});

