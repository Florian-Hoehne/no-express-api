/**
 * logging levels
 * @type {{TRACE: number, ERROR: number, INFO: number, DEBUG: number, WARN: number}}
 */
const LOGGING_LEVEL = {
    TRACE: 'TRACE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
}

// ansi outputs
const Reset = "\x1b[0m"
const Bright = "\x1b[1m"
const Dim = "\x1b[2m"
const Underscore = "\x1b[4m"
const Blink = "\x1b[5m"
const Reverse = "\x1b[7m"
const Hidden = "\x1b[8m"

const FgBlack = "\x1b[30m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"
const FgCyan = "\x1b[36m"
const FgWhite = "\x1b[37m"

const BgBlack = "\x1b[40m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"

class Logger {
    constructor(config = {}) {

        this.profile = process.env.NODE_ENV

        this.namespace = 'main'

        this.mask = process.env.LOGMASK ?? "%s %s[%s]%s %s : "

        this.isTraceEnabled = (process.env.TRACE ?? 'noTrace').match(new RegExp(this.namespace))


        this.isDebugEnabled =  (process.env.DEBUG ?? 'noDebug').match(new RegExp(this.namespace))

        /**
         * date format
         * @type {Intl.DateTimeFormat}
         */
        this.dateFormat = new Intl.DateTimeFormat(process.env.POLICE_LOACLE ?? 'de-DE')

        Object.assign(this, config)
    }

    isEnabled(level) {
            switch (level)
            {
                case LOGGING_LEVEL.TRACE:
                    return this.isTraceEnabled

                case LOGGING_LEVEL.DEBUG:
                    return this.isDebugEnabled

                default:
                    return false
            }
    }

    start(label = 'logger') {
        console.time(label)
    }

    log(level = LOGGING_LEVEL.INFO, message = '', ... args) {
        const time  = this.dateFormat.format(new Date())
        switch (level) {
            case LOGGING_LEVEL.TRACE:
            case LOGGING_LEVEL.DEBUG:
                if(this.isEnabled(level)) {
                    const params = [  time, FgCyan, level,  Reset, this.namespace, ... args ]
                    console.log(this.mask + message,  ... params)
                }
                break

            case LOGGING_LEVEL.INFO:
                const info = [ time, FgGreen, level, Reset, this.namespace ].concat(...args)
                const iMessage = this.mask + message
                console.log(iMessage, ... info)
                break

            case LOGGING_LEVEL.WARN:
                const warn = [ time, FgGreen , level, Reset, this.namespace, ... args ]
                console.log(this.mask + message,  ... warn)
                break

            case LOGGING_LEVEL.ERROR:
                const err = [ time, FgGreen , level, Reset, this.namespace, ... args ]
                console.error(this.mask + message,  ... err)
                break

            default:
                const extra = [ time, FgMagenta , level, Reset, this.namespace, ... args ]
                console.error(this.mask + message,  ... extra)
                break
        }
    }

    /**
     * 
     * @param level
     * @param label
     * @param message
     * @param args
     */
    logTime(level = LOGGING_LEVEL.INFO, label = 'logger', message = '', ... args) {
        const time  = this.dateFormat.format(new Date())
        switch (level) {
            case LOGGING_LEVEL.TRACE:
            case LOGGING_LEVEL.DEBUG:
                if(this.isEnabled(level)) {
                    const params = [  time, FgCyan, level,  Reset, this.namespace, ... args ]
                    console.timeLog(label, this.mask + message,  ... params)
                }
                break

            case LOGGING_LEVEL.INFO:
                const info = [ time, FgGreen, level, Reset, this.namespace ].concat(...args)
                const iMessage = this.mask + message
                console.timeLog(label, iMessage, ... info)
                break

            case LOGGING_LEVEL.WARN:
                const warn = [ time, FgGreen , level, Reset, this.namespace, ... args ]
                console.timeLog(this.mask + message,  ... warn)
                break

            case LOGGING_LEVEL.ERROR:
                const err = [ time, FgGreen , level, Reset, this.namespace, ... args ]
                console.timeLog(this.mask + message,  ... err)
                break

            default:
                const extra = [ time, FgMagenta , level, Reset, this.namespace, ... args ]
                console.timeLog(this.mask + message,  ... extra)
                break
        }
    }


    trace(message, ... args) {
        this.log(LOGGING_LEVEL.TRACE, message, args)
    }

    debug(message, ... args) {
        this.log(LOGGING_LEVEL.DEBUG, message, args)
    }

    info(message, ... args) {
        this.log(LOGGING_LEVEL.INFO, message, args)
    }

    warn(message, ... args) {
        this.log(LOGGING_LEVEL.WARN, message, args)
    }

    error(message, ... args) {
        this.log(LOGGING_LEVEL.ERROR, message, args)
    }


}

/**
 * returns the logger bootstrapper
 * @param namespace
 * @return {Logger}
 */
module.exports = (namespace) => new Logger({ namespace: namespace })
