# Weather API - Sistema de Consulta Climática

> **Avaliação Técnica**: Sistema completo de extração, armazenamento e consulta de dados climáticos via API RESTful

API desenvolvida com FastAPI para consulta de dados climáticos da OpenWeather API, com armazenamento em PostgreSQL e ambiente totalmente conteinerizado com Docker.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Executar](#como-executar)
- [Documentação da API](#documentação-da-api)
- [Acesso Remoto](#acesso-remoto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Testes e Validação](#testes-e-validação)
- [Troubleshooting](#troubleshooting)

---

## 📖 Sobre o Projeto

Este projeto foi desenvolvido como parte de uma avaliação técnica para demonstrar competências em:

- ✅ **Extração de dados via API** (OpenWeather API)
- ✅ **Armazenamento em banco de dados relacional** (PostgreSQL)
- ✅ **Desenvolvimento de API RESTful** (FastAPI)
- ✅ **Conteinerização com Docker** (Docker Compose)
- ✅ **Controle de versão** (Git/GitHub)
- ✅ **Documentação técnica** (Swagger/ReDoc)

O sistema realiza a extração automática de dados climáticos de cidades via OpenWeather API, armazena em banco de dados PostgreSQL e disponibiliza endpoints REST para consulta dos dados históricos.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Python 3.10+** - Linguagem de programação
- **FastAPI** - Framework web moderno e de alta performance
- **Uvicorn** - Servidor ASGI para aplicações assíncronas
- **Pydantic** - Validação de dados e serialização

### Banco de Dados
- **PostgreSQL 15** - Banco de dados relacional
- **SQLAlchemy** - ORM (Object-Relational Mapping)
- **psycopg2** - Adaptador PostgreSQL para Python

### Infraestrutura
- **Docker** - Conteinerização de aplicações
- **Docker Compose** - Orquestração de múltiplos containers

### Integração
- **OpenWeather API** - Fonte de dados climáticos em tempo real
- **Requests** - Cliente HTTP para Python
- **python-dotenv** - Gerenciamento de variáveis de ambiente

---

## ⚡ Funcionalidades

### 1. Extração de Dados
- Requisições GET à OpenWeather API
- Parâmetros dinâmicos (cidade, unidades, idioma)
- Autenticação via API Key
- Tratamento robusto de erros (timeout, 404, 401)
- Normalização e validação de dados

### 2. Armazenamento
- Persistência em PostgreSQL
- Tabela estruturada com índices otimizados
- Timestamps automáticos
- Suporte a múltiplas cidades
- Histórico completo de registros

### 3. API RESTful
- Endpoints para consulta de dados
- Documentação automática (Swagger UI)
- Validação de entrada/saída com Pydantic
- Respostas padronizadas em JSON
- Tratamento de erros HTTP

### 4. Conteinerização
- Ambiente Docker completo
- Orquestração com Docker Compose
- Volumes para persistência de dados
- Health checks automáticos
- Rede isolada para comunicação entre serviços

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐
│   Cliente HTTP  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│   FastAPI       │◄────►│   PostgreSQL     │
│   (Container)   │      │   (Container)    │
└────────┬────────┘      └──────────────────┘
         │
         ▼
┌─────────────────┐
│ OpenWeather API │
└─────────────────┘
```

### Componentes:

1. **db (PostgreSQL)**
   - Banco de dados relacional
   - Volume persistente para dados
   - Health check configurado
   - Porta 5432 exposta

2. **init_db (Inicialização)**
   - Cria estrutura do banco
   - Executa primeira ingestão de dados
   - Executa uma única vez
   - Valida conexões

3. **api (FastAPI)**
   - Servidor web REST
   - Documentação automática
   - Porta 8000 exposta
   - Conexão com banco e API externa

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker** (versão 20.10 ou superior)
  - [Instalação Docker](https://docs.docker.com/get-docker/)
  
- **Docker Compose** (versão 2.0 ou superior)
  - [Instalação Docker Compose](https://docs.docker.com/compose/install/)

- **Chave de API da OpenWeather** (gratuita)
  - [Criar conta e obter API Key](https://openweathermap.org/api)

### Verificar instalação:

```bash
docker --version
docker-compose --version
```

---

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/pedropompeu/TestGnTech
cd weather-api
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# OpenWeather API Configuration
OPENWEATHER_API_KEY=sua_chave_api_completa_aqui

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=weather_db
DB_USER=postgres
DB_PASSWORD=postgres123

# Application Configuration
CITY_NAME=Florianópolis
```

**⚠️ IMPORTANTE**: 
- Obtenha sua chave de API gratuita em: https://openweathermap.org/api
- A chave pode levar alguns minutos para ser ativada após o cadastro
- Não compartilhe sua chave de API publicamente

### 3. Estrutura de arquivos necessária

Certifique-se de que os seguintes arquivos existem:
- `.env` (criado no passo anterior)
- `docker-compose.yml`
- `Dockerfile`
- `requirements.txt`

---

## 🐳 Como Executar

### Opção 1: Docker Compose

#### Iniciar todos os serviços:

```bash
docker-compose up -d
```

Este comando irá:
1. Baixar as imagens necessárias (primeira vez)
2. Construir a imagem da aplicação
3. Iniciar o PostgreSQL
4. Criar as tabelas no banco
5. Fazer a primeira ingestão de dados
6. Iniciar a API

#### Verificar status dos serviços:

```bash
docker-compose ps
```

Saída esperada:
```
NAME          STATUS                   PORTS
weather_api   Up                       0.0.0.0:8000->8000/tcp
weather_db    Up (healthy)             0.0.0.0:5432->5432/tcp
```

#### Visualizar logs:

```bash
# Todos os serviços
docker-compose logs -f

# Apenas a API
docker-compose logs -f api

# Apenas o banco
docker-compose logs -f db
```

#### Parar os serviços:

```bash
# Parar sem remover dados
docker-compose down

# Parar e remover volumes (apaga dados do banco)
docker-compose down -v
```

### Opção 2: Execução Local (Desenvolvimento)

#### 1. Criar ambiente virtual:

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

#### 2. Instalar dependências:

```bash
pip install -r requirements.txt
```

#### 3. Configurar banco de dados local:

Certifique-se de ter PostgreSQL instalado e rodando localmente, então ajuste o `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=weather_db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

#### 4. Inicializar banco e ingerir dados:

```bash
python initialize_db.py
python ingest_data.py
```

#### 5. Iniciar a API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📡 Documentação da API

### Acesso à Documentação Interativa

Após iniciar a aplicação, acesse:

- **Swagger UI** (interface interativa): http://localhost:8000/docs
- **ReDoc** (documentação alternativa): http://localhost:8000/redoc

### Endpoints Disponíveis

#### 1. Health Check

Verifica se a API está operacional.

```http
GET /health
```

**Exemplo de requisição:**
```bash
curl http://localhost:8000/health
```

**Resposta (200 OK):**
```json
{
  "status": "API operacional"
}
```

---

#### 2. Consultar Último Registro

Retorna o registro climático mais recente de uma cidade.

```http
GET /api/v1/weather/{city_name}
```

**Parâmetros:**
- `city_name` (path) - Nome da cidade (ex: Florianópolis, São Paulo)

**Exemplo de requisição:**
```bash
curl http://localhost:8000/api/v1/weather/Florianópolis
```

**Resposta (200 OK):**
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

**Resposta de erro (404 Not Found):**
```json
{
  "detail": "Nenhum registro encontrado para a cidade 'CidadeInexistente'"
}
```

---

#### 3. Consultar Histórico Completo

Retorna todos os registros históricos de uma cidade, ordenados do mais recente para o mais antigo.

```http
GET /api/v1/weather/history/{city_name}
```

**Parâmetros:**
- `city_name` (path) - Nome da cidade

**Exemplo de requisição:**
```bash
curl http://localhost:8000/api/v1/weather/history/Florianópolis
```

**Resposta (200 OK):**
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

---

### Testando com diferentes ferramentas

#### cURL:
```bash
curl -X GET "http://localhost:8000/api/v1/weather/Florianópolis" -H "accept: application/json"
```

#### HTTPie:
```bash
http GET http://localhost:8000/api/v1/weather/Florianópolis
```

#### Python (requests):
```python
import requests

response = requests.get("http://localhost:8000/api/v1/weather/Florianópolis")
data = response.json()
print(data)
```

#### JavaScript (fetch):
```javascript
fetch('http://localhost:8000/api/v1/weather/Florianópolis')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 🌐 Acesso Remoto

### 1. Configuração de Firewall

Para permitir acesso externo à API, abra a porta 8000:

#### Ubuntu/Debian:
```bash
sudo ufw allow 8000/tcp
sudo ufw reload
sudo ufw status
```

#### CentOS/RHEL:
```bash
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

### 2. Acesso via IP Público

Se estiver executando em um servidor com IP público:

```bash
# Descobrir seu IP público
curl ifconfig.me

# Testar acesso remoto
curl http://SEU_IP_PUBLICO:8000/health
```

### 3. Usando Nginx como Proxy Reverso (Produção)

Para ambientes de produção, recomenda-se usar Nginx:

#### Instalar Nginx:
```bash
sudo apt update
sudo apt install nginx
```

#### Configurar proxy reverso:
```bash
sudo nano /etc/nginx/sites-available/weather-api
```

Adicione a configuração:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ativar e reiniciar:
```bash
sudo ln -s /etc/nginx/sites-available/weather-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Usando Túnel para Testes (ngrok)

Para testes rápidos sem configuração de servidor:

```bash
# Instalar ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin

# Criar túnel
ngrok http 8000
```

Você receberá uma URL pública temporária.

---

## 📁 Estrutura do Projeto

```
weather-api/
│
├── src/                          # Código fonte da aplicação
│   └── weather_client.py         # Cliente da API OpenWeather
│
├── db/                           # Módulo de banco de dados
│   ├── database.py               # Configuração SQLAlchemy e conexão
│   └── models.py                 # Modelos ORM e Pydantic
│
├── config/                       # Configurações adicionais
│
├── main.py                       # Aplicação FastAPI (endpoints)
├── initialize_db.py              # Script de inicialização do banco
├── ingest_data.py                # Script de ingestão de dados
│
├── requirements.txt              # Dependências Python
├── Dockerfile                    # Imagem Docker da aplicação
├── docker-compose.yml            # Orquestração dos serviços
│
├── .env                          # Variáveis de ambiente (não versionado)
├── .env.example                  # Exemplo de variáveis de ambiente
├── .gitignore                    # Arquivos ignorados pelo Git
│
└── README.md                     # Documentação do projeto
```

### Descrição dos Arquivos Principais

#### `src/weather_client.py`
Cliente para interação com a OpenWeather API. Contém:
- Classe `OpenWeatherClient`
- Método `get_current_weather(city_name)`
- Tratamento de erros HTTP
- Normalização de dados

#### `db/database.py`
Configuração do banco de dados. Contém:
- Engine do SQLAlchemy
- SessionLocal para gerenciar sessões
- URL de conexão com PostgreSQL
- Base declarativa para modelos ORM

#### `db/models.py`
Modelos de dados. Contém:
- `WeatherData` (modelo ORM SQLAlchemy)
- `WeatherRecord` (modelo Pydantic para validação)
- Definição da tabela `weather_data`

#### `main.py`
Aplicação FastAPI. Contém:
- Configuração da aplicação
- Definição dos endpoints REST
- Dependência `get_db()` para sessões
- Documentação automática

---

## 🗄️ Banco de Dados

### Estrutura da Tabela `weather_data`

```sql
CREATE TABLE weather_data (
    id INTEGER PRIMARY KEY,
    city_name VARCHAR NOT NULL,
    temperature FLOAT NOT NULL,
    humidity INTEGER NOT NULL,
    description VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX ix_weather_data_id ON weather_data (id);
CREATE INDEX ix_weather_data_city_name ON weather_data (city_name);
```

### Campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária (auto-incremento) |
| `city_name` | VARCHAR | Nome da cidade |
| `temperature` | FLOAT | Temperatura em graus Celsius |
| `humidity` | INTEGER | Umidade relativa do ar (%) |
| `description` | VARCHAR | Descrição do clima |
| `timestamp` | TIMESTAMP | Data/hora do registro |

### Acessar o banco diretamente:

```bash
# Via Docker
docker exec -it weather_db psql -U postgres -d weather_db

# Consultas SQL
SELECT * FROM weather_data;
SELECT * FROM weather_data WHERE city_name = 'Florianópolis';
SELECT COUNT(*) FROM weather_data;
```

---

## 🧪 Testes e Validação

### 1. Verificar se os serviços estão rodando:

```bash
docker-compose ps
```

### 2. Testar health check:

```bash
curl http://localhost:8000/health
```

Resposta esperada: `{"status":"API operacional"}`

### 3. Testar consulta de dados:

```bash
curl http://localhost:8000/api/v1/weather/Florianópolis
```

### 4. Testar histórico:

```bash
curl http://localhost:8000/api/v1/weather/history/Florianópolis
```

### 5. Adicionar novos dados:

```bash
docker-compose run --rm init_db python ingest_data.py
```

### 6. Verificar logs:

```bash
# Logs da API
docker-compose logs api

# Logs do banco
docker-compose logs db
```

### 7. Acessar documentação interativa:

Abra no navegador: http://localhost:8000/docs

---

## 🐛 Troubleshooting

### Problema: Erro de conexão com o banco

**Sintoma:**
```
connection to server at "db" failed
```

**Solução:**
```bash
# Verificar se o banco está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Reiniciar serviços
docker-compose restart
```

---

### Problema: API Key inválida

**Sintoma:**
```
❌ Erro de validação: Chave de API inválida
```

**Solução:**
1. Verifique se a chave está completa no `.env`
2. Aguarde alguns minutos após criar a conta (ativação)
3. Teste a chave diretamente:
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Florianopolis&appid=SUA_CHAVE&units=metric"
```

---

### Problema: Porta 8000 já em uso

**Sintoma:**
```
Error starting userland proxy: bind: address already in use
```

**Solução:**
```bash
# Descobrir o processo usando a porta
sudo lsof -i :8000

# Matar o processo
sudo kill -9 PID

# Ou alterar a porta no docker-compose.yml
ports:
  - "8001:8000"
```

---

### Problema: Volumes com dados antigos

**Sintoma:**
Dados inconsistentes ou erros de migração

**Solução:**
```bash
# Parar e remover volumes
docker-compose down -v

# Reconstruir e iniciar
docker-compose up --build -d
```

---

## 📊 Fluxo de Execução

```
1. docker-compose up
   │
   ├─► Inicia PostgreSQL (db)
   │   └─► Health check (aguarda estar pronto)
   │
   ├─► Executa init_db
   │   ├─► Cria tabelas
   │   └─► Faz primeira ingestão
   │
   └─► Inicia API (api)
       └─► Disponibiliza endpoints na porta 8000
```

---

## 📝 Notas Importantes

- ⏱️ A primeira execução pode demorar alguns minutos para baixar as imagens Docker
- 🔄 O serviço `init_db` executa apenas uma vez e depois encerra (comportamento esperado)
- 💾 Os dados são persistidos no volume Docker `postgres_data`
- 🔁 Para nova ingestão: `docker-compose run --rm init_db python ingest_data.py`
- ⚡ A API OpenWeather tem limite de 60 chamadas/minuto no plano gratuito
- 🔐 Nunca commite o arquivo `.env` com suas credenciais reais
- 📦 O `.gitignore` já está configurado para ignorar arquivos sensíveis

---

## 📄 Licença

Este projeto foi desenvolvido como parte de uma avaliação técnica para a vaga de Desenvolvedor(a) Júnior em Sistemas.

---

**Desenvolvido com ❤️ para a avaliação técnica GnTech Exames**
