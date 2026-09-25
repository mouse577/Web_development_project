import unittest
from app import create_app, db
from app.models import Users, Tasks
from datetime import datetime, timedelta, timezone
from sqlalchemy.dialects.sqlite import dialect as sqlite_dialect

class TaskModelTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # This method will run once before all tests in the class
        cls.app = create_app()

        cls.app.config.update({
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",  # Use SQLite in-memory for testing
            "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        })
        cls.client = cls.app.test_client()

        with cls.app.app_context():
            db.create_all()

    @classmethod
    def tearDownClass(cls):
        # This method will run once after all tests in the class
        with cls.app.app_context():
            db.session.remove()
            db.drop_all()

    def setUp(self):
        # This method will run before each individual test
        pass

    def tearDown(self):
        # This method will run after each individual test
        pass

    def test_create_task(self):
        with self.app.app_context():
            user = Users(
                username="testuser",
                first_name="Test",
                last_name="User",
                email="test@example.com"
            )
            user.set_password("securepass")
            db.session.add(user)
            db.session.commit()

            task = Tasks(
                user_id=user.id,
                task_name="Build backend",
                due_date=datetime.now(timezone.utc) + timedelta(days=3),
                task_type="short-term"
            )
            db.session.add(task)
            db.session.commit()

            saved_task = Tasks.query.first()
            self.assertIsNotNone(saved_task)
            self.assertEqual(saved_task.task_name, "Build backend")
            self.assertFalse(saved_task.task_complete)
            self.assertFalse(saved_task.task_renewed)
            self.assertEqual(saved_task.user.username, "testuser")

    def test_invalid_task_type(self):
        with self.app.app_context():
            # Skipping this test for SQLite since it does not enforce enum constraints
            if isinstance(db.engine.dialect, sqlite_dialect):
                self.skipTest("SQLite does not enforce ENUM constraints")

            user = Users(
                username="invalidtaskuser",
                first_name="Invalid",
                last_name="Task",
                email="invalid@example.com"
            )
            user.set_password("123")
            db.session.add(user)
            db.session.commit()

            invalid_task = Tasks(
                user_id=user.id,
                task_name="Should Fail",
                task_type="not-a-real-type"  # Invalid task type
            )

            db.session.add(invalid_task)
            with self.assertRaises(Exception):
                db.session.commit()

    def test_task_repr(self):
        with self.app.app_context():
            user = Users(
                username="repro",
                first_name="Repro",
                last_name="User",
                email="repro@example.com"
            )
            user.set_password("pass")
            db.session.add(user)
            db.session.commit()

            task = Tasks(
                user_id=user.id,
                task_name="Read logs",
                task_type="daily"
            )
            db.session.add(task)
            db.session.commit()

            self.assertIn("Read logs", repr(task))
            self.assertIn("Complete", repr(task))

if __name__ == "__main__":
    unittest.main()

