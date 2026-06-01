from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True, nullable=False)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    temperature = Column(Float, nullable=False)
    feels_like = Column(Float, nullable=True)
    temp_min = Column(Float, nullable=True)
    temp_max = Column(Float, nullable=True)
    pressure = Column(Integer, nullable=True)
    humidity = Column(Integer, nullable=False)
    wind_speed = Column(Float, nullable=True)
    wind_deg = Column(Integer, nullable=True)
    rain_1h = Column(Float, nullable=True)
    description = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    extracted_at = Column(DateTime(timezone=True), server_default=func.now())
