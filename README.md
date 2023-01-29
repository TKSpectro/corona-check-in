# corona-check-in

This is a simple web app to check in to a location and check out of a location. It is designed to be used in a COVID-19 contact tracing scenario.

## General

We use Nx to manage the monorepo. The web app is built with Angular and the backend is built with NestJS.
The backend consists of a gateway and multiple microservices. The gateway is responsible for authentication and authorization. The microservices are responsible for the business logic.

The file structure is as follows:

```bash
apps/
├── frontend/ # Angular Webapp
├── gateway/ # NestJS Gateway
├── incidence-service # NestJS Microservice
├── qr-code-service # NestJS Microservice
├── room-service # NestJS Microservice
└── session-service # NestJS Microservice
libs/
└── micro-service-shared # Shared code between microservices (e.g. Custom Pagination, RPC Exception Wrapper, Base Environment)
```

## Installation

### With Docker Production Setup

:warning: **If you are using Docker Desktop (Windows/macOS)**: You need to add the root directory of this project to the shared directories in the Docker Desktop settings. Otherwise the docker containers will not be able to access the pre=configured grafana files. The settings can be found in the Docker Desktop settings under Resources -> File Sharing.

```bash
cp .env.example .env
# If you want pre-generated data, set SEEDING_ENABLED=true in the .env file

# Build the docker images
npm run docker:prod:build

# Run the docker containers (docker-compose.prod.yml)
npm run docker:prod
```

Webapp (Angular) is available at <http://localhost:8080>
Backend (NestJS Gateway) is available at <http://localhost:3333>

Prometheus is available at <http://localhost:9090>
Grafana is available at <http://localhost:3000>

Grafana Login is admin/admin

### Without Docker Production Setup (Should be used for development as well)

```bash
cp .env.example .env
# If you want pre-generated data, set SEEDING_ENABLED=true in the .env file

# Install dependencies
npm install

# Start postgres + redis. Either run them locally for yourself or use docker-compose
docker-compose up -d

# Start App + Backend (Gateway + Microservices)
npm run start:all

# Start Backend only (Gateway + Microservices)
npm run start:backend
```

## Technologies

- Docker
- Docker Compose

### Backend

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)

### Frontend

- [Angular](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [ngx-translate]()
- [@swimlane/ngx-charts](https://swimlane.gitbook.io/ngx-charts/)
- [@zxing (QR Code Scanner)]()

## Continuous Integration | Continuous Deployment

We use GitHub Actions to run linting and unit tests on every push (on master) and on every push in a pull request.
Pull requests are only allowed to be merged if the tests are successful.

Also we use Vercel to get quick deploys of the web app on every push to master.
It will also produce a preview deploy for commit in every pull request.

The pipeline is defined in [.github/workflows/ci.yml](.github/workflows/ci.yml)

We extensively use the nx affected command to only run tests and linting for the currently changed code. To save time and resources.

## Monitoring

We are using Prometheus and Grafana to get metrics about the backend (micro-services) and display some nice graphs.

The most important one is the list for every service and its current status (online/offline)

To get these metrics we have implemented health check via NestJS and Terminus.

![Grafana Dashboard](/docs/grafana-dashboard.png)
