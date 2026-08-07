import "dotenv/config";

import { uploadOfflineConversionDM } from "../services/googleAdsOfflineConversionDM";

async function main() {
  try {
    const result = await uploadOfflineConversionDM(6);

    console.log("DM upload successful");

    console.dir(result, {
      depth: null,
    });
  } catch (error) {
    console.error("DM upload failed", error);

    process.exit(1);
  }
}

main();
