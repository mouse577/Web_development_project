# Taskagotchi -- Backend

## Makefile
This contains a bunch of scripts similar to `npm run <script>` from the Node world. This backend contains scripts to build on both a Dockerized backend as well as local development.
There are a number of administrative commands defined in the `Makefile` that should allow easier management of your containers or local installation. 
- **Manage Containers**: `make up`, `make start`, `make stop`, `make restart`
- **Manage the Database**: `make migrate`, `make upgrade`, `make seed`
- **Develop Locally**: `make local-install`, `make local-migrate`, `make local-upgrade`


## Docker
This project has been setup with Docker files to allow containerized development that should make cross-platform compatability much simpler. Instead of installing PostgreSQL, Flask, and PGAdmin locally and using local accounts, you can spin up 3 linked containers with pre-set user info and work off of this. In Development mode, this will hot-reload if you make changes to your code. 

### .env
First you will need a `.env` file. You will need the variables outlined in `.env.example` and can just copy that file and rename to quickly spin up your new containers.

### Docker Initialization
You can run `make up` to build up the container stack. This will use the `docker-compose.yml` and `Dockerfile` along with the settings in `.env` to spin up the 3 containers:
- postgres_sql_db
- flask_backend
- pg_admin

Flask should auto-connect to the postgres instance, but you will need to manually connect this to to the pg_admin container on initialization if you want to administer the database via GUI

### Starting Dockerized
After you have your containers built, its time to start. Go ahead and fire the containers up with `make start` to get logs for all the containers. They should hot-reload if they are in development mode (set in your `.env`). If your logs are logging and you get the flask_backend reporting where it's running, then you're good to move forward!

### Database Sync
Once your containers are up and running, you need to set up the database schema by applying migrations. Migrations allow you to track and update database structure changes over time. `Migrate` and `Upgrade` make scripts are used to manage database / schema changes.

#### Database Sync: First-Time Setup
If this is your first time setting up the database, you need to apply existing migrations by running the following commands:
- `make upgrade`

#### Database Sync: Adding New Features
If you make changes to your models (e.g., adding a column or modifying a table), you also need to:
- `make migrate`
- `make upgrade`

And then commit the new migration file, will show up under `migrations/versions/<some-uuid-auto-migration>.py`

#### Database Sync: If Someone Else Pushes a New Migration?
If a teammate updates the database schema and commits a new migration file (will show up under `migrations/versions/<some-uuid-auto-migration>.py`), you only need to run `make upgrade`. This will sync your local database with the latest schema.

### Seed
To test that the databases are working correctly, you can `make seed` to populate the databases with seed data. This should log if successful, but you can confirm by checking out the database using pgadmin or command line psql if that's your thing. 

### pgadmin Setup
You can connect to the `postgres_sql_db` container through this containerized instance of pgAdmin, OR with your local pgAdmin Application. 
Simply login using the `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` specified in your `.env` if Dockerized, or your own account if running local. 

Once there, you can use the Quick Links to "Add a New Server" or right-click the Servers stack on the left-hand side to Register => Server. 

Again we will use the info in the `.env`. If using the provided defaults: 

#### General
Name = postgres or `POSTGRES_DB` 

#### Connection
Host name / address = db
Port = 5432
Username = postgres or `POSTGRES_USER`
Password = password or `POSTGRES_PASSWORD`

### Starting and Stopping Containers
The `Makefile` has a number of useful commands at your disposal to manage containers.  `Start`, `stop`, and `restart` and good if your container is already built and will "save your work" if you already have data in the database. `Watch` will allow you to see the logs for all 3 containers.

Commands like `clean` (tears down all the containers) and `rebuild` (rebuilds the stack) are usefully if you need to make major changes, such as if something isn't working correctly. If you use these commands, you will need to rebuild them.

--- 
--- 

## Local Development
If Docker is not your thing, you can develop and run everything locally. The Make commands assume you are already using the Python virtual enviroment (venv) and it is active.

You will also need [Postgres](https://www.postgresql.org/) installed. [pgAdmin](https://www.pgadmin.org/) is also recommended for GUI database administration.

### Local Initialization
`make local-install` to use the `requirements.txt` like a package.json to install all the modules on your local virtual enviroment. 

--- 
--- 

## Testing
Our backend uses a temporary, in-memory Sqlite database for testing to ensure all the Models, utils, and methods work as expected.

### How to Run Tests
You can run tests in Docker via `make test` or on your local machine using `make local-test`. This will automatically run any file in the `/tests` directory with the following format `test_*.py` using unittest. 

### Making a New Test
To use the temporary testing sqlite database -- in your test class, you will just need to include the following methods (`setUp()` and `tearDown()`) which will automatically build and then tear down the database to run tests.

Then simply write functional tests with assert statements within that class, following documentation: https://docs.python.org/3/library/unittest.html#assert-methods

```
import unittest
import os
from app import create_app, db

# Class for <someModel> testings
class <someModel>TestCase(unittest.TestCase):
    def setUp(self):
        # Sets up testing db
        self.app = create_app()

        # Override database for testing, force in memory sqlite3
        self.app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.config['TESTING'] = True

        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all() # run the schema (migrations)

    # After each test, tear it down
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

# Sample test format
    def test_<someModel>_creation(self):
        with self.app.app_context():
        # Some logic
        ...
        # Asserts
         self.assertIsNotNone(something)
         self.assetEqual(something, something-else)
        ...


    ... other tests below
```
