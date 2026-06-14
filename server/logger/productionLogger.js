import { createLogger, format, transports } from "winston"
import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';

const developmentLogger = () => {
    const { combine, timestamp, errors, json, colorize, printf } = format;

    const consoleFormat = printf(({ level, message, timestamp, stack }) => {
        return `${level}: ${timestamp}  ${stack || message}`;
    });

    const logger = createLogger({
        level: "info",
        format: combine(
            timestamp(),
            errors({ stack: true }),
            json()
        ),
        defaultMeta: {
            service: "sparke-backend",
            env: process.env.NODE_ENV,
        },
        transports: [
            new transports.Console({
                format: combine(timestamp(), consoleFormat),
            }),
            new AxiomTransport({
                dataset: process.env.AXIOM_DATASET,
                token: process.env.AXIOM_TOKEN,
            }),
        ],
        exitOnError: false,
    });


    logger.exceptions.handle(
        new transports.Console({ format: combine(timestamp(), consoleFormat) })
    );
    process.on("unhandledRejection", (reason) => {
        logger.error(`Unhandled Rejection, ${reason}`);

    });

    return logger
}

export default developmentLogger