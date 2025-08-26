from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Worker settings"""
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/diplomatic_negotiator"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # External Services
    ORCHESTRATOR_URL: str = "http://localhost:3002"
    GATEWAY_URL: str = "http://localhost:3001"
    
    # Storage
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "diplomatic-negotiator"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
