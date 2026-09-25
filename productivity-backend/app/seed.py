from app import db, app # imports our sqlalchemy and our app instance
from datetime import datetime, timedelta, timezone

from app.models import Users, Tasks, Avatar, CustomizationItems, Wallets

#### Helper Functions - used to make seeding in bulk easier #####
def get_or_create_user(username, email, first_name,last_name, password):
    # Query for the User
    user = Users.query.filter_by(username=username).first()
    # If Doesn't exist,
    if not user:
        user = Users(username=username, email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        # Add it
        db.session.add(user)
        db.session.commit()
        print(f"User '{username}' created!")
    else:
        print(f"User '{username}' already exists.")
    return user

# Seeds generic tasks for given user, if they don't already exist
def seed_tasks(user):
    # Query to see if the tasks exists, this is a seed so all either do or don't
    tasks = Tasks.query.filter_by(user_id=user.id).first()
    if not tasks:
        now_utc = datetime.now(timezone.utc)
        # Default Seed Tasks with some variety for testing
        tasks = [
            # Upcoming Tasks (Not yet complete)
            Tasks(user_id=user.id, task_name="Buy groceries", created_date=now_utc,
                  due_date=now_utc + timedelta(days=2), task_renewed=False, task_complete=False, task_type="short-term"),

            Tasks(user_id=user.id, task_name="Workout!", created_date=now_utc,
                  due_date=now_utc + timedelta(days=1), task_renewed=True, task_complete=False, task_type="daily"),

            Tasks(user_id=user.id, task_name="Finish the project report", created_date=now_utc - timedelta(days=5),
                  due_date=now_utc + timedelta(days=7), task_renewed=False, task_complete=False, task_type="long-term"),

            # Completed Tasks
            Tasks(user_id=user.id, task_name="Call Mom", created_date=now_utc - timedelta(days=3),
                  due_date=now_utc - timedelta(days=2), task_renewed=False, task_complete=True, task_type="short-term"),

            # Overdue
            Tasks(user_id=user.id, task_name="Pay electricity bill", created_date=now_utc - timedelta(days=10),
                  due_date=now_utc - timedelta(days=3), task_renewed=False, task_complete=False, task_type="short-term"),

            # Recurring Task (Daily)**
            Tasks(user_id=user.id, task_name="Attend morning stand-up meeting", created_date=now_utc - timedelta(days=10),
                  due_date=now_utc + timedelta(days=1), task_renewed=True, task_complete=False, task_type="daily"),

            # Long-Term Goal, not complete
            Tasks(user_id=user.id, task_name="Read 10 chapters of a book", created_date=now_utc - timedelta(days=15),
                  due_date=now_utc + timedelta(days=30), task_renewed=False, task_complete=False, task_type="long-term"),
        ]
        # Add all the tasks
        db.session.add_all(tasks)
        db.session.commit()
        print(f"Seeded tasks for {user.username}.")
    else:
        print(f"Tasks for {user.username} already exist.")

# Seeds a streak to Users
def seed_streaks(user, number):
    existing_streak = Tasks.query.filter_by(user_id=user.id, task_name="Get out of bed").first()
    if not existing_streak:
        # Get current data, empty arr
        now_utc = datetime.now(timezone.utc)
        streak_tasks = []
        # Just iterate through and append different tasks each a day out
        for i in range(number):
            task_day = now_utc - timedelta(days=i)
            streak_tasks.append(
                Tasks(
                    user_id=user.id,
                    task_name="Get out of bed",
                    created_date=task_day,
                    due_date=task_day,
                    task_renewed=False,
                    task_complete=True,
                    task_type="daily"
                )
            )
        db.session.add_all(streak_tasks)
        db.session.commit()
        print(f"Seeded {number}-day streak for user {user.username}")
    else:
        print(f"Streak tasks already exist for user {user.username}")
        
# Seeds some default items
def seed_items(item_type, name, model_key, item_cost):
    item = CustomizationItems.query.filter_by(name=name).first()
    if not item:
        item = CustomizationItems(item_type = item_type, name = name, model_key = model_key, item_cost = item_cost)
        db.session.add(item)
        db.session.commit()
        print(f"Item '{name}' created | Type : '{item_type} | Cost: '{item_cost}'")
    else:
        print(f"Item '{name}' exists")
    return item

# Seed some Avatars and associate them with items and Users
def seed_avatar(user_id, avatar_name, skin_id, shirt_id, shoes_id):
    avatar = Avatar.query.filter_by(user_id = user_id).first()
    if not avatar:
        avatar = Avatar(user_id = user_id, avatar_name = avatar_name, skin_id = skin_id, shirt_id = shirt_id, shoes_id = shoes_id)
        db.session.add(avatar)
        db.session.commit()
        print(f"Avatar for User ID {user_id}: {avatar_name} created! ")
    else:
        print(f"Avatar for User ID {user_id} does not exist." )
    return avatar
def seed_wallets(user_id):
    wallet = Wallets.query.filter_by(user_id = user_id).first()
    if not wallet:
        wallet = Wallets(user_id = user_id, balance = 9000)
        db.session.add(wallet)
        db.session.commit()
        print(f"Wallet for User ID {user_id}: {wallet.id} created! ")
# Initialize
with app.app_context():
    # Create 3 generic users
    user1 = get_or_create_user( "adam_addams123", "user1@mail.com", "Adam", "Addams","password1",)
    user2 = get_or_create_user("bilbo_baggins420","user2@mail.com",  "Bilbo", "Baggins","password2")
    user3 = get_or_create_user("bigcarlo69", "user3@mail.com", "Carlos", "Carmen","password3")
    # Seed them with the array of tasks
    seed_tasks(user1)
    seed_tasks(user2)
    seed_tasks(user3)

    # Seed Streaks
    seed_streaks(user1, 7)
    seed_streaks(user2, 10)
    seed_streaks(user1, 3)

    # Seed the Items
    # Seed Shirts
    seed_items('shirt', 'White Shirt', 'white_shirt', 0)
    seed_items('shirt', 'Red Shirt', 'red_shirt', 100)
    seed_items('shirt', 'Blue Shirt', 'blue_shirt', 100)
    seed_items('shirt', 'Green Shirt', 'green_shirt', 100)
    seed_items('shirt', 'Black Shirt', 'black_shirt', 100)
    seed_items('shirt', 'Rainbow Shirt', 'rainbow_shirt', 200)
    # Seed Shoes
    seed_items('shoes', 'Black Shoes', 'black_shoes', 0)
    seed_items('shoes', 'Red Shoes', 'red_shoes', 50)
    seed_items('shoes', 'Blue Shoes', 'blue_shoes', 50)
    seed_items('shoes', 'Green Shoes', 'green_shoes', 50)
    seed_items('shoes', 'White Shoes', 'white_shoes', 100)
    seed_items('shoes', 'Gold Shoes', 'gold_shoes', 1000)
    # Seed Skin
    seed_items('skin', 'Default Skin', 'default_skin', 0)
    seed_items('skin', 'Yellow Skin', 'yellow_skin', 200)
    seed_items('skin', 'Green Skin', 'green_skin', 200)
    seed_items('skin', 'Blue Skin', 'blue_skin', 200)
    seed_items('skin', 'Rainbow Skin', 'rainbow_skin', 500)

    # Seed Avatars to users
    # Default Items
    default_skin = CustomizationItems.query.filter_by(name='Default Skin').first()
    default_shirt = CustomizationItems.query.filter_by(name='White Shirt').first()
    default_shoes = CustomizationItems.query.filter_by(name='Black Shoes').first()

    # Seed avatars with items for users
    seed_avatar(user1.id, "Adam Jr.", default_skin.id, default_shirt.id, default_shoes.id)
    seed_avatar(user2.id, "Frodo", default_skin.id, default_shirt.id, default_shoes.id)
    seed_avatar(user3.id, "Carlito", default_skin.id, default_shirt.id, default_shoes.id)

    # Seed wallets to user
    seed_wallets(user1.id)
    seed_wallets(user2.id)
    seed_wallets(user3.id)