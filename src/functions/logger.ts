import { createLogger, format, transports } from 'winston';
import config from '../config.js';

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    http: 4,
    debug: 5,
    silly: 6
};

export default createLogger({
    levels: logLevels,
    transports: [
        new transports.File({
            filename: 'error.log',
            dirname: config.logPath,
            maxsize: 5_000_000,
            maxFiles: 5,
            tailable: true,
            format: format.combine(format.timestamp(), format.json()),
            level: 'error'
        }),
        new transports.File({
            filename: 'combined.log',
            dirname: config.logPath,
            maxsize: 5_000_000,
            maxFiles: 5,
            tailable: true,
            format: format.combine(format.timestamp(), format.json()),
            level: config.logLevel,
        }),
        new transports.Console({
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.colorize(),
                format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
            ),
            level: config.logLevel,
        }),
    ],
});
