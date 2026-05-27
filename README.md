# Learning TODO App

Small full-stack learning project with FastAPI, React, PostgreSQL, Docker Compose, and Playwright.

This app is intentionally simple:
- login with username and password
- see only your own TODO items
- choose a date with a simple date input
- add, edit, and delete TODO items for that date

This is a learning app, not a production security example. The JWT secret and test passwords are simple on purpose so the project is easy to run locally.

## Project tree

```text
.
|-- backend/
|   |-- .env.example
|   |-- app/
|   |   |-- api/
|   |   |   |-- auth.py
|   |   |   `-- todos.py
|   |   |-- core/
|   |   |   |-- config.py
|   |   |   |-- logging_config.py
|   |   |   `-- security.py
|   |   |-- services/
|   |   |   `-- todo_service.py
|   |   |-- __init__.py
|   |   |-- db.py
|   |   |-- dependencies.py
|   |   |-- main.py
|   |   |-- models.py
|   |   `-- schemas.py
|   |-- requirements.txt
|   `-- seed.py
|-- docker/
|   |-- backend/
|   |   |-- Dockerfile
|   |   `-- Dockerfile.dev
|   |-- frontend/
|   |   |-- Dockerfile
|   |   `-- Dockerfile.dev
|   |-- docker-compose.dev.yml
|   `-- docker-compose.yml
|-- frontend/
|   |-- .env.example
|   |-- src/
|   |   |-- api/
|   |   |   `-- client.ts
|   |   |-- components/
|   |   |   |-- LoginForm.tsx
|   |   |   |-- TodoForm.tsx
|   |   |   `-- TodoList.tsx
|   |   |-- lib/
|   |   |   `-- auth.ts
|   |   |-- pages/
|   |   |   |-- LoginPage.tsx
|   |   |   `-- TodoPage.tsx
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   |-- styles.css
|   |   |-- types.ts
|   |   `-- vite-env.d.ts
|   |-- index.html
|   |-- package.json
|   |-- tsconfig.json
|   `-- vite.config.ts
|-- tests/
|   |-- api/
|   |   |-- auth.spec.js
|   |   `-- todos.spec.js
|   |-- helpers/
|   |   `-- auth.js
|   |-- page-objects/
|   |   |-- login-page.js
|   |   `-- todo-page.js
|   |-- ui/
|   |   |-- login.spec.js
|   |   `-- todo-flow.spec.js
|   |-- package.json
|   `-- playwright.config.js
|-- .dockerignore
|-- .gitignore
|-- README.md
`-- README_LEARN.md
```

## Prerequisites

Install these tools:
- Docker Desktop
- WSL2 on Windows
- Node.js
- Python
- PostgreSQL
- pgAdmin optional
- Playwright

## How to install tools

### Docker Desktop

1. Install Docker Desktop from the Docker website.
2. On Windows, enable WSL2 integration in Docker Desktop settings.

### WSL2 on Windows

Run PowerShell as Administrator:

```powershell
wsl --install
```

Restart Windows if needed.

### Node.js

Install the current LTS version from the Node.js website.

### Python

Install Python 3.12 from python.org.

### PostgreSQL

Install PostgreSQL 16.

### pgAdmin

Optional. Install if you want a GUI for the database.

### Playwright

Playwright is installed inside the `tests/` folder. Browser binaries are installed with `npx playwright install`.

## How to check installations

```powershell
node --version
npm --version
python --version
pip --version
docker --version
```

## Test users

Seed script creates these users:

| Username | Password |
|---|---|
| alice | alice123 |
| bob | bob123 |

## Run locally without Docker

### 1. Start PostgreSQL

Make sure PostgreSQL is running.

Simple check:

```powershell
Get-Service postgresql*
```

If the service is running, you should see `Running` in the status column.

### 2. Create database

Open `psql` or pgAdmin and create the database.

Open `psql` example:

```powershell
psql -U postgres -h localhost
```

If `psql` asks for a password, enter your PostgreSQL password.

Create a pgAdmin connection example:

1. Open pgAdmin.
2. Right click `Servers`.
3. Click `Register` -> `Server...`
4. In `General`, enter any name, for example `Local PostgreSQL`.
5. In `Connection`, use host `localhost`, port `5432`, username `postgres`, and your PostgreSQL password.
6. Click `Save`.

Then create the database:

```sql
CREATE DATABASE todo_app;
```

### 3. Configure backend environment

Copy [backend/.env.example](/c:/Users/Neko/source/repos/SmallAppForAutomationTesting/backend/.env.example) to `backend/.env` and keep the default values if you use local PostgreSQL with user `postgres` and password `postgres`.

### 4. Install backend dependencies

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 5. Run backend

```powershell
Set-Location backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI:
- `http://localhost:8000/docs`

### 6. Run seed script

Open a new terminal:

```powershell
Set-Location backend
.\.venv\Scripts\Activate.ps1
python seed.py
```

### 7. Configure frontend environment

Copy [frontend/.env.example](/c:/Users/Neko/source/repos/SmallAppForAutomationTesting/frontend/.env.example) to `frontend/.env`.

### 8. Install frontend dependencies

```powershell
Set-Location frontend
npm install
```

### 9. Run frontend

```powershell
Set-Location frontend
npm run dev
```

Open:
- `http://localhost:5173`

## Run with Docker Compose

Before running Docker commands, make sure Docker Desktop is open and running.

Simple check in `cmd`:

```cmd
docker version
```

If Docker Engine is running, you should see both `Client` and `Server` sections in the output.

### Production-like mode

This mode uses normal app start commands without hot reload.

Run this command from the project root folder, the folder that contains `backend/`, `frontend/`, `tests/`, and `docker/`:

```powershell
docker compose -f docker/docker-compose.yml up --build
```

Open:
- frontend: `http://localhost:3000`
- backend docs: `http://localhost:8000/docs`

Seed data after containers start:

Run this command from the same project root folder:

```powershell
docker compose -f docker/docker-compose.yml exec backend python seed.py
```

### Development mode

This mode has hot reload and debugger ports.

Run this command from the project root folder, the folder that contains `backend/`, `frontend/`, `tests/`, and `docker/`:

```powershell
docker compose -f docker/docker-compose.dev.yml up --build
```

Ports:
- frontend: `5173`
- backend: `8000`
- backend debugger attach: `5678`
- frontend debugger attach: `9229`
- postgres: `5432`

Seed data in development mode:

Run this command from the same project root folder:

```powershell
docker compose -f docker/docker-compose.dev.yml exec backend python seed.py
```

## VS Code debugger setup

Debug launch settings are already added in [.vscode/launch.json](/c:/Users/Neko/source/repos/SmallAppForAutomationTesting/.vscode/launch.json).

Useful configs:
- `Backend: Local`
- `Backend: Attach Docker`
- `Frontend: Chrome`
- `Frontend: Attach Docker`

## Run Playwright tests

Start frontend and backend first.

Then:

```powershell
Set-Location tests
npm install
npx playwright install
npm test
```

Only API tests:

```powershell
Set-Location tests
npm run test:api
```

Only UI tests:

```powershell
Set-Location tests
npm run test:ui
```

## Common problems and fixes

### Port already in use

Stop the other app using the port, or change the port in the run command or compose file.

### Frontend cannot call backend

Check these values:
- backend is running on port `8000`
- `VITE_API_BASE_URL` is correct
- backend `CORS_ORIGINS` contains your frontend URL

### Login fails for seed users

Run the seed script again:

```powershell
Set-Location backend
python seed.py
```

### PostgreSQL connection fails

Check:
- PostgreSQL service is running
- database `todo_app` exists
- username and password match `DATABASE_URL`

### Playwright browser is missing

Run:

```powershell
Set-Location tests
npx playwright install
```