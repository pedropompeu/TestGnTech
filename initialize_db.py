import os
from dotenv import load_dotenv
from db.database import engine, Base
from db.models import WeatherData

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

def initialize_database():
    """
    Cria todas as tabelas definidas nos modelos ORM.
    """
    print("Inicializando banco de dados...")
    print(f"Conectando ao banco: {os.environ.get('DB_NAME', 'weather_db')}")
    
    # Cria todas as tabelas
    Base.metadata.create_all(bind=engine)
    
    print("Tabelas criadas com sucesso!")

if __name__ == "__main__":
    initialize_database()
