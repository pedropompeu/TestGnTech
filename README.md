# Weather API - Sistema de Consulta Climática

API RESTful para consulta e armazenamento de dados climáticos utilizando a OpenWeather API, desenvolvida com FastAPI, PostgreSQL e Docker.

## 📋 Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Execução](#execução)
- [Endpoints da API](#endpoints-da-api)
- [Acesso Remoto](#acesso-remoto)
- [Estrutura do Projeto](#estrutura-do-projeto)

## 🚀 Tecnologias Utilizadas

- **Python 3.10+**: Linguagem principal
- **FastAPI**: Framework web moderno e de alta performance
- **Uvicorn**: Servidor ASGI para FastAPI
- **PostgreSQL**: Banco de dados relacional
- **SQLAlchemy**: ORM para Python
- **Pydantic**: Validação de dados e serialização
- **Docker & Docker Compose**: Conteinerização e orquestração
- **OpenWeather API**: Fonte de dados climáticos

## 🏗️ Arquitetura do Sistema

O sistema é composto por três serviços principais:

1. **db**: Banco de dados PostgreSQL com persistência de dados
2. **init_db**: Serviço de inicialização que cria as tabelas e faz a primeira ingestão de dados
3. **api**: API REST que expõe endpoints para consulta dos dados climáticos

## 📦 Pré-requisitos

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 2.0 ou superior)
- Chave de API da OpenWeather (gratuita em https://openweathermap.org/api)

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd <nome-do-projeto>
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha as variáveis necessárias:

```env
# OpenWeather API Configuration
OPENWEATHER_API_KEY=sua_chave_api_aqui

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=weather_db
DB_USER=postgres
DB_PASSWORD=sua_senha_segura

# Application Configuration
CITY_NAME=Florianópolis
```

**Importante**: Obtenha sua chave de API gratuita em https://openweathermap.org/api

## 🐳 Execução

### Executar com Docker Compose (Recomendado)

```bash
# Inicia todos os serviços
docker-compose up -d

# Visualiza os logs
docker-compose logs -f

# Para os serviços
docker-compose down

# Para os serviços e remove os volumes (apaga os dados)
docker-compose down -v
```

### Executar localmente (Desenvolvimento)

```bash
# Instala as dependências
pip install -r requirements.txt

# Configura o arquivo .env com as credenciais do banco local

# Inicializa o banco de dados
python initialize_db.py

# Executa a ingestão de dados
python ingest_data.py

# Inicia a API
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📡 Endpoints da API

### Health Check

```http
GET /health
```

Verifica se a API está operacional.

**Resposta:**
```json
{
  "status": "API operacional"
}
```

### Consultar Último Registro

```http
GET /api/v1/weather/{city_name}
```

Retorna o registro climático mais recente da cidade especificada.

**Exemplo:**
```bash
curl http://localhost:8000/api/v1/weather/Florianópolis
```

**Resposta:**
```json
{
  "id": 1,
  "city_name": "Florianópolis",
  "temperature": 24.5,
  "humidity": 78,
  "description": "céu limpo",
  "timestamp": "2025-11-18T10:30:00"
}
```

### Consultar Histórico

```http
GET /api/v1/weather/history/{city_name}
```

Retorna todos os registros históricos da cidade especificada, ordenados do mais recente para o mais antigo.

**Exemplo:**
```bash
curl http://localhost:8000/api/v1/weather/history/Florianópolis
```

**Resposta:**
```json
[
  {
    "id": 3,
    "city_name": "Florianópolis",
    "temperature": 24.5,
    "humidity": 78,
    "description": "céu limpo",
    "timestamp": "2025-11-18T10:30:00"
  },
  {
    "id": 2,
    "city_name": "Florianópolis",
    "temperature": 23.8,
    "humidity": 80,
    "description": "nublado",
    "timestamp": "2025-11-18T09:15:00"
  }
]
```

### Documentação Interativa

A API fornece documentação interativa automática:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🌐 Acesso Remoto

Para permitir acesso remoto à API:

### 1. Configuração de Firewall

Certifique-se de que a porta 8000 está aberta no firewall:

```bash
# Ubuntu/Debian
sudo ufw allow 8000/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload
```

### 2. Acesso via IP Público

Se estiver executando em um servidor com IP público:

```bash
curl http://SEU_IP_PUBLICO:8000/health
```

### 3. Usando Nginx como Proxy Reverso (Produção)

Para ambientes de produção, recomenda-se usar Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Usando Túnel (Desenvolvimento)

Para testes rápidos, você pode usar serviços como ngrok:

```bash
ngrok http 8000
```

## 📁 Estrutura do Projeto

```
.
├── src/
│   └── weather_client.py      # Cliente da API OpenWeather
├── db/
│   ├── database.py             # Configuração do SQLAlchemy
│   └── models.py               # Modelos ORM e Pydantic
├── config/                     # Configurações adicionais
├── main.py                     # Aplicação FastAPI
├── initialize_db.py            # Script de inicialização do banco
├── ingest_data.py              # Script de ingestão de dados
├── requirements.txt            # Dependências Python
├── Dockerfile                  # Imagem Docker da aplicação
├── docker-compose.yml          # Orquestração dos serviços
├── .env.example                # Exemplo de variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
└── README.md                   # Este arquivo
```

## 🔄 Fluxo de Execução

1. O Docker Compose inicia o serviço `db` (PostgreSQL)
2. Após o banco estar saudável, o serviço `init_db` executa:
   - Cria as tabelas no banco de dados
   - Faz a primeira ingestão de dados climáticos
3. Após a inicialização bem-sucedida, o serviço `api` é iniciado
4. A API fica disponível na porta 8000

## 🧪 Testando a API

```bash
# Verifica se a API está funcionando
curl http://localhost:8000/health

# Consulta dados de Florianópolis
curl http://localhost:8000/api/v1/weather/Florianópolis

# Consulta histórico
curl http://localhost:8000/api/v1/weather/history/Florianópolis
```

## 📝 Notas Importantes

- A primeira execução pode demorar alguns minutos para baixar as imagens Docker
- O serviço `init_db` executa apenas uma vez e depois encerra
- Os dados são persistidos no volume Docker `postgres_data`
- Para reingestão de dados, execute: `docker-compose run --rm init_db python ingest_data.py`
- A API OpenWeather tem limite de requisições no plano gratuito (60 chamadas/minuto)

## 🐛 Troubleshooting

### Erro de conexão com o banco

Verifique se o serviço do banco está rodando:
```bash
docker-compose ps
docker-compose logs db
```

### Erro de API Key inválida

Verifique se a variável `OPENWEATHER_API_KEY` está corretamente configurada no arquivo `.env`

### Porta 8000 já em uso

Altere a porta no `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Usa porta 8001 no host
```

## 📄 Licença

Este projeto foi desenvolvido como parte de uma avaliação técnica.
