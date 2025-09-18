# Verbex - AI Agent Management Platform

Verbex is a full-stack application designed to provide a seamless platform to build, monitor, and scale AI agents. It features a command center dashboard, multiple backend microservices, and a complete containerized setup for easy deployment.

## Demo video

https://www.loom.com/share/f6d9d35cd1aa47be9a7add68aaa5cb5a?sid=077f3ea8-6ebb-493a-9bd3-49e474a40157

## Architecture

The application is built on a microservices architecture, with Next.js frontends and Spring Boot backends, all containerized with Docker.

![Architecture diagram](https://github.com/mazeduldev/ai-agent-manager/blob/main/ai-agent-manager.jpg)

### Backend Architecture
The backend consists of 4 main microservices:

1. **Auth Service** - Authentication & user management
2. **Agent Service** - AI agent CRUD operations
3. **Chat Service** - Chat & LLM integration
4. **Analytics Service** - Conversation tracking & metrics (*Not implemented yet. But this functionality is integrated into `Chat Service` for now. I'll separate this functionality into a dedicated microservice later.*)

### Frontend Architecture
The frontend consists of 2 individually deployable Next.js projects.

1. **Dashboard** - Landing page, authentication, admin functionality, analytics view.
2. **Chatbox** - Literally the embeddable chat UI only.

### API Gateway Layer
Initially I had a plan to implement Spring Cloud Gateway. But I choose to not doing that. Instead I took leverage of having built-in backend of Next.js projects. Next.js backend is essentially performing the API gateway tasks. Let me explain with some examples.

1. **Routing requests** - I've given individual names to my backend servers, for example *authServer*, *agentServer*, *chatServer*, etc. Then the communication flow happens step by step like this.
    - From the client side when I send a request to the backend, I attach one of these names as a prefix of the path.
    For example: *http://dashboard-app:3000/authServer/auth/login*
    - Next.js middleware (runs securely in backend) forward the request to intended server based on the prefix.
    For example the request in the previous step will be translated and forwarded to: *http://auth-server:8080/auth/login*
2. **Authentication & Refresh token**
    - When users' login request succeeded, the *Auth Server* returns `access_token` and `refresh_token` in the body of the response.
    - Next.js middleware intercepts the response and construct a new response with `Set-Cookie` headers to set secure http-only cookies for the `access_token` and `refresh_token`. Therefore the client side in the browser gets secure tokens inaccessible by javascript, and ensured strong security against hackers.
    - When an authenticated request flows from client to server, same as before the middleware intercepts and move the tokens from cookie to `Authorization` header as a `Bearer` token.
    - Middleware also handle refresh token strategy for a request that is rejected with 401 or 403 response status.

## Run locally for testing
Follow these steps to run the entire application stack on your local machine using docker. (If you just want to check how the app works, then this is your way to go. If you plan to develop and contribute, then follow the "Run for Development and Contribution" section).

### Prerequisites
- Docker
- Docker Compose
- Node.js

### Step-by-step Instructions
1. Clone the Repository.
    ```bash
    git clone https://github.com/mazeduldev/ai-agent-manager.git
    ```

2. Configure environment. All the project directories including the root directory have `.env.example` file. You have to create a `.env` file with similar values. Running the following command will automatically do this for you.
    ```bash
    node ./_scripts/env_init
    ```

3. Prepare environment to run the app in docker container. In docker network `localhost` will not work. Service to service communication must use service names in docker-compose file. So, service URLs in .env files needed to be updated. Run the following command to do this.
    ```bash
    node ./_scripts/env_switcher docker
    ```

4. Very Important: **you must provide your own OpenAI API Key.**
`/backends/chat/.env` file requires OpenAI API Key. I'm not providing my one here :)

5. Build and Run with Docker Compose. Following will build all the service images similar to a production build and start the containers.
    ```bash
    docker-compose -f docker-compose.prod.yml up --build
    ```

6. Access the Applications. Once all containers are running, you can access the services at:
    - Dashboard: http://localhost:3000
    - Chatbox: http://localhost:4000/chat/{agentId}
    - Database (PostgreSQL): Connect via port 5432


## Run for Development and Contribution

1. **Infrastructure**: I strongly suggest using docker-compose only for running the development infrastructure using the following command.

    ```bash
    docker-compose -f docker-compose.yml up -d
    ```

2. **Backend Services**: Import backend Spring Boot projects individually into your preferred IDE for java. My recommendation goes for [Intellij IDEA](https://www.jetbrains.com/idea/). Then run with it's built-in application runner.

3. **Frontend**: Any code editor with support for [Biome](https://biomejs.dev/) should work. I recommend using [vscode](https://code.visualstudio.com/) or [cursor](https://cursor.com/).

#### Alternative option for docker lovers
You can run everything inside docker with hot reload support by running following command. (This is experimental and not recommended.)
```bash
docker-compose -f docker-compose.local.yml up --build
```

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
