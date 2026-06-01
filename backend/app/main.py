from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.core.limiter import limiter
from app.api.v1.endpoints import weather
from app.db.session import engine, Base
import logging

# Configuração de Logs para vermos erros no terminal do Docker
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.2",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para capturar erros 500 e ainda assim retornar CORS (ajuda no debug)
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        logger.error(f"Erro Crítico: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Erro interno no laboratório climático", "msg": str(exc)},
            headers={
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Credentials": "true",
            }
        )

@app.on_event("startup")
async def init_tables():
    logger.info("Iniciando criação de tabelas no banco de dados...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Tabelas verificadas/criadas com sucesso.")

app.include_router(weather.router, prefix=f"{settings.API_V1_STR}/weather", tags=["Weather"])

@app.get("/")
async def root():
    return {"status": "Laboratory Clarity - Fix Applied"}
