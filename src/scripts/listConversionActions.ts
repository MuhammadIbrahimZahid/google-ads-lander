import "dotenv/config";
import { GoogleAdsApi } from "google-ads-api";

const client = new GoogleAdsApi({
  client_id: process.env.TEST_OAUTH_CLIENT_ID!,
  client_secret: process.env.TEST_OAUTH_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

const customer = client.Customer({
  customer_id: "2058461331",
  login_customer_id: "4861157313",
  refresh_token: process.env.TEST_GOOGLE_ADS_API_REFRESH_TOKEN!,
});

async function main() {
  const result = await customer.query(`
    SELECT
      conversion_action.id,
      conversion_action.name
    FROM conversion_action
  `);

  console.dir(result, { depth: null });
}

main().catch(console.error);
