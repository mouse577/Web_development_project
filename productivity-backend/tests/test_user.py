import unittest
from app import create_app, db
from app.models import Users

class UserModelTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()  # No need to pass config_name here
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"  # Use in-memory DB for testing
        self.app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_user_creation(self):
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

            retrieved_user = Users.query.filter_by(username="testuser").first()
            self.assertIsNotNone(retrieved_user)
            self.assertEqual(retrieved_user.email, "test@example.com")
            self.assertTrue(retrieved_user.check_password("securepass"))
            self.assertFalse(retrieved_user.check_password("wrongpass"))

    # Add more tests as needed, e.g., test for duplicate email, etc.

if __name__ == "__main__":
    unittest.main()



