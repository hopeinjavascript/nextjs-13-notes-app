// https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.logging.loglevel?view=dotnet-plat-ext-7.0

export function logger(logLevel) {
  return (data) => {
    const RESET_COLOR = colors.reset;
    const LOG_COLOR = LOG_LEVELS[logLevel.label].color;
    console.log(
      `[${getDateTime().date}]\t${LOG_COLOR}[${logLevel.number}:${
        logLevel.label
      }]${RESET_COLOR}\t${JSON.stringify(data)}`
    );
  };
}

function getDateTime(dateObj = new Date()) {
  // from this function you can return multiple date formats
  console.log(dateObj);
  const date = new Date().toLocaleString();

  return {
    date: date,
  };
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m', // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

// simple logger
// preferred for DEV environment
// PROD logger could be more verbose

export const LOG_LEVELS = {
  DEFAULT: {
    label: 'DEFAULT',
    number: -1,
    color: colors.fg.white,
  },
  STACK_TRACE: {
    label: 'STACK_TRACE',
    number: 0,
    color: colors.bright,
  },
  DEBUG: {
    label: 'DEBUG',
    number: 1,
    color: colors.fg.blue,
  },
  INFO: {
    label: 'INFO',
    number: 2,
    color: colors.fg.green,
  },
  WARN: {
    label: 'WARN',
    number: 3,
    color: colors.fg.yellow,
  },
  ERROR: {
    label: 'ERROR',
    number: 4,
    color: colors.fg.red,
  },
  CRITICAL: {
    label: 'CRITICAL',
    number: 5,
    color: colors.bg.red,
  },
};

const LOGGER = {
  default: logger(LOG_LEVELS.DEFAULT),
  trace: logger(LOG_LEVELS.STACK_TRACE),
  debug: logger(LOG_LEVELS.DEBUG),
  info: logger(LOG_LEVELS.INFO),
  warn: logger(LOG_LEVELS.WARN),
  error: logger(LOG_LEVELS.ERROR),
  critical: logger(LOG_LEVELS.CRITICAL),
};

export default LOGGER;
