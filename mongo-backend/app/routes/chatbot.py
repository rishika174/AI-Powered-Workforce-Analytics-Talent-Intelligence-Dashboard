from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini_service import ask_gemini

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


class ChatRequest(BaseModel):
    message: str


@router.post("/")
async def chat(request: ChatRequest):
    answer = ask_gemini(request.message)

    return {
        "reply": answer
    }