import os
import requests
from db.models import WeatherRecord


class OpenWeatherClient:
    """
    Cliente para interagir com a API OpenWeather.
    """
    
    def __init__(self):
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"
        self.api_key = os.environ.get("OPENWEATHER_API_KEY")
        
        if not self.api_key:
            raise ValueError("OPENWEATHER_API_KEY não encontrada nas variáveis de ambiente")
    
    def get_current_weather(self, city_name: str) -> WeatherRecord:
        """
        Busca os dados climáticos atuais de uma cidade.
        
        Args:
            city_name: Nome da cidade para consulta
            
        Returns:
            WeatherRecord: Objeto Pydantic com os dados normalizados
            
        Raises:
            requests.exceptions.RequestException: Erro na requisição HTTP
            ValueError: Erro ao processar a resposta da API
        """
        # Constrói a URL com parâmetros dinâmicos
        params = {
            "q": city_name,
            "appid": self.api_key,
            "units": "metric",
            "lang": "pt_br"
        }
        
        try:
            # Faz a requisição GET
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            
            # Processa a resposta JSON
            data = response.json()
            
            # Extrai e normaliza os campos relevantes
            weather_record = WeatherRecord(
                city_name=data["name"],
                temperature=data["main"]["temp"],
                humidity=data["main"]["humidity"],
                description=data["weather"][0]["description"]
            )
            
            return weather_record
            
        except requests.exceptions.HTTPError as e:
            if response.status_code == 404:
                raise ValueError(f"Cidade '{city_name}' não encontrada")
            elif response.status_code == 401:
                raise ValueError("Chave de API inválida")
            else:
                raise ValueError(f"Erro HTTP {response.status_code}: {e}")
        
        except requests.exceptions.RequestException as e:
            raise ValueError(f"Erro ao conectar com a API OpenWeather: {e}")
        
        except (KeyError, IndexError) as e:
            raise ValueError(f"Erro ao processar resposta da API: {e}")
