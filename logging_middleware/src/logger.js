const LEVEL_WEIGHT = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

const logBuffer = [];
const sinks = [];
let minLevel = "debug";
let defaultSinkRegistered = false;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function formatEntryLine(entry) {
  const parts = [
    `[${entry.stack}]`,
    entry.level.toUpperCase(),
    entry.package,
    entry.message,
  ];
  if (entry.context && Object.keys(entry.context).length > 0) {
    parts.push(JSON.stringify(entry.context));
  }
  return parts.join(" ");
}

function writeToBrowserConsole(entry, line) {
  const c = globalThis.console;
  if (!c) return;

  switch (entry.level) {
    case "fatal":
    case "error":
      c.error(line);
      break;
    case "warn":
      c.warn(line);
      break;
    case "debug":
      (c.debug ?? c.info).call(c, line);
      break;
    default:
      c.info(line);
  }
}

function defaultSink(entry) {
  const line = formatEntryLine(entry);

  if (isBrowser()) {
    writeToBrowserConsole(entry, line);
    return;
  }

  if (typeof process !== "undefined" && process.stdout?.write) {
    process.stdout.write(`${JSON.stringify(entry)}\n`);
  }
}

function registerDefaultSink() {
  if (defaultSinkRegistered) return;
  sinks.push(defaultSink);
  defaultSinkRegistered = true;
}

registerDefaultSink();

export function configureLogger(options = {}) {
  if (options.minLevel) {
    minLevel = options.minLevel;
  }
  if (options.replaceDefaultSink) {
    sinks.length = 0;
    defaultSinkRegistered = false;
    registerDefaultSink();
  }
  if (options.sink) {
    sinks.push(options.sink);
  }
}

export function getLogBuffer() {
  return [...logBuffer];
}

export function clearLogBuffer() {
  logBuffer.length = 0;
}

export function Log(stack, level, pkg, message, context) {
  if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[minLevel]) {
    return;
  }

  const entry = {
    timestamp: new Date().toISOString(),
    stack,
    level,
    package: pkg,
    message,
    ...(context && Object.keys(context).length > 0 ? { context } : {}),
  };

  logBuffer.push(entry);
  if (logBuffer.length > 500) {
    logBuffer.shift();
  }

  for (const sink of sinks) {
    try {
      sink(entry);
    } catch {
      // Swallow sink failures to keep application flow stable.
    }
  }
}
