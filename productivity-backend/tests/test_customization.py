import unittest
from app import create_app, db
from app.models import CustomizationItems
from sqlalchemy.exc import IntegrityError
from sqlalchemy.dialects.sqlite import dialect as sqlite_dialect

class CustomizationItemsModelTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_customization_item_creation(self):
        with self.app.app_context():
            item = CustomizationItems(
                item_type="skin",
                name="Red Skin",
                item_cost=50,
                model_key="red_skin_model"
            )
            db.session.add(item)
            db.session.commit()

            saved_item = CustomizationItems.query.first()
            self.assertIsNotNone(saved_item)
            self.assertEqual(saved_item.name, "Red Skin")
            self.assertEqual(saved_item.item_type, "skin")
            self.assertEqual(saved_item.item_cost, 50)
            self.assertEqual(saved_item.model_key, "red_skin_model")

    def test_customization_item_type_enum(self):
        with self.app.app_context():  # Ensure the app context is set up
            # Only check for SQLite if we are inside the app context
            if isinstance(db.engine.dialect, sqlite_dialect):
                self.skipTest("SQLite does not enforce ENUM constraints")

            with self.assertRaises(IntegrityError):
                invalid_item = CustomizationItems(
                    item_type='invalid_type',  # This is not a valid enum value
                    name="Invalid Shirt",
                    item_cost=50,
                    model_key="invalid_model"
                )
                db.session.add(invalid_item)
                db.session.commit()  # This should raise IntegrityError


if __name__ == "__main__":
    unittest.main()


