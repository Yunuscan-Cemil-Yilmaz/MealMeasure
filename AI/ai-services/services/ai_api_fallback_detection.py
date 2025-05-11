import base64
import requests
from PIL import Image
from io import BytesIO
import os
from environment import GPT_KEY


def encode_image_base64(image_path, resize_to=(512, 512)):
    with Image.open(image_path) as img:
        img = img.convert("RGB")
        if resize_to:
            img = img.resize(resize_to)
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        return base64.b64encode(buffered.getvalue()).decode()
    

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
    

def ask_gpt_about_density(image_path):
    img_base64 = encode_image_base64(image_path)

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
                    {"type": "text", "text": "Aşağıdaki yemek fotoğrafına göre yemeğin toplam hacmini cm³ cinsinden tahmin et. Sadece sayı ver. Açıklama yapma, örnek verme, birim yazma. Sadece sayıyı döndür."},
                    {"type": "image_url", "image_url": {
                        "url": f"data:image/jpeg;base64,{img_base64}"
                    }}
                ]
            }
        ],
        "max_tokens": 50
    }

    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"].strip()
    else:
        raise Exception(f"GPT API Hatası: {response.status_code} - {response.text}")