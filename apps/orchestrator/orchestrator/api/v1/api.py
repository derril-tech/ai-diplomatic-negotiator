from fastapi import APIRouter

from .endpoints import health, negotiations

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(negotiations.router, prefix="/negotiations", tags=["negotiations"])
