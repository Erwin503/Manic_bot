import express from "express";
import { httpLogger } from "./logger/index.js";
import { registerMetrics, metricsHandler } from "./metrics/index.js";
import { routes } from "./web/routes.js";

export const app = express();
app.use(express.json());
app.use(httpLogger);

registerMetrics();
app.get("/metrics", metricsHandler);
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

app.use("/v1", routes);
