import jwt
from datetime import datetime, timedelta, timezone
from flask import request

# Secret key for signing tokens
SECRET_KEY = "mysecretssshhhhhhh"
EXPIRATION_HOURS = 4

# Returns a signed token when a user logs in
def sign_token(user):
    """Generate a JWT token with user data."""
    payload = {
        "data": user,
        "exp": datetime.now(timezone.utc) + timedelta(hours=EXPIRATION_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# Checks if a token is valid, expired, or invalid
def verify_token():
    """Verify JWT token from the request headers."""
    token = request.headers.get("Authorization")

    if token and token.startswith("Bearer "):
        token = token.split(" ")[1].strip()

    if not token:
        return None  # No token provided

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded.get("data")  # Return user data if valid
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token
