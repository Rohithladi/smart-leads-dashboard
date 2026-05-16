import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Smart Leads API listening on port ${env.PORT}`);
  });
};

startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup error";

  console.error(`Failed to start API: ${message}`);
  process.exit(1);
});
