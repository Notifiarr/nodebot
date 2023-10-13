import { createLogger, format, transports } from 'winston';
import config from '../config.js';

export default createLogger({
    transports: [
        new transports.File({
            filename: 'error.log',
            dirname: config.logPath,
            maxsize: 5_000_000,
            maxFiles: 5,
            tailable: true,
            format: format.combine(format.timestamp(), format.json()),
            level: 'error',
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
            format: format.combine(format.colorize(), format.simple()),
            level: config.logLevel,
        }),
    ],
});
