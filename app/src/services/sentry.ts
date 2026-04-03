// Sentry error tracking service.
//
// To activate:
//   1. Run: npx expo install @sentry/react-native
//   2. Run: npx @sentry/wizard@latest -i reactNative
//   3. Replace the stub body below with real Sentry calls.
//   4. Add SENTRY_DSN to your app's SecureStore init script.
//
// Until then, all functions are safe no-ops. The rest of the app calls
// captureError / captureMessage without knowing whether Sentry is active.

type SeverityLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug'

interface SentryUser {
  id: string
  email?: string
}

let _initialized = false

/**
 * Initialize Sentry. Call once from the root layout before any other Sentry calls.
 * DSN is read from the environment variable EXPO_PUBLIC_SENTRY_DSN at build time.
 */
export function initSentry(): void {
  const dsn = process.env['EXPO_PUBLIC_SENTRY_DSN']
  if (!dsn) {
    // No DSN configured — Sentry is disabled. All captures become no-ops.
    return
  }

  try {
    // Lazy require so the app compiles even if @sentry/react-native is not installed.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/react-native') as {
      init: (options: Record<string, unknown>) => void
    }
    Sentry.init({
      dsn,
      tracesSampleRate: 0.2,   // 20% of transactions for performance monitoring
      environment: __DEV__ ? 'development' : 'production',
      // Do NOT attach user PII by default — only user ID (see setUser below).
      attachScreenshot: false,
    })
    _initialized = true
  } catch {
    // @sentry/react-native not installed — silent no-op.
  }
}

/**
 * Associate the current authenticated user ID with future Sentry events.
 * Only the opaque user ID is sent — no email or name.
 */
export function setSentryUser(user: SentryUser): void {
  if (!_initialized) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/react-native') as {
      setUser: (user: Record<string, string | undefined>) => void
    }
    Sentry.setUser({ id: user.id })
  } catch { /* silent */ }
}

/** Clear user context on sign-out. */
export function clearSentryUser(): void {
  if (!_initialized) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/react-native') as {
      setUser: (user: null) => void
    }
    Sentry.setUser(null)
  } catch { /* silent */ }
}

/**
 * Capture an unexpected error. Use in catch blocks that cannot be surfaced to the user.
 */
export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (!_initialized) {
    if (__DEV__) console.error('[Sentry stub] captureError:', error, context)
    return
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/react-native') as {
      captureException: (error: unknown, hint?: Record<string, unknown>) => string
    }
    Sentry.captureException(error, context ? { extra: context } : undefined)
  } catch { /* silent */ }
}

/**
 * Log a non-error diagnostic message (e.g. "Offline cache hit").
 */
export function captureMessage(message: string, level: SeverityLevel = 'info'): void {
  if (!_initialized) {
    if (__DEV__) console.info('[Sentry stub] captureMessage:', level, message)
    return
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/react-native') as {
      captureMessage: (message: string, level: SeverityLevel) => string
    }
    Sentry.captureMessage(message, level)
  } catch { /* silent */ }
}

/**
 * Add a breadcrumb for sequential event tracking (e.g. "User started roleplay").
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, unknown>): void {
  if (!_initialized) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/react-native') as {
      addBreadcrumb: (crumb: Record<string, unknown>) => void
    }
    Sentry.addBreadcrumb({ message, category, data, level: 'info' })
  } catch { /* silent */ }
}
