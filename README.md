# Verbex - AI Agent Management Platform

Verbex is a full-stack application designed to provide a seamless platform to build, monitor, and scale AI agents. It features a command center dashboard, multiple backend microservices, and a complete containerized setup for easy deployment.

## Architecture

The application is built on a microservices architecture, with Next.js frontends and Spring Boot backends, all containerized with Docker.


## Local Development Setup
Follow these steps to run the entire application stack on your local machine.

### Prerequisites
- Docker
- Docker Compose

### Step-by-step Instructions
1. Clone the Repository
```bash
git clone https://github.com/mazeduldev/ai-agent-manager.git
```

2. Configure Root Environment
Rename `.env.example` file in the root to `.env`

3. Configure Frontend Environment
Frontend projects are at `/frontends/dashboard` and `/frontends/chatbox` both have `.env.example` files. Rename them to `.env`

4. Do the same for backend projects under `/backends/*` directories.
```
/backends/chat/.env
This file require you OpenAI API Key.
I'm not providing my one here :)
```

5. Build and Run with Docker Compose
From the root directory, run the following command.
```bash
docker-compose up --build
```
This will build all the service images and start the containers.

6. Access the Applications
Once all containers are running, you can access the services at:

- Dashboard: http://localhost:3000
- Chatbox: http://localhost:4000/chat/{agentId}
- Database (PostgreSQL): Connect via port 5432

## API Documentation
Here are some of the key API endpoints available.

I'll update with OpenAPI/Swagger later.

## AI Tools Usage
This project was developed with the extensive use of an AI programming assistant.

- Tool Used:
  - GitHub Copilot
  - Chat GPT
  - Claude

- Estimated Time Saved:
  - 10-12 hours.
  - The AI assistant was instrumental in bootstrapping the entire Docker environment, generating multi-stage Dockerfiles, creating .dockerignore files, writing the docker-compose.yml configuration, debugging container networking issues, and generating this README.md file. This significantly reduced the time spent on configuration and boilerplate code.

- Example of a Helpful Prompt:

  - "This repository has 2 nextjs app at /frontends and 3 spring boot project at /backends. Backend relies on a posgres database. All the backend and forntend projects has their related .env files. At the root of this repository there is another .env file where the postgres user and password is added. Now I need to update this docker-compose file to run everything with one docker-compose up command."

- Challenge Faced & AI Solution:
  - A significant challenge was the "Connection Refused" error between the backend services and the PostgreSQL database. The AI assistant correctly identified that depends_on in Docker Compose only waits for the container to start, not for the application inside to be ready. It proposed the solution of adding a healthcheck to the postgres service and updating the backend services to use depends_on: { condition: service_healthy }, which completely solved the race condition.