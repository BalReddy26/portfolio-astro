export type ContactFormInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ValidationErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string;
};

export type ContactValidationResult = {
  valid: true;
  value: ContactFormInput;
} | {
  valid: false;
  error: 'Validation failed';
  details: ValidationErrors<ContactFormInput>;
};

const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function validateContactInput(input: Partial<ContactFormInput>): ContactValidationResult {
  const details: ValidationErrors<ContactFormInput> = {};

  const name = typeof input.name === 'string' ? input.name : '';
  const email = typeof input.email === 'string' ? input.email : '';
  const subject = typeof input.subject === 'string' ? input.subject : '';
  const message = typeof input.message === 'string' ? input.message : '';

  const trimmedName = name.trim();
  if (!trimmedName) details.name = 'Name is required.';
  else if (trimmedName.length < 2 || trimmedName.length > 100) details.name = 'Name must be 2–100 characters.';

  const trimmedEmail = email.trim();
  if (!trimmedEmail) details.email = 'Email is required.';
  else if (!isEmail(trimmedEmail)) details.email = 'Email must be a valid email address.';

  const trimmedSubject = subject.trim();
  if (!trimmedSubject) details.subject = 'Subject is required.';
  else if (trimmedSubject.length < 3 || trimmedSubject.length > 150) details.subject = 'Subject must be 3–150 characters.';

  const trimmedMessage = message.trim();
  if (!trimmedMessage) details.message = 'Message is required.';
  else if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) details.message = 'Message must be 10–2000 characters.';

  const valid = Object.keys(details).length === 0;
  if (!valid) {
    return {
      valid: false,
      error: 'Validation failed',
      details
    };
  }

  return {
    valid: true,
    value: {
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage
    }
  };
}

