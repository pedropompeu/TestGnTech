from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Sequence
from sqlalchemy.sql import func
from pydantic import BaseModel
from db.database import Base


# Modelo ORM (SQLAlchemy) - Tabela no banco de dados
class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, Sequence("weather_data_id_seq"), primary_key=True, index=True)
    city_name = Column(String, nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)


# Modelo Pydantic - Validação e serialização
class WeatherRecord(BaseModel):
    id: int | None = None
    city_name: str
    temperature: float
    humidity: int
    description: str
    timestamp: datetime | None = None

    class Config:
        from_attributes = True
