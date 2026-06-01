# GnTechWeather

> Estação de monitoramento ambiental de precisão — desenvolvida como teste técnico para o laboratório de genética **GnTech**.

A aplicação coleta dados climáticos em tempo real via OpenWeather API, persiste no PostgreSQL e os exibe em uma interface construída com React + Tailwind CSS. O design segue o conceito **Laboratory Clarity / Atmospheric Signal**: dados têm textura antes de ter forma.

---

## Demonstração

| Funcionalidade | Descrição |
|---|---|
| Busca com autocomplete | Sugestões em tempo real com prioridade para cidades brasileiras |
| Extração por cidade ou GPS | Coleta dados meteorológicos completos e persiste no banco |
| Mapa de fundo interativo | Mapa-múndi monocromático que anima até a cidade selecionada |
| Mapa local com nuvens | Visualização satelital com camada de nuvens OpenWeather em tempo real |
| Histórico de monitoramento | Todos os registros coletados, ordenados do mais recente |
| Dados completos por coleta | Temperatura, sensação térmica, min/max, umidade, vento, pressão, precipitação |

---

## Início Rápido

**Pré-requisitos:** Docker e Docker Compose instalados.

```bash
# 1. Clone o repositório
git clone https://github.com/pedropompeu/TestGnTech.git
cd TestGnTech

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e insira sua OPENWEATHER_API_KEY

# 3. Suba todos os serviços
docker compose up --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API (Swagger UI) | http://localhost:8000/docs |
| PostgreSQL | localhost:5435 |

> A API Key gratuita da OpenWeather está disponível em [openweathermap.org](https://openweathermap.org/api).

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │   client     │    │     api      │    │    db    │  │
│  │  React/Vite  │───▶│   FastAPI    │───▶│ Postgres │  │
│  │  nginx:80    │    │  uvicorn:8000│    │  :5432   │  │
│  └──────────────┘    └──────────────┘    └──────────┘  │
│         │                   │                           │
│         │            OpenWeather API                    │
│         │           (externo, HTTPS)                    │
└─────────────────────────────────────────────────────────┘
```

### Backend — Camadas

```
app/
├── api/v1/endpoints/   # Routers (controllers) — FastAPI
├── services/           # Lógica de negócio
├── repositories/       # Acesso ao banco (Repository Pattern)
├── models/             # Modelos SQLAlchemy (ORM)
├── schemas/            # Validação de entrada/saída (Pydantic v2)
├── core/               # Configurações, rate limiter
└── db/                 # Engine assíncrona, session factory
```

### Decisões de Arquitetura

**Repository Pattern** — o `WeatherRepository` herda de `BaseRepository[T]`, que implementa `get`, `get_multi`, `create` e `delete_all` de forma genérica. Facilita extensão para novos modelos sem duplicação.

**Async de ponta a ponta** — FastAPI + SQLAlchemy async (`asyncpg`) + `httpx.AsyncClient` para chamadas à OpenWeather API. Nenhuma operação bloqueante no event loop.

**Session com commit/rollback automático** — a dependency `get_db()` faz `commit` ao sucesso e `rollback` em exceção, garantindo consistência sem que os endpoints precisem gerenciar transações manualmente.

**Rate Limiting** — `slowapi` limita endpoints de extração a 10 requisições/minuto por IP, protegendo a cota da API externa.

---

## Stack Completa

| Camada | Tecnologia | Versão |
|---|---|---|
| Backend | FastAPI | 0.104 |
| Runtime | Python | 3.11 |
| ORM | SQLAlchemy (async) | 2.0 |
| Driver DB | asyncpg | 0.29 |
| HTTP Client | httpx | 0.25 |
| Validação | Pydantic v2 | 2.5 |
| Rate Limiting | slowapi | 0.1.9 |
| Banco de Dados | PostgreSQL | 15 |
| Frontend | React + TypeScript | 18 / 5.2 |
| Build Tool | Vite | 5.0 |
| Estilização | Tailwind CSS | 3.3 |
| Mapas | React-Leaflet | 4.2 |
| Gráficos | Recharts | 2.10 |
| Orquestração | Docker Compose | — |

---

## API Reference

Base URL: `http://localhost:8000/api/v1`

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/weather/search?q={query}` | Autocomplete de cidades |
| `POST` | `/weather/extract?city={nome}` | Extrai dados por nome de cidade |
| `POST` | `/weather/extract/geo?lat={}&lon={}` | Extrai dados por coordenadas GPS |
| `GET` | `/weather/history?limit={n}` | Retorna histórico de extrações |
| `DELETE` | `/weather/history` | Limpa todo o histórico |

Documentação interativa completa (Swagger UI) disponível em `/docs`.

<details>
<summary>Exemplo de resposta — POST /weather/extract</summary>

```json
{
  "id": 1,
  "city": "Florianópolis",
  "lat": -27.6146,
  "lon": -48.5012,
  "temperature": 19.0,
  "feels_like": 19.0,
  "temp_min": 18.1,
  "temp_max": 19.6,
  "pressure": 1022,
  "humidity": 79,
  "wind_speed": 1.54,
  "wind_deg": 0,
  "rain_1h": 0.0,
  "description": "algumas nuvens",
  "icon": "02d",
  "extracted_at": "2026-06-01T13:17:35.960490Z"
}
```
</details>

---

## Estrutura de Arquivos

```
TestGnTech/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/weather.py   # Rotas da API
│   │   ├── core/
│   │   │   ├── config.py                 # Settings via Pydantic
│   │   │   └── limiter.py                # Rate limiter (slowapi)
│   │   ├── db/session.py                 # Engine async + get_db()
│   │   ├── models/weather.py             # Modelo SQLAlchemy
│   │   ├── repositories/                 # BaseRepository + WeatherRepository
│   │   ├── schemas/weather.py            # Pydantic schemas
│   │   ├── services/weather_service.py   # Lógica + integração OpenWeather
│   │   └── main.py                       # App FastAPI, CORS, startup
│   ├── Dockerfile
│   └── requirements.txt
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackgroundMap.tsx         # Mapa de fundo interativo (fixed)
│   │   │   ├── WeatherCard.tsx           # Card de dados meteorológicos
│   │   │   └── WeatherMap.tsx            # Mapa local com camada de nuvens
│   │   ├── api/client.ts                 # Axios configurado
│   │   └── App.tsx                       # Estado global e layout
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── package.json
├── brand/
│   ├── design-tokens.css                 # Tokens de design (3 camadas)
│   └── tailwind.config.ts                # Config Tailwind de referência
├── db/
│   └── init.sql                          # Schema inicial do PostgreSQL
├── BRAND.md                              # Sistema de design completo
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## Variáveis de Ambiente

```bash
# .env
DB_USER=gntech
DB_PASSWORD=gntech_pass
DB_NAME=weather_db
OPENWEATHER_API_KEY=sua_chave_aqui   # https://openweathermap.org/api
```

O arquivo `.env` está no `.gitignore` e nunca é versionado. Use `.env.example` como base.

---

## Design System

O projeto possui um sistema de design documentado em `BRAND.md` e `brand/`, seguindo o conceito **Laboratory Clarity / Atmospheric Signal**:

- **Paleta:** BioTeal (`#0D9488`) + Slate frio — sem cores quentes
- **Tipografia:** Inter (UI) + JetBrains Mono (valores de sensor)
- **Tokens:** 3 camadas — Primitivo → Semântico → Componente
- **Superfícies:** 7 tipos definidos (App BG, Surface, Dark Module, Overlay...)
- **Mapa de fundo:** CartoDB/OSM monocromático com `flyTo` animado ao selecionar cidade

---

## Roadmap

Funcionalidades planejadas para próximas iterações:

- [ ] **Gráfico de histórico** — `recharts` (já instalado) com curva de temperatura/umidade por cidade
- [ ] **Previsão 5 dias** — endpoint `/weather/forecast` + `ForecastCard` no frontend
- [ ] **Índice de condição laboratorial** — badge que indica se o ambiente está ideal para experimentos (temp 18–24°C, umidade 40–60%)
