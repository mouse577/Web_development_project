# Define environment variables
ENV_FILE=.env
DOCKER_COMPOSE=docker compose --env-file $(ENV_FILE) -f ./docker-compose.yml

# This just indicates that these words aren't files, theyre commands
.PHONY: up down logs start stop restart rebuild clean migrate seed test shell

#####################
## DOCKER COMMANDS ##
#####################

# Start containers
up:
	@echo "Creating your containers up..."
	$(DOCKER_COMPOSE) up -d

# Stop and remove containers
down:
	@echo "Stopping and removing your containers..."
	$(DOCKER_COMPOSE) down

# View logs
logs:
	$(DOCKER_COMPOSE) logs -f --tail 200

# Start containers without rebuilding
start:
	@echo "Powering on your containers..."
	$(DOCKER_COMPOSE) start && make logs

# Stop containers
stop:
	@echo "Gracefully stopping your containers..."
	$(DOCKER_COMPOSE) stop

# Restart containers
restart:
	@echo "Restarting your existing containers..."
	$(DOCKER_COMPOSE) restart

# Rebuild containers
rebuild:
	@echo "Rebuilding your containers from the group up..."
	$(DOCKER_COMPOSE) up --force-recreate --build --no-start

# Remove all containers, networks, images, and volumes
clean:
	@echo "Removing your docker backend stack and cleaning images..."
	$(DOCKER_COMPOSE) down --remove-orphans --rmi all -v

# Start Flask in development mode (debug + hot reload)
dev:
	@echo "Setting environment to development"
	sed -i.bak 's/FLASK_ENV=.*/FLASK_ENV=development/' .env
	$(DOCKER_COMPOSE) up -d --build

# Start Flask in production mode (just runs, no debug/reload)
prod:
	@echo "Setting environment to production"
	sed -i.bak 's/FLASK_ENV=.*/FLASK_ENV=production/' .env
	$(DOCKER_COMPOSE) up -d --build

# Enter Flask shell
shell:
	docker exec -it flask_backend flask shell

# Create a new migration file (Docker)
migrate:
	@echo "🔍 Checking if migrations folder exists..."
	@docker exec -it flask_backend test -d /app/migrations || (echo "⚠️ No migrations found. Initializing Flask-Migrate..."; docker exec -it flask_backend flask db init)
	docker exec -it flask_backend flask db migrate -m "Auto migration"

# Apply the latest migrations to the database (Docker)
upgrade:
	docker exec -it flask_backend flask db upgrade

seed:
	@echo "Seeding docker database..."
	docker exec -it flask_backend python -m app.seed

# Run tests inside Docker container using SQLite, will test any file with the name test_<something>.py
test:
	@echo "Running unit tests inside Docker..."
	docker exec -it flask_backend env PYTHONPATH=. APP_ENV=testing python3 -m unittest discover -s tests -p "test_*.py"


#####################
## LOCAL COMMANDS ##
#####################

# You will need to use your local virutal enviroment via:
# . .venv/bin/activate (wherever your python virtual enviroment is)

# Install dependencies (similar to a package.json)
local-install:
	@echo "Installing requirements.txt..."
	pip install -r requirements.txt

# Run Flask locally in development mode (hot reload)
local-run:
	@echo "Running the backend locally"
	flask --app app --debug run

# Enter Flask shell locally
local-shell:
	flask shell

# Create a new migration file (Local)
local-migrate:
	@echo "🔍 Checking if migrations folder exists..."
	@test -d migrations || (echo "⚠️ No migrations found. Initializing Flask-Migrate..."; flask db init)
	flask db migrate -m "Auto migration"

# Apply the latest migrations to the database (Local)
local-upgrade:
	@echo "Applying local migrations..."
	flask db upgrade

# Seed database locally
local-seed:
	@echo "Seeding local database..."
	python app/seed.py

# Run tests locally
local-test:
	@echo "Running unit tests locally with SQLite..."
	PYTHONPATH=. APP_ENV=testing python3 -m unittest discover -s tests -p "test_*.py"
