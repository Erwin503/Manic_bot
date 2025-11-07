import pino from "pino";
import pinoHttp from "pino-http";

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
  level: isProd ? "info" : "debug",
  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: { translateTime: "SYS:standard", ignore: "pid,hostname" },
      },
  base: undefined,
});

export const httpLogger = pinoHttp({ logger });
