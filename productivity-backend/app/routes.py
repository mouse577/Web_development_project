from flask import Blueprint, jsonify, request
from app import db
from app.models import Tasks, Users, Avatar, CustomizationItems, Wallets, Transactions
from app.util import sign_token, verify_token  # custom util import for auth
from datetime import datetime, timedelta, timezone

main = Blueprint("main", __name__)
# Test route, should just see the message and get a log
@main.route("/")
def home():
    print("Hello!")
    return jsonify({"message": "Flask API is running!"})

#### TASKS ROUTES #####
@main.route("/tasks", methods=["GET"])
# GET tasks
def get_tasks():
    """Returns tasks"""
    # Query Params - we can customize requests, add additional args here.
    user_id = request.args.get("user_id", type=int)
    task_complete = request.args.get("task_complete", type=bool)
    task_type = request.args.get("task_type", type=str)

    # We can specify what we want like so:
    """
      - `/tasks` => Returns all tasks, all users
      - `/tasks?user_id=1` => Returns tasks for user_id = 1
      - `/tasks?task_complete=true` => returns completed
      - `/tasks?task_type=short-term` => choose what type return
      - `/tasks?task_complete=true&user_id=1` => we can also add combinations
    """

    # Base query
    query = Tasks.query

    # Apply filters, if applicable. Note- if we add new args allowed we'll need to update this.
    if user_id:
        query = query.filter(Tasks.user_id == user_id)
    if task_complete is not None:
        query = query.filter(Tasks.task_complete == task_complete)
    if task_type:
        query = query.filter(Tasks.task_type == task_type)

    # Ending soonest are higher up
    query = query.order_by(Tasks.due_date.asc())

    # Fetch results after filters
    tasks = query.all()

    # Convert result to JSON
    return jsonify([
        {
            "id": task.id,
            "user_id": task.user_id,
            "task_name": task.task_name,
            "created_date": task.created_date.isoformat(),
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "task_renewed": task.task_renewed,
            "task_complete": task.task_complete,
            "task_type": task.task_type
        }
        for task in tasks
    ])

#  Create a new task
@main.route("/tasks", methods=["POST"])
def create_task():
    """Creates a new task"""
    data = request.json

    # Validate, needs required fields
    '''
    This is the required info, will use defaults for the others: 
    {
        "user_id": 3,
        "task_name": "Test missing info",
        "task_type": "long-term",
        "due_date": "2025-03-25"
    }
    '''
    required_fields = ["user_id", "task_name", "task_type", "due_date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400 # bad request

    # Extract data
    user_id = data["user_id"]
    task_name = data["task_name"]
    task_type = data["task_type"]
    due_date = data.get("due_date")
    task_renewed = data.get("task_renewed", False)  # default = false
    task_complete = data.get("task_complete", False)  # default = False

    # Check if user exists
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404 # not found!

    # Create a task
    new_task = Tasks(
        user_id=user_id,
        task_name=task_name,
        task_type=task_type,
        due_date=due_date,
        task_renewed=task_renewed,
        task_complete=task_complete
    )

    # Add to adatabase
    db.session.add(new_task)
    db.session.commit()

    # Success message
    return jsonify({
        "message": "Task created successfully",
        "task": {
            "id": new_task.id,
            "user_id": new_task.user_id,
            "task_name": new_task.task_name,
            "created_date": new_task.created_date.isoformat(),
            "due_date": new_task.due_date.isoformat() if new_task.due_date else None,
            "task_renewed": new_task.task_renewed,
            "task_complete": new_task.task_complete,
            "task_type": new_task.task_type
        }
    }), 201

# Update Task
@main.route("/tasks", methods=["PUT", "PATCH"])
def update_task():
    """Updates an existing task"""
    data = request.json

    # Make sure the id was passed
    task_id = data["id"]

    # If not, reject
    if not task_id:
        return jsonify({"error": "Missing task field: id"}), 400 # bad request
    
    # Check that its a valid id
    task = Tasks.query.get(task_id)
    # If not, reject
    if not task:
        return jsonify({"error": "Task not found"}), 404 # not found
    
    # Extract data and update fields, if provided
    if "task_name" in data:
        task.task_name = data["task_name"]
    if "task_type" in data:
        task.task_type = data["task_type"]
    if "due_date" in data:
        task.due_date = data["due_date"]
    if "task_renewed" in data:
        task.task_renewed = data["task_renewed"]
    if "task_complete" in data:
        task.task_complete = data["task_complete"]

    # Commit to database
    db.session.commit()

    # Return the updated details
    return jsonify({
        "message": "Task updated successfully",
        "task": {
            "id": task.id,
            "user_id": task.user_id,
            "task_name": task.task_name,
            "created_date": task.created_date.isoformat(),
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "task_renewed": task.task_renewed,
            "task_complete": task.task_complete,
            "task_type": task.task_type
        }
    }), 200 # status = OK

# Delete Task
@main.route("/tasks", methods=["DELETE"])
def delete_task():
    """Updates an existing task"""
    data = request.json

    # Make sure the id was passed
    task_id = data["id"]

    # If not, reject
    if not task_id:
        return jsonify({"error": "Missing task field: id"}), 400 # Bad request
    
    # Check that its a valid id
    task = Tasks.query.get(task_id)
    # If not, reject
    if not task:
        return jsonify({"error": "Task not found"}), 404 # Not found
    
    # Delete task, if valid
    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"}), 200  # OK

@main.route("/streak", methods=["GET"])
def get_streak():
    """Returns the current task completion streak in days"""

    # Get auth token
    token = verify_token()
    if not token:
        return jsonify({"error": "Unauthorized or invalid token"}), 401

    user_id = token.get("id")

    # Get all tasks by user, that are complete, ordered by created date
    completed_tasks = (
        Tasks.query
        .filter_by(user_id=user_id, task_complete=True)
        .with_entities(Tasks.created_date)
        .order_by(Tasks.created_date.desc())
        .all()
    )

    completed_dates = {dt.created_date.date() for dt in completed_tasks}

    streak = 0
    today = datetime.now(timezone.utc).date()

    while today in completed_dates:
        streak += 1
        today -= timedelta(days=1)

    return jsonify({
        "streak_days": streak
    }), 200

    

#### USER ROUTES #####
# Login
@main.route("/login", methods=["POST"])
def login():
    """Authenticate user, return json web token for login/logout/auth"""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = Users.query.filter_by(email=email).first()
    # Check password, decoded via bcrypt method on user
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401  # Unauthorized

    # Generate JWT token with user info
    token = sign_token({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    })
    # Send token to frontend
    return jsonify({"token": token}), 200 # OK

# Create new user
@main.route("/signup", methods =["POST"])
def signup():
    """Creates a new user"""
    data = request.json
    required_fields = ["username", "first_name", "last_name", "email", "password"]

    # Check to make sure everything is provided
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400 # bad request

    # Extract data
    username = data["username"]
    first_name = data["first_name"]
    last_name = data["last_name"]
    email = data.get("email")
    password = data.get("password")

    # See if user exists
    user = Users.query.filter_by(email=email).first()
    # Create or return conflict
    if not user:
        # Create the User
        user = Users(username=username, email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        # Add it
        db.session.add(user)
        db.session.commit()
        print(f"User '{username}' created!")
        # Avatar
        # Get default items
        default_skin = CustomizationItems.query.filter_by(name='Default Skin').first()
        default_shirt = CustomizationItems.query.filter_by(name='White Shirt').first()
        default_shoes = CustomizationItems.query.filter_by(name='Black Shoes').first()
        # Create a default avatar for the User
        avatar = Avatar(user_id = user.id, avatar_name = f"{user.username}'s Avatar", skin_id = default_skin.id, shirt_id = default_shirt.id, shoes_id=default_shoes.id )
        # Add it
        db.session.add(avatar)
        db.session.commit()
        print(f"Avatar '{avatar.avatar_name}' created!")

        # Create Wallet
        wallet = Wallets.query.filter_by(user_id = user.id).first()
        if not wallet:
            wallet = Wallets(user_id = user.id)
            db.session.add(wallet)
            db.session.commit()
            print(f"Wallet {wallet.id} created for {user.email}!")
    else:
        # Conflict message
        print(f"User '{email}' already exists.")
        return jsonify({
            "message": f"User with email '{email}' already exists.",
        }), 409
        # Success message
    return jsonify({
        "message": "User created successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "password_hash": user.password_hash
        }
    }), 201

# Update a User
@main.route("/user", methods=["PUT", "PATCH"])
def update_user():
    """Updates an existing user"""
    # First check that its authorized user
    token = verify_token()
    if not token:
        return jsonify({"error": "Unauthorized or invalid token"}), 401
    
    # Check if user still exists
    user_id = token.get("id")
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 400
    
    # If valid token and user, proceed
    data = request.json
    # Extract data and update fields, if provided
    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]
    if "first_name" in data:
        user.first_name = data["first_name"]
    if "last_name" in data:
        user.last_name = data["last_name"]
    if "password" in data:
        user.set_password(data["password"])

    # Commit to database
    db.session.commit()

    # Generate JWT with user info (so the frontend can update 
    # localStorage without requiring a full logout and login)
    token = sign_token({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    })

    # Return new info
    return jsonify({
        "message": "User updated successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "password_hash": user.password_hash
        },
        "token": token,
    }), 200 # status = OK

# Delete a User
@main.route("/user", methods=["DELETE"])
def delete_user():
    """Deletes an existing user"""
    # First check that its authorized user
    token = verify_token()
    if not token:
        return jsonify({"error": "Unauthorized or invalid token"}), 401
    
    # Check if user still exists
    user_id = token.get("id")
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 400
    
    # Before we delete the User, we'll need to remove their content due to foreign key restraints

    # Delete user's tasks
    Tasks.query.filter_by(user_id=user_id).delete()

    # Delete user's avatar
    Avatar.query.filter_by(user_id=user_id).delete()

    # Delete user's items once transaction table is complete
    Transactions.query.filter_by(user_id=user_id).delete()

    # Delete user, if valid
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

#### ITEM ROUTES #####
@main.route("/items", methods=["GET"])
def get_items():
    """Returns all items, with an 'owned' flag if user_id is provided"""

    # Optional route params
    user_id = request.args.get("user_id", type=int)

    # Get all items
    items = db.session.query(CustomizationItems).all()

    # If user_id is provided, fetch item_ids the user owns via transactions
    owned_item_ids = set()
    if user_id:
        owned_item_ids = {
            row.item_id for row in db.session.query(Transactions.item_id).filter_by(user_id=user_id).all()
        }

    return jsonify([
        {
            "id": item.id,
            "item_type": item.item_type,
            "name": item.name,
            "item_cost": item.item_cost,
            "model_key": item.model_key,
            **({"owned": item.id in owned_item_ids} if user_id else {}) # this will only show up if user_id is passed
        }
        for item in items
    ])

# Log a Transaction
@main.route("/items", methods=["POST"])
def post_transaction():
    """Logs a transaction to the transactions table"""
    # First check that its an authorized user
    token = verify_token()
    if not token:
        return jsonify({"error": "Unauthorized or invalid token"}), 401
    
    data = request.json
    required_fields = ["user_id", "item_id"]

    # Check to make sure everything is provided
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400 # missing info

    # Extract data
    user_id = data["user_id"]
    item_id = data["item_id"]

    # See if they already have this item
    transaction = Transactions.query.filter_by(user_id=user_id,item_id=item_id).first()

    # Log if doesn't exist, or return
    if not transaction:
        item_to_purchase = CustomizationItems.query.filter_by(id=item_id).first()
        # Verify that item, user and wallet all exist
        if not item_to_purchase:
            return jsonify({"error": "Item not found"}), 400

        user = Users.query.filter_by(id = user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 400
        
        wallet = Wallets.query.filter_by(user_id = user_id).first()
        if not wallet:
            return jsonify({"error": "Wallet not found"}), 400
        
        # Verify that user has enough balance to cover the purchase
        balance = wallet.balance
        if item_to_purchase.item_cost > balance:
            return jsonify({"error": "Insufficient funds"}), 400
        
        # Deduct cost of item from user wallet, update that in db
        wallet.balance -= item_to_purchase.item_cost
        db.session.add(wallet)
        print(f"Wallet {wallet.id} transaction: Prev Balance: {balance} - {item_to_purchase.item_cost} = {wallet.balance}")

        # Log transaction to db
        transaction = Transactions(user_id = user_id, item_id = item_id)
        db.session.add(transaction)
        db.session.commit()
        print(f"Transaction '{transaction.id}: {transaction.user_id} owns {transaction.item_id}' logged!")

        # Return the item info
        return jsonify({
            "message": "Purchase successful",
            "item_id": item_to_purchase.id,
            "item_name": item_to_purchase.name,
            "remaining_balance": wallet.balance
        }), 201
    else:
        return jsonify({"message": "Item already owned."}), 200

#### WALLET ROUTES ##### 
@main.route("/balance", methods=["GET"])
def get_balance():
    """Returns a user's balance"""
    # Check token, grab user_id from that
    token = verify_token()
    if not token:
        return jsonify({"error": "Unauthorized or invalid token"}), 401
    # User Id from token, no need for params
    user_id = token['id']

    # Get balance
    wallet = Wallets.query.filter_by(user_id=user_id).first()
    if wallet:
        return jsonify({"balance": wallet.balance}), 200
    else:
        return jsonify({"error": "Wallet not found for user."}), 404

@main.route("/balance", methods=["POST"])
def post_balance():
    """Increases/decreases a user's balance"""
    data = request.json
    # We just need an amount to +/-
    required_fields = ["amount"]

    # Check to make sure everything is provided
    '''
        This is the required info, will use defaults for the others: 
        {
            "amount": 123456 (or -12345)
        }
    '''
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400 # bad request

    # Check token, grab user_id from that
    token = verify_token()
    if not token:
        return jsonify({"error": "Unauthorized or invalid token"}), 401
    # User Id from token, no need for params
    user_id = token.get("id")

    # Get balance
    wallet = Wallets.query.filter_by(user_id=user_id).first()
    if wallet:
        # Modify balanace
        old_balance = wallet.balance
        wallet.balance += data["amount"]
        if wallet.balance < 0:
            return jsonify({"error": f"Cannot deduct balance below 0. Current Balance: {old_balance} | Amount: {data['amount']}"}), 400
        db.session.add(wallet)
        db.session.commit()
        return jsonify({"balance": wallet.balance}), 200
    else:
        return jsonify({"error": "Wallet not found for user."}), 404

