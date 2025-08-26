from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "AI Diplomatic Negotiator Orchestrator"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/diplomatic_negotiator"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"
    
    # CrewAI
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    
    # External Services
    GATEWAY_URL: str = "http://localhost:3001"
    WORKERS_URL: str = "http://localhost:3003"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
