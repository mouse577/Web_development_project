from app import db # db = SQLAlchemy instance from init app
from datetime import datetime, timezone # used for dates
from sqlalchemy.orm import relationship # needed for relationships
from sqlalchemy import CheckConstraint
import bcrypt # encrypts strings, like password


# Users Model
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False) # we store password in a hash, see methods below

    # Hash the given password and stores in db
    def set_password(self,password):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    # Check the given password with stored, returns true or false
    def check_password(self, password):
        return bcrypt.checkpw(password.encode(), self.password_hash.encode())

    def __repr__(self):
        return f"<User email: {self.email} - Username: {self.username}>"
    
# Tasks Model
class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    task_name = db.Column(db.String(255), nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)
    task_renewed = db.Column(db.Boolean, default=False)
    task_complete = db.Column(db.Boolean, default=False)

    # Task Type Enum (it needs to be one of 3 types)
    task_type = db.Column(db.Enum('short-term', 'long-term', 'daily', name='task_type_enum'), nullable=False)

    # Relationship to Users model
    user = relationship('Users', backref=db.backref('tasks', lazy=True))

    def __repr__(self):
        return f"<Task {self.task_name} - Due: {self.due_date} - Complete: {self.task_complete}>"    # 

# Avatar Model
class Avatar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    avatar_name = db.Column(db.String(20), nullable=False)
    avatar_energy = db.Column(db.Integer, default=100, nullable=False)
    # Store references to the customization items table
    skin_id = db.Column(db.Integer, db.ForeignKey('customization_items.id'), nullable=True)
    shirt_id = db.Column(db.Integer, db.ForeignKey('customization_items.id'), nullable=True)
    shoes_id = db.Column(db.Integer, db.ForeignKey('customization_items.id'), nullable=True)
    # Relationship to CustomizationItem table
    skin = relationship('CustomizationItems', foreign_keys=[skin_id])
    shirt = relationship('CustomizationItems', foreign_keys=[shirt_id])
    shoes = relationship('CustomizationItems', foreign_keys=[shoes_id])

    # Relationship to Users model
    user = relationship('Users', backref=db.backref('avatar', lazy=True))

    # Keeps the Avatar energy between 0 - 100
    __table_args__ = (
        CheckConstraint('avatar_energy >= 0 AND avatar_energy <= 100', name='check_avatar_energy_range'),
    )

    def __repr__(self):
        return f"<Avatar {self.avatar_name} - Owner: {self.user_id}>"
    
# Customization Items
class CustomizationItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_type = db.Column(db.Enum('skin', 'shirt', 'shoes', name='customization_type_enum'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    item_cost = db.Column(db.Integer, nullable=False)

    # This field is what the frontend will use to toggle something in 3D, maybe like a file name or something
    model_key = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<CustomizationItem {self.item_type} - {self.name}>"

class Wallets(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    balance = db.Column(db.Integer, default=0, nullable=False)

    # Balance cannot be negative, >=0
    __table_args__ = (
        CheckConstraint('balance >= 0', name='check_balance_non_negative'),
    )

    # Relationship to Users model
    user = relationship('Users', backref=db.backref('wallet', lazy=True))

    def __repr__(self):
        return f"<Wallet {self.id} for {self.user_id}>"

class Transactions(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('customization_items.id'), nullable=False)
    # Relationship to Users model
    user = relationship('Users', backref=db.backref('transactions', lazy=True))
    item = relationship('CustomizationItems', backref=db.backref('transactions', lazy=True))

    # Constraint, can't have multiple of the same item
    __table_args__ = (
        db.UniqueConstraint('user_id', 'item_id', name='uq_user_item_once'),
    )

    def __repr__(self):
        return f"<Transaction #{self.id} for {self.user_id} | Purchased Item: {self.item_id}>"
