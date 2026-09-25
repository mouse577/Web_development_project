# Taskagotchi: Productivity Web App

Taskagotchi is a team-built productivity application that combines task management with an interactive 3D game interface. The repository contains a React/TypeScript frontend and a Flask/PostgreSQL backend.

## What the project includes

- Account, task, avatar, inventory, and game-interface components
- A Flask API with SQLAlchemy models and database migrations
- Frontend component and hook tests, plus backend tests for users, tasks, wallets, transactions, avatars, and customization
- Docker configuration for the backend's Flask, PostgreSQL, and pgAdmin development services

## My contribution

I worked on the Flask backend and its unit tests. My contributions included backend functionality for the application's data and API workflows, along with tests covering users, tasks, wallets, transactions, avatar features, and customization. This is a team project; the frontend and other work represent contributions from the broader team.

## Repository structure

| Directory | Contents |
| --- | --- |
| [`productivity-frontend/`](productivity-frontend/) | React/TypeScript application, Vite configuration, 3D assets, and frontend tests |
| [`productivity-backend/`](productivity-backend/) | Flask API, models, migrations, Docker configuration, and backend tests |

## Local development

The two components have separate setup instructions in their own READMEs:

1. Follow the [backend setup guide](productivity-backend/README.md). Copy `productivity-backend/.env.example` to a local `.env` and configure local development values. The Docker setup uses Flask, PostgreSQL, and pgAdmin.
2. Follow the [frontend setup guide](productivity-frontend/README.md). From `productivity-frontend/`, install dependencies with `npm install` and run `npm run dev`.
3. Run frontend tests with `npm test`; see the backend README and Makefile for its test commands.

The example environment files document configuration keys. Actual credentials and local `.env` files should remain outside the repository. This README describes the source and setup; it does not claim a live deployment.

