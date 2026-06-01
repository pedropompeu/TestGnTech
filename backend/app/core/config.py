from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """
    Configurações Globais da Aplicação.
    
    Para Devs PHP: Pense nisso como o seu arquivo 'wp-config.php' ou '.env'.
    Usamos o Pydantic para garantir que, se uma variável estiver faltando,
    a aplicação nem comece a rodar (Fail Fast).
    """
    PROJECT_NAME: str = "GnTech Weather API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # OpenWeather API
    OPENWEATHER_API_KEY: str
    OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000",
    ]

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
