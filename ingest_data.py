import os
import sys
from dotenv import load_dotenv
from src.weather_client import OpenWeatherClient
from db.database import SessionLocal
from db.models import WeatherData
from initialize_db import initialize_database


def ingest_weather_data():
    """
    Orquestra a extração e armazenamento de dados climáticos.
    """
    try:
        # Carrega as variáveis de ambiente
        load_dotenv()
        print("Variáveis de ambiente carregadas.")
        
        # Garante que as tabelas existam
        print("\n=== Inicializando banco de dados ===")
        initialize_database()
        
        # Busca o nome da cidade padrão do .env
        city_name = os.environ.get("CITY_NAME", "Florianópolis")
        print(f"\n=== Buscando dados climáticos para: {city_name} ===")
        
        # Instancia o cliente OpenWeather
        weather_client = OpenWeatherClient()
        
        # Busca os dados climáticos
        weather_record = weather_client.get_current_weather(city_name)
        print(f"Dados obtidos com sucesso:")
        print(f"  - Cidade: {weather_record.city_name}")
        print(f"  - Temperatura: {weather_record.temperature}°C")
        print(f"  - Umidade: {weather_record.humidity}%")
        print(f"  - Descrição: {weather_record.description}")
        
        # Persiste os dados no banco
        print("\n=== Salvando dados no banco ===")
        db = SessionLocal()
        
        try:
            weather_data = WeatherData(
                city_name=weather_record.city_name,
                temperature=weather_record.temperature,
                humidity=weather_record.humidity,
                description=weather_record.description
            )
            
            db.add(weather_data)
            db.commit()
            db.refresh(weather_data)
            
            print(f"Registro salvo com sucesso! ID: {weather_data.id}")
            print(f"Timestamp: {weather_data.timestamp}")
            
        except Exception as e:
            db.rollback()
            raise Exception(f"Erro ao salvar no banco de dados: {e}")
        
        finally:
            db.close()
        
        print("\n=== Ingestão concluída com sucesso! ===")
        return 0
        
    except ValueError as e:
        print(f"\n❌ Erro de validação: {e}", file=sys.stderr)
        return 1
    
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    exit_code = ingest_weather_data()
    sys.exit(exit_code)
