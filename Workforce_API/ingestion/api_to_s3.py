import json
import os
from datetime import datetime

import boto3
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("API_URL")
BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
PREFIX = os.getenv("S3_PREFIX")

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)


def upload_api_response():
    try:
        response = requests.get(API_URL)
        response.raise_for_status()

        data = response.json()

        if isinstance(data, dict) and data.get("message") == "No dataset uploaded yet.":
            print("Dataset not found in API.")
            return

        filename = datetime.now().strftime("workforce_%Y%m%d_%H%M%S.json")

        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=PREFIX + filename,
            Body=json.dumps(data, indent=4),
            ContentType="application/json"
        )

        print(f"Uploaded successfully: {filename}")

    except requests.exceptions.RequestException as e:
        print("API Error:", e)

    except Exception as e:
        print("AWS Error:", e)


if __name__ == "__main__":
    upload_api_response()