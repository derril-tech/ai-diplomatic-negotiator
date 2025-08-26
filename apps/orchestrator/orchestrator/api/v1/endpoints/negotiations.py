from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

@router.get("/")
async def list_negotiations():
    """List all negotiations"""
    return {"negotiations": []}

@router.post("/")
async def create_negotiation(negotiation_data: Dict[str, Any]):
    """Create a new negotiation"""
    return {"id": "temp-id", "status": "created"}

@router.get("/{negotiation_id}")
async def get_negotiation(negotiation_id: str):
    """Get a specific negotiation"""
    return {"id": negotiation_id, "status": "active"}
