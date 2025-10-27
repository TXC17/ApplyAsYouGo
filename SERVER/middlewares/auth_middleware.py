from functools import wraps
from flask import request, jsonify,g
import jwt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "your_super_secret_jwt_key_here_change_in_production")
JWT_ALGORITHM = "HS256"

# Simple in-memory token blacklist (in production, use Redis or database)
blacklisted_tokens = set()



def blacklist_token(token):
    """Add token to blacklist"""
    blacklisted_tokens.add(token)

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'User is Unauthorized'}), 401

        try:
            # Handle both "Bearer token" and just "token" formats
            if token.startswith('Bearer '):
                token = token.split(" ")[1]  # Remove "Bearer"
            
            # Check if token is blacklisted
            if token in blacklisted_tokens:
                return jsonify({'message': 'Token has been invalidated'}), 401
            
            # Decode JWT token - use the same parameters as in auth.py
            decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            g.user = decoded  # Attach user info to Flask's g object
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        except Exception:
            return jsonify({'message': 'Authentication failed'}), 401

        return f(*args, **kwargs)
    return decorated_function
