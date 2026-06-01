# GnTechWeather — Monitoramento Ambiental

Este projeto é um teste técnico desenvolvido para o laboratório de genética **GnTech**. A aplicação extrai dados da OpenWeather API e os persiste em um banco de dados PostgreSQL, exibindo-os em uma interface React minimalista.

## 🚀 Como Rodar (Kickoff Rápido)

Certifique-se de ter o **Docker** e o **Docker Compose** instalados.

1.  Clone o repositório.
2.  Crie o arquivo `.env` baseado no `.env.example`:
    ```bash
    cp .env.example .env
    ```
3.  Insira sua `OPENWEATHER_API_KEY` no arquivo `.env`.
4.  Suba os containers:
    ```bash
    docker-compose up --build
    ```

Acesse:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Documentação API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🏛️ Arquitetura e Padrões

O projeto segue uma arquitetura modular focada em **Confiabilidade** e **Manutenibilidade**.

### Camadas do Backend (FastAPI):
- **API (Controllers):** Gerencia as rotas e validação de entrada (Pydantic).
- **Service Layer:** Onde reside a lógica de negócio (ex: cálculo de médias, regras de extração).
- **Repository Pattern:** Abstrai o acesso ao banco de dados, facilitando testes e trocas de ORM.

---

## 🐘 Para Desenvolvedores PHP (Rosetta Stone)

Se você vem do mundo **WordPress** ou **Laravel**, aqui está como as coisas se traduzem:

| Conceito PHP | Equivalente neste Projeto (Python) | Por que usamos? |
| :--- | :--- | :--- |
| **WP_REST_Request** | **Pydantic Schemas** | Validação rigorosa de tipos antes da lógica. |
| **Controllers (Laravel)** | **Routers (FastAPI)** | Organização de rotas em módulos independentes. |
| **Eloquent / Repository** | **SQLAlchemy + Repository Pattern** | Mantém a lógica de negócio limpa de SQL ou queries pesadas. |
| **Composer** | **pip / requirements.txt** | Gestão de dependências. |
| **Hooks / Filters** | **FastAPI Dependencies** | Injeção de dependência para db session e auth. |

---

## 🛠️ Stack Tecnológica

- **Backend:** FastAPI (Python 3.11)
- **Banco de Dados:** PostgreSQL 15
- **Frontend:** React + Tailwind CSS
- **Orquestração:** Docker Compose
