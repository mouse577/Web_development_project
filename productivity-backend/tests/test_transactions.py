import unittest
from sqlalchemy import text
from app import create_app, db
from app.models import Users, CustomizationItems, Transactions


class TestTransactionsModel(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        db.create_all()
        db.session.execute(text("PRAGMA foreign_keys = ON"))

        user = Users(
            username='testuser',
            first_name='Test',
            last_name='User',
            email='testuser@example.com'
        )
        user.set_password('password')
        db.session.add(user)

        item = CustomizationItems(
            item_type='skin',
            name='CoolSkin',
            item_cost=100,
            model_key='skin_cool_001'
        )
        db.session.add(item)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_create_transaction(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            item = CustomizationItems.query.filter_by(name='CoolSkin').first()
            txn = Transactions(user_id=user.id, item_id=item.id)
            db.session.add(txn)
            db.session.commit()

            saved = Transactions.query.first()
            self.assertIsNotNone(saved)
            self.assertEqual(saved.user_id, user.id)
            self.assertEqual(saved.item_id, item.id)

    def test_transaction_relationships(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            item = CustomizationItems.query.filter_by(name='CoolSkin').first()
            txn = Transactions(user_id=user.id, item_id=item.id)
            db.session.add(txn)
            db.session.commit()

            self.assertEqual(user.transactions[0].item.name, 'CoolSkin')
            self.assertEqual(item.transactions[0].user.email, 'testuser@example.com')

    def test_unique_transaction_constraint(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            item = CustomizationItems.query.filter_by(name='CoolSkin').first()
            txn1 = Transactions(user_id=user.id, item_id=item.id)
            txn2 = Transactions(user_id=user.id, item_id=item.id)
            db.session.add(txn1)
            db.session.add(txn2)
            with self.assertRaises(Exception):
                db.session.commit()

    def test_transaction_with_missing_user(self):
        with self.app.app_context():
            item = CustomizationItems.query.filter_by(name='CoolSkin').first()
            txn = Transactions(user_id=9999, item_id=item.id)
            db.session.add(txn)
            with self.assertRaises(Exception):
                db.session.commit()

    def test_transaction_with_missing_item(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            txn = Transactions(user_id=user.id, item_id=9999)
            db.session.add(txn)
            with self.assertRaises(Exception):
                db.session.commit()

if __name__ == '__main__':
    unittest.main()


