const winston = require('winston');
const _ = require('lodash');

export default class Logger {

    private static logger: any = null;

    public static info(msg: any) {
        if (_.isNil(Logger.logger))
            Logger.createLogger();
        Logger.logger.info(msg);
    }

    public static errorStack(msg: any, error: any) {
        if (_.isNil(Logger.logger))
            Logger.createLogger();
        Logger.logger.error(msg, error);
    }

    private static createLogger() {
        const format = winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.align(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
        );

        Logger.logger = winston.createLogger({
            transports: [
                new winston.transports.File({
                    filename: "logs/error.log",
                    format: format,
                    level: "info"
                })
            ]
        })
    }
}




