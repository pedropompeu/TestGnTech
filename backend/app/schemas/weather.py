from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class WeatherBase(BaseModel):
    city: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    temperature: float
    feels_like: Optional[float] = None
    temp_min: Optional[float] = None
    temp_max: Optional[float] = None
    pressure: Optional[int] = None
    humidity: int
    wind_speed: Optional[float] = None
    wind_deg: Optional[int] = None
    rain_1h: Optional[float] = None
    description: str
    icon: Optional[str] = None

class WeatherCreate(WeatherBase):
    pass

class WeatherRead(WeatherBase):
    id: int
    extracted_at: datetime

    class Config:
        from_attributes = True
