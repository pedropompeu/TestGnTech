import httpx
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.repositories.weather_repo import WeatherRepository

class WeatherService:
    BR_CORE_CITIES = [
        "São Paulo", "Rio de Janeiro", "Brasília", "Fortaleza", "Salvador",
        "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia",
        "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís",
        "São Gonçalo", "Maceió", "Duque de Caxias", "Natal", "Teresina",
        "São Bernardo do Campo", "Campo Grande", "João Pessoa", "Jaboatão dos Guararapes",
        "Osasco", "Santo André", "Uberlândia", "Sorocaba", "Ribeirão Preto",
        "São José dos Campos", "Cuiabá", "Aracaju", "Feira de Santana", "Joinville",
        "Londrina", "Niterói", "Aparecida de Goiânia", "Porto Velho", "Ananindeua",
        "Serra", "Caxias do Sul", "Macapá", "Florianópolis", "Vila Velha", "Mauá",
        "São João de Meriti", "São José do Rio Preto", "Mogi das Cruzes", "Betim", "Santos",
        "Palhoça", "Pelotas", "Blumenau", "Canoas", "Vitória", "Bauru", "Cascavel",
        "Gramado", "Canela", "Itajaí", "Balneário Camboriú", "Chapecó"
    ]

    def __init__(self, db: AsyncSession):
        self.repo = WeatherRepository(db)

    async def _fetch_from_api(self, params: dict):
        try:
            params.update({
                "appid": settings.OPENWEATHER_API_KEY,
                "units": "metric",
                "lang": "pt_br"
            })
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{settings.OPENWEATHER_BASE_URL}/weather",
                    params=params,
                    timeout=10
                )

            if response.status_code == 401:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="API Key inválida")
            if response.status_code == 404:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Localização não encontrada")

            response.raise_for_status()
            data = response.json()

            weather_in = {
                "city": data.get("name", "Localização Remota"),
                "lat": data["coord"]["lat"],
                "lon": data["coord"]["lon"],
                "temperature": data["main"]["temp"],
                "feels_like": data["main"].get("feels_like"),
                "temp_min": data["main"].get("temp_min"),
                "temp_max": data["main"].get("temp_max"),
                "pressure": data["main"].get("pressure"),
                "humidity": data["main"]["humidity"],
                "wind_speed": data["wind"].get("speed"),
                "wind_deg": data["wind"].get("deg"),
                "rain_1h": data.get("rain", {}).get("1h", 0),
                "description": data["weather"][0]["description"],
                "icon": data["weather"][0]["icon"]
            }

            return await self.repo.create(weather_in)

        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Erro de conexão com satélite: {str(e)}"
            )

    async def search_cities(self, query: str, limit: int = 5):
        try:
            q = query.strip().lower()
            geo_url = "https://api.openweathermap.org/geo/1.0/direct"

            local_matches = [
                {"name": c, "country": "BR", "state": "Brasil", "local": True}
                for c in self.BR_CORE_CITIES if c.lower().startswith(q)
            ]

            params = {"q": query, "limit": 20, "appid": settings.OPENWEATHER_API_KEY}
            async with httpx.AsyncClient() as client:
                res = await client.get(geo_url, params=params, timeout=5)
            api_results = res.json() if isinstance(res.json(), list) else []

            def get_priority(item):
                if item.get("local"): return -2
                if item.get("country") == "BR": return -1
                return 0

            combined = local_matches + api_results
            seen = set()
            final_dedup = []
            for item in sorted(combined, key=get_priority):
                key = (item["name"].lower(), item["country"])
                if key not in seen:
                    final_dedup.append(item)
                    seen.add(key)
            return final_dedup[:limit]
        except Exception:
            return []

    async def get_forecast(self, city: str):
        try:
            params = {
                "q": city,
                "appid": settings.OPENWEATHER_API_KEY,
                "units": "metric",
                "lang": "pt_br",
                "cnt": 40,
            }
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.openweathermap.org/data/2.5/forecast",
                    params=params,
                    timeout=10
                )
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Localização não encontrada")
            response.raise_for_status()
            items = response.json().get("list", [])

            days: dict = {}
            weekday_names = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
            for item in items:
                from datetime import datetime, timezone
                dt = datetime.fromtimestamp(item["dt"], tz=timezone.utc)
                date_key = dt.strftime("%Y-%m-%d")
                if date_key not in days:
                    days[date_key] = {
                        "date": dt.strftime("%d/%m"),
                        "weekday": weekday_names[dt.weekday()],
                        "temps": [],
                        "humidities": [],
                        "descriptions": [],
                        "icons": [],
                    }
                days[date_key]["temps"].append(item["main"]["temp"])
                days[date_key]["humidities"].append(item["main"]["humidity"])
                days[date_key]["descriptions"].append(item["weather"][0]["description"])
                days[date_key]["icons"].append(item["weather"][0]["icon"])

            result = []
            for day in list(days.values())[:5]:
                result.append({
                    "date": day["date"],
                    "weekday": day["weekday"],
                    "temp_min": round(min(day["temps"]), 1),
                    "temp_max": round(max(day["temps"]), 1),
                    "humidity": round(sum(day["humidities"]) / len(day["humidities"])),
                    "description": day["descriptions"][len(day["descriptions"]) // 2],
                    "icon": day["icons"][len(day["icons"]) // 2],
                })
            return result
        except HTTPException:
            raise
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Erro de conexão: {str(e)}")

    async def extract_by_city(self, city: str):
        return await self._fetch_from_api({"q": city})

    async def extract_by_geo(self, lat: float, lon: float):
        return await self._fetch_from_api({"lat": lat, "lon": lon})

    async def get_history(self, limit: int = 20):
        return await self.repo.get_multi(limit=limit)

    async def clear_history(self):
        await self.repo.delete_all()
        return {"status": "ok", "message": "Estação limpa com sucesso"}
