import base64
import requests
from PIL import Image
from io import BytesIO
import os
from environment import GPT_KEY

def ask_gpt_about_image(image_path):
    # Görseli base64 olarak oku
    with Image.open(image_path) as img:
        buffered = BytesIO()
        img.convert("RGB").save(buffered, format="JPEG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()

    # OpenAI API isteği
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GPT_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Bu fotoğraftaki yemek nedir? Sadece yemek adını yanıtla."},
                    {"type": "image_url", "image_url": {
                        "url": f"data:image/jpeg;base64,{img_base64}"
                    }}
                ]
            }
        ],
        "max_tokens": 100
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"].strip()
    else:
        raise Exception(f"GPT API Hatası: {response.status_code} - {response.text}")
