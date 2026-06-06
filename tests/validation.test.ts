import { describe, expect, it } from 'vitest';
import { validateContactInput } from '../src/lib/validation';

describe('validateContactInput', () => {
  it('valid input passes', () => {
    const res = validateContactInput({
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'SOC help',
      message: 'This is a sufficiently long message.'
    });

    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.value.name).toBe('Alice');
      expect(res.value.email).toBe('alice@example.com');
    }
  });

  it('invalid email fails', () => {
    const res = validateContactInput({
      name: 'Alice',
      email: 'not-an-email',
      subject: 'SOC help',
      message: 'This is a sufficiently long message.'
    });

    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.details.email).toBeTruthy();
    }
  });

  it('empty name fails', () => {
    const res = validateContactInput({
      name: '   ',
      email: 'alice@example.com',
      subject: 'SOC help',
      message: 'This is a sufficiently long message.'
    });

    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.details.name).toBeTruthy();
    }
  });

  it('empty subject fails', () => {
    const res = validateContactInput({
      name: 'Alice',
      email: 'alice@example.com',
      subject: '   ',
      message: 'This is a sufficiently long message.'
    });

    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.details.subject).toBeTruthy();
    }
  });

  it('empty message fails', () => {
    const res = validateContactInput({
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'SOC help',
      message: '   '
    });

    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.details.message).toBeTruthy();
    }
  });

  it('boundary conditions: minimum lengths pass', () => {
    const res = validateContactInput({
      name: 'AB',
      email: 'ab@example.com',
      subject: 'ABC',
      message: '1234567890' // length 10
    });

    expect(res.valid).toBe(true);
  });

  it('maximum length validation: over max message fails', () => {
    const msg = 'a'.repeat(2001);
    const res = validateContactInput({
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'SOC help',
      message: msg
    });

    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.details.message).toBeTruthy();
    }
  });

  it('maximum length validation: max message passes', () => {
    const msg = 'a'.repeat(2000);
    const res = validateContactInput({
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'SOC help',
      message: msg
    });

    expect(res.valid).toBe(true);
  });
});

