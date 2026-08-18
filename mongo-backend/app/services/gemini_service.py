import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

# Load .env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GROQ_API_KEY")

print("Groq API Loaded:", api_key is not None)

client = Groq(api_key=api_key)


def ask_gemini(question: str):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI Workforce Analytics Assistant. Answer HR, employee, productivity, leave, and workforce-related questions professionally."
                },
                {
                    "role": "user",
                    "content": question
                }
            ],
            temperature=0.3,
            max_tokens=512
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"