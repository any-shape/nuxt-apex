import chalk, { type ChalkInstance } from 'chalk'

type LogLevel = 'info' | 'warn' | 'error' | 'success'

const levelConfig: Record<LogLevel, { icon: string; style: ChalkInstance }> = {
  info:    { icon: 'ℹ️', style: chalk.blueBright },
  warn:    { icon: '⚠️', style: chalk.yellowBright },
  error:   { icon: '❌', style: chalk.redBright },
  success: { icon: '✅', style: chalk.greenBright },
}

/**
 * Base logging function.
 *
 * @param level   One of 'info' | 'warn' | 'error' | 'success'
 * @param msg     Primary message (string or printf-style)
 * @param args    Additional args (objects, numbers, etc.)
 */
function log(level: LogLevel, msg: string, ...args: unknown[]) {
  const { icon, style } = levelConfig[level]
  console.log(style(`${icon}  ${msg}`), ...args)
}

/** Shorthand for console.info with blue icon & text */
export const info    = (msg: string, ...args: unknown[]) => log('info', msg, ...args)
/** Shorthand for console.warn with yellow icon & text */
export const warn    = (msg: string, ...args: unknown[]) => log('warn', msg, ...args)
/** Shorthand for console.error with red icon & text */
export const error   = (msg: string, ...args: unknown[]) => log('error', msg, ...args)
/** Shorthand for console.log with green icon & text */
export const success = (msg: string, ...args: unknown[]) => log('success', msg, ...args)
