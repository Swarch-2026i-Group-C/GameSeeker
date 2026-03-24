# GameSeeker

GameSeeker is a web application designed to help gamers find the best prices for their favorite games across multiple digital storefronts (Steam, Epic Games, GOG, etc.) and manage a centralized wishlist. 

This project is built using a **Microservices Architecture** to ensure scalability, modularity, and separation of concerns.

## 🏗️ Architecture Overview

The system is composed of four main services and two backing services orchestrated via Docker Compose:

1. **User Service** (`/user-service`):
   - Handles user authentication, session management, and the user's personal wishlist.
   - Built with **Node.js, Hono, Prisma, and PostgreSQL**.
   - Exposes REST APIs documented via **Swagger (OpenAPI)**.

2. **Scraper Service** (`/scrapper-service`):
   - Responsible for scraping real-time game prices from various digital stores, comparing them, and finding trending games.
   - Built with **Python and Flask**.

3. **Gateway Service** (`/gateway-service`):
   - Single entry point for all client traffic. Proxies requests to `user-service` and `scrapper-service`, and validates sessions before forwarding protected routes.
   - Built with **TypeScript and Hono**. Listens on port **8080**.

4. **Frontend Service** (`/frontend-service`):
   - Web application that provides the user-facing UI for searching games, comparing prices, and managing wishlists.
   - Built with **Next.js 15, TypeScript, and Shadcn/ui**. Communicates exclusively with `gateway-service`.

5. **Backing Services**:
   - **PostgreSQL**: Primary relational database for the `user-service`.
   - **RabbitMQ**: Message broker used for asynchronous communication and background task queues (e.g., passing scraped trending games data).

## 🚀 Getting Started

The entire application environment is containerized. You do not need to install Node or Python locally to run the backing services and APIs.

### Prerequisites
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running the Application

To build and start all microservices and databases simultaneously, open your terminal at the root of the project and run:

```bash
docker compose up --build -d
```

This will automatically:
1. Initialize the **PostgreSQL** database.
2. Initialize **RabbitMQ**.
3. Build and launch the **Scraper Service**.
4. Build and launch the **User Service** (waiting for the database to be ready).

To stop the environment, run:
```bash
docker compose down
```

## 🌐 Exposed Ports & Services

Once the Docker Compose environment is running, the following services will be available:

| Service | Address | Description |
|---------|---------|-------------|
| **Frontend** | `http://localhost:3000` | Next.js web application. |
| **Gateway API** | `http://localhost:8080` | Single entry point for frontend. Proxies auth + games + wishlist. |
| **User Service API** | `http://localhost:4000` | Main API for Auth & Wishlists. |
| **User Service Docs** | `http://localhost:4000/ui` | Interactive Swagger UI documentation. |
| **Scraper Service** | `http://localhost:5000` | Game price comparison and search endpoints. |
| **RabbitMQ UI** | `http://localhost:15672` | Message broker management dashboard (guest/guest). |
| **PostgreSQL** | `localhost:5432` | Direct database connection access. |

## 🧪 Testing

Both microservices include a `requests.http` file at their respective roots. If you are using an IDE like VSCode with the **REST Client** extension, you can easily open these files to fire HTTP requests directly against your local environment to test all available endpoints.

---

*Developed as part of the Software Architecture course (Universidad Nacional de Colombia).*
