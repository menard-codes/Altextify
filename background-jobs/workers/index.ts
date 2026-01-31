import { bulkAltTextGenWorker } from "./bulk-alt-text-gen.worker";
import { mailerWorker } from "./mailer.worker";
import { bulkSaveAltTextsWorker } from "./bulk-save-alt-texts.worker";

console.log("Starting BullMQ workers...");

async function shutdown() {
  console.log("Shutting down workers...");
  await bulkAltTextGenWorker.close();
  await mailerWorker.close();
  await bulkSaveAltTextsWorker.close();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
