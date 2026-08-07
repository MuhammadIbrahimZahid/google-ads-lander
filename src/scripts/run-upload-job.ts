import "dotenv/config";

import { runOfflineConversionUploadJob } from "../services/offlineConversionUploadJob";

async function main() {
  try {
    const result = await runOfflineConversionUploadJob();

    console.log("Upload job completed.");
    console.table(result);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

main();
