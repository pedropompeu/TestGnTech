from sqlalchemy.ext.asyncio import AsyncSession
from app.models.weather import WeatherData
from app.repositories.base_repo import BaseRepository

class WeatherRepository(BaseRepository[WeatherData]):
    """
    Repositório específico para dados climáticos.
    """
    def __init__(self, db: AsyncSession):
        super().__init__(WeatherData, db)
