type LogLevel = 'info' | 'warn' | 'error';

export type ContactLog = {
  requestId?: string;
  ip?: string;
  email?: string;
  subject?: string;
  errorType?: string;
  message?: string;
  details?: unknown;
  timestamp: string;
};

export function createStructuredLogger() {
  function log(level: LogLevel, payload: ContactLog) {
    const entry = {
      level,
      ...payload
    };
    // Cloudflare Workers: console.log is captured.
    if (level === 'error') console.error(entry);
    else if (level === 'warn') console.warn(entry);
    else console.log(entry);
  }

  return {
    info(payload: ContactLog) {
      log('info', payload);
    },
    warn(payload: ContactLog) {
      log('warn', payload);
    },
    error(payload: ContactLog) {
      log('error', payload);
    }
  };
}

export function getRequestId(req: Request): string {
  // Keep simple; use CF-Ray if present.
  const cfRay = (req.headers.get('cf-ray') || '').trim();
  return cfRay || Math.random().toString(16).slice(2);
}

