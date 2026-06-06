import { validateContactInput } from '../lib/validation';
import { sanitizeContactField } from '../lib/sanitize';
import { InMemoryRateLimiter } from '../lib/rateLimit';
import { createStructuredLogger, getRequestId } from '../lib/logger';
import { MockContactService } from '../lib/contactService';

const logger = createStructuredLogger();
const contactService = new MockContactService();

const rateLimiter = new InMemoryRateLimiter({
  windowMs: 60_000, // 1 minute
  max: 5
});

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init?.headers || {})
    }
  });
}

function securityHeaders() {
  return {
    // Basic hardening for API responses.
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer',
    'permissions-policy': 'geolocation=(), microphone=(), camera=()'
  };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('cf-connecting-ip');
  if (forwarded) return forwarded;
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || 'unknown';
  return 'unknown';
}

export async function onRequest(context: { request: Request }): Promise<Response> {
  const { request } = context;

  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, { status: 405, headers: securityHeaders() });
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const rl = rateLimiter.check(ip, now);
  if (!rl.allowed) {
    logger.warn({
      timestamp: new Date(now).toISOString(),
      ip,
      errorType: 'rate_limited',
      message: 'Rate limit exceeded'
    });

    return jsonResponse(
      {
        success: false,
        error: 'Too many requests. Please try again later.'
      },
      {
        status: 429,
        headers: {
          ...securityHeaders(),
          'retry-after': String(rl.retryAfterSeconds)
        }
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON payload' }, { status: 400, headers: securityHeaders() });
  }

  const parsed = validateContactInput(body as Partial<{ name: string; email: string; subject: string; message: string }>);
  const requestId = getRequestId(request);

  if (!parsed.valid) {
    logger.warn({
      requestId,
      timestamp: new Date(now).toISOString(),
      ip,
      errorType: 'validation_failed',
      details: parsed.details
    });

    return jsonResponse(
      {
        success: false,
        error: 'Validation failed',
        details: parsed.details
      },
      { status: 400, headers: securityHeaders() }
    );
  }

  // Sanitization (after validation) to reduce injection risk in downstream systems.
  const sanitized = {
    name: sanitizeContactField(parsed.value.name),
    email: sanitizeContactField(parsed.value.email),
    subject: sanitizeContactField(parsed.value.subject),
    message: sanitizeContactField(parsed.value.message)
  };

  try {
    const result = await contactService.sendMessage(sanitized);

    if (!result.ok) {
      logger.error({
        requestId,
        timestamp: new Date(now).toISOString(),
        ip,
        errorType: 'service_failed',
        message: result.error
      });

      return jsonResponse(
        { success: false, error: 'Internal server error' },
        { status: 500, headers: securityHeaders() }
      );
    }

    logger.info({
      requestId,
      timestamp: new Date(now).toISOString(),
      ip,
      email: parsed.value.email,
      subject: parsed.value.subject,
      message: 'Contact submission accepted'
    });

    return jsonResponse(
      { success: true, message: 'Message sent successfully' },
      { status: 200, headers: securityHeaders() }
    );
  } catch (err) {
    logger.error({
      requestId,
      timestamp: new Date(now).toISOString(),
      ip,
      errorType: 'server_error',
      details: err
    });

    return jsonResponse(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: securityHeaders() }
    );
  }
}

