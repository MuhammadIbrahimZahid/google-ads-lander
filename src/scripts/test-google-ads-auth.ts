import "dotenv/config";
import { GoogleAdsApi } from "google-ads-api";

const googleAdsClient = new GoogleAdsApi({
  client_id: process.env.TEST_OAUTH_CLIENT_ID!,
  client_secret: process.env.TEST_OAUTH_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

const customer = googleAdsClient.Customer({
  customer_id: "2058461331",
  login_customer_id: "4861157313",
  refresh_token: process.env.TEST_GOOGLE_ADS_API_REFRESH_TOKEN!,
});

async function main() {
  const result = await customer.query(`
    SELECT
      customer.id,
      customer.descriptive_name
    FROM customer
    LIMIT 1
  `);

  console.log(result);
}

main().catch(console.error);
