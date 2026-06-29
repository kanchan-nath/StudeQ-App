import { createLogger, format, transports } from "winston"
import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';

const developmentLogger = () => {
    const { combine, timestamp, errors, json, colorize, printf } = format;

    const consoleFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    });

    const logger = createLogger({
        level: "debug",
        format: combine(
            timestamp({ format: "HH:mm:ss" }),
            errors({ stack: true }),
            json()
        ),
        defaultMeta: {
            service: "studeq-backend",
            env: process.env.NODE_ENV || "development",
        },
        transports: [
            new transports.Console({
                format: combine(timestamp(), colorize(), consoleFormat),
            }),
            // new AxiomTransport({
            //     dataset: process.env.AXIOM_DATASET,
            //     token: process.env.AXIOM_TOKEN,
            // }),
        ],
        exitOnError: false,
    });


    logger.exceptions.handle(
        new transports.Console({
            format: combine(timestamp(), colorize(), consoleFormat),
            handleExceptions: true,
        })
    );
    process.on("unhandledRejection", (reason) => {
        logger.error(`Unhandled Rejection, ${reason}`);
    });

    return logger
}

export default developmentLogger