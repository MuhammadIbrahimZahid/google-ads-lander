import os
from dotenv import load_dotenv
from google.ads.googleads.client import GoogleAdsClient

load_dotenv()

client = GoogleAdsClient.load_from_dict(
    {
        "developer_token": os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "client_id": os.environ["OAUTH_CLIENT_ID"],
        "client_secret": os.environ["OAUTH_CLIENT_SECRET"],
        "refresh_token": os.environ["GOOGLE_ADS_API_REFRESH_TOKEN"],
        "login_customer_id": "6909930452",
        "use_proto_plus": True,
    }
)


def main():
    customer_id = "4897844870"

    ga_service = client.get_service("GoogleAdsService")

    query = """
        SELECT
          conversion_action.id,
          conversion_action.name,
          conversion_action.resource_name,
          conversion_action.status
        FROM conversion_action
        WHERE conversion_action.name = 'Lead Qualified - Offline'
    """

    response = ga_service.search(
        customer_id=customer_id,
        query=query,
    )

    for row in response:
        conversion = row.conversion_action

        print("Name:", conversion.name)
        print("ID:", conversion.id)
        print("Resource:", conversion.resource_name)
        print("Status:", conversion.status)


if __name__ == "__main__":
    main()