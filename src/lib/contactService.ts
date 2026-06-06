import type { ContactFormInput } from './validation';

export type ContactServiceResult =
  | { ok: true }
  | { ok: false; error: 'Not implemented' | 'Failed' };

export interface ContactService {
  sendMessage(input: ContactFormInput): Promise<ContactServiceResult>;
}

// Mock implementation: no external services required.
export class MockContactService implements ContactService {
  async sendMessage(_input: ContactFormInput): Promise<ContactServiceResult> {
    // Simulate success.
    return { ok: true };
  }
}

