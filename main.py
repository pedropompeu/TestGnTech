from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from db.database import SessionLocal
from db.models import WeatherData, WeatherRecord

# Carrega as variáveis de ambiente
load_dotenv()

# Cria a aplicação FastAPI
app = FastAPI(
    title="Weather API",
    description="API para consulta de dados climáticos",
    version="1.0.0"
)


# Dependência para gerenciar a sessão do banco de dados
def get_db():
    """
    Cria e gerencia a sessão do banco de dados.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health_check():
    """
    Endpoint de verificação de saúde da API.
    """
    return {"status": "API operacional"}


@app.get("/api/v1/weather/{city_name}", response_model=WeatherRecord)
def get_latest_weather(city_name: str, db: Session = Depends(get_db)):
    """
    Retorna o último registro de clima da cidade especificada.
    
    Args:
        city_name: Nome da cidade para consulta
        db: Sessão do banco de dados (injetada)
        
    Returns:
        WeatherRecord: Último registro climático da cidade
        
    Raises:
        HTTPException: 404 se nenhum registro for encontrado
    """
    weather = db.query(WeatherData).filter(
        WeatherData.city_name == city_name
    ).order_by(WeatherData.timestamp.desc()).first()
    
    if not weather:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhum registro encontrado para a cidade '{city_name}'"
        )
    
    return weather


@app.get("/api/v1/weather/history/{city_name}", response_model=list[WeatherRecord])
def get_weather_history(city_name: str, db: Session = Depends(get_db)):
    """
    Retorna todos os registros históricos de clima da cidade especificada.
    
    Args:
        city_name: Nome da cidade para consulta
        db: Sessão do banco de dados (injetada)
        
    Returns:
        list[WeatherRecord]: Lista de todos os registros climáticos da cidade
        
    Raises:
        HTTPException: 404 se nenhum registro for encontrado
    """
    weather_history = db.query(WeatherData).filter(
        WeatherData.city_name == city_name
    ).order_by(WeatherData.timestamp.desc()).all()
    
    if not weather_history:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhum registro encontrado para a cidade '{city_name}'"
        )
    
    return weather_history


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
