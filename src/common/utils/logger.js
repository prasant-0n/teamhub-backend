import pinoHttp from "pino-http";
import pino from "pino";
import { config } from "../../config/index.js";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: config.logLevel,
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true
      }
    }
  })
});


export const httpLogger = pinoHttp({ logger });