# Request module must be installed.
# Run pip install requests if necessary.
import requests

subscription_key = '358ac5deb539423f85fad3ddc8cb40ab'


def get_token(subscription_key):
    fetch_token_url = 'https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken'
    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    response = requests.post(fetch_token_url, headers=headers)
    access_token = str(response.text)
    print(access_token)

get_token(subscription_key)