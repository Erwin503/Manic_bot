import client from "prom-client";
let registered = false;

export function registerMetrics() {
  if (registered) return;
  client.collectDefaultMetrics();
  registered = true;
}
export async function metricsHandler(_req: any, res: any) {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
}
