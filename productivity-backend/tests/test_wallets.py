import unittest
from app import create_app, db
from app.models import Users, Wallets

class TestWalletsModel(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        db.create_all()

        user = Users(
            username='testuser',
            first_name='Test',
            last_name='User',
            email='testuser@example.com'
        )
        user.set_password('securepassword')
        db.session.add(user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_wallet_creation(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            wallet = Wallets(user_id=user.id, balance=100)
            db.session.add(wallet)
            db.session.commit()

            fetched_wallet = Wallets.query.filter_by(user_id=user.id).first()
            self.assertIsNotNone(fetched_wallet)
            self.assertEqual(fetched_wallet.balance, 100)

    def test_wallet_balance_default(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            wallet = Wallets(user_id=user.id)
            db.session.add(wallet)
            db.session.commit()

            fetched_wallet = db.session.get(Wallets, wallet.id)
            self.assertEqual(fetched_wallet.balance, 0)

    def test_wallet_balance_cannot_be_negative(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            wallet = Wallets(user_id=user.id, balance=-10)
            db.session.add(wallet)
            with self.assertRaises(Exception):
                db.session.commit()

    def test_user_wallet_relationship(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            wallet = Wallets(user_id=user.id, balance=50)
            db.session.add(wallet)
            db.session.commit()

            self.assertEqual(user.wallet[0].balance, 50)

    def test_user_wallet_uniqueness(self):
        with self.app.app_context():
            user = Users.query.filter_by(username='testuser').first()
            wallet1 = Wallets(user_id=user.id, balance=100)
            wallet2 = Wallets(user_id=user.id, balance=200)
            db.session.add(wallet1)
            db.session.add(wallet2)
            with self.assertRaises(Exception):
                db.session.commit()

if __name__ == '__main__':
    unittest.main()
