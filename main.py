from fastapi import FastAPI
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

# Cria a aplicação FastAPI
app = FastAPI(
    title="Weather API",
    description="API para consulta de dados climáticos",
    version="1.0.0"
)


@app.get("/health")
def health_check():
    """
    Endpoint de verificação de saúde da API.
    """
    return {"status": "API operacional"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
