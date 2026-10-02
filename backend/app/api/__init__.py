from fastapi import APIRouter
from app.api.analyzer import router as analyzer_router
from app.api.interview import router as interview_router
from app.api.roadmap import router as roadmap_router

api_router = APIRouter()

api_router.include_router(analyzer_router)
api_router.include_router(interview_router)
api_router.include_router(roadmap_router)

__all__ = ["api_router"]
