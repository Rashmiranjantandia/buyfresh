/**
 * Structured logger for API routes.
 * Adds ISO timestamps and route context to every log line.
 * Drop-in compatible with future log aggregation services (Datadog, Logtail, etc.)
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

function formatMessage(level: LogLevel, route: string, message: string): string {
  return `[${new Date().toISOString()}] [${level}] [${route}] ${message}`;
}

export const logger = {
  info: (route: string, message: string) => {
    console.log(formatMessage('INFO', route, message));
  },

  warn: (route: string, message: string) => {
    console.warn(formatMessage('WARN', route, message));
  },

  error: (route: string, message: string, error?: unknown) => {
    const base = formatMessage('ERROR', route, message);
    if (error instanceof Error) {
      console.error(base, {
        name: error.name,
        message: error.message,
        // Include Mongoose/MongoDB specific error codes if present
        ...(error instanceof Error ? { message: error.message, stack: error.stack } : {}),
      });
    } else {
      console.error(base, error ?? '');
    }
  },
};
