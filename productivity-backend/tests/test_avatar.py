import unittest
from app import create_app, db
from app.models import Users, Avatar, CustomizationItems
from datetime import datetime, timedelta, timezone

class AvatarModelTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()  # Initialize the app
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

    def test_avatar_creation(self):
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

            avatar = Avatar(
                user_id=user.id,
                avatar_name="Test Avatar"
            )
            db.session.add(avatar)
            db.session.commit()

            saved_avatar = Avatar.query.first()
            self.assertIsNotNone(saved_avatar)
            self.assertEqual(saved_avatar.avatar_name, "Test Avatar")
            self.assertEqual(saved_avatar.user_id, user.id)

    def test_avatar_energy_constraint(self):
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

            avatar = Avatar(
                user_id=user.id,
                avatar_name="Test Avatar",
                avatar_energy=150  # This should be outside the valid range
            )

            with self.assertRaises(Exception):
                db.session.add(avatar)
                db.session.commit()

if __name__ == "__main__":
    unittest.main()
