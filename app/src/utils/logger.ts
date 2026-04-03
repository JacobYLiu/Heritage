const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export function log(message: string, ...args: unknown[]): void {
  if (!IS_PRODUCTION) console.log(`[Heritage] ${message}`, ...args)
}

export function warn(message: string, ...args: unknown[]): void {
  if (!IS_PRODUCTION) console.warn(`[Heritage] ${message}`, ...args)
}

export function error(message: string, ...args: unknown[]): void {
  if (!IS_PRODUCTION) console.error(`[Heritage] ${message}`, ...args)
}
