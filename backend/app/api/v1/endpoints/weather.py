from typing import List
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.limiter import limiter
from app.db.session import get_db
from app.services.weather_service import WeatherService
from app.schemas.weather import WeatherRead

router = APIRouter()

@router.get("/search", response_model=List[dict])
async def search_locations(
    q: str = Query(..., min_length=2),
    limit: int = Query(5, gt=0, le=10),
    db: AsyncSession = Depends(get_db)
):
    service = WeatherService(db)
    return await service.search_cities(q, limit)

@router.post("/extract", response_model=WeatherRead, status_code=201)
@limiter.limit("10/minute")
async def extract_weather_city(
    request: Request,
    city: str = Query(..., description="Nome da cidade"),
    db: AsyncSession = Depends(get_db)
):
    service = WeatherService(db)
    return await service.extract_by_city(city)

@router.post("/extract/geo", response_model=WeatherRead, status_code=201)
@limiter.limit("10/minute")
async def extract_weather_geo(
    request: Request,
    lat: float = Query(...),
    lon: float = Query(...),
    db: AsyncSession = Depends(get_db)
):
    service = WeatherService(db)
    return await service.extract_by_geo(lat, lon)

@router.get("/history", response_model=List[WeatherRead])
async def get_weather_history(
    limit: int = Query(20, gt=0, le=100),
    db: AsyncSession = Depends(get_db)
):
    service = WeatherService(db)
    return await service.get_history(limit=limit)

@router.delete("/history", status_code=200)
async def clear_weather_history(
    db: AsyncSession = Depends(get_db)
):
    service = WeatherService(db)
    return await service.clear_history()
