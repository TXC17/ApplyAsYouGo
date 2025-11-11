from functools import wraps
from flask import request, jsonify, g
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "5caba265540278dd7885f6b6950c4904")
JWT_ALGORITHM = 'HS256'

def get_admin_emails():
    """Get list of admin emails from environment variable"""
    admin_emails_str = os.getenv("ADMIN_EMAILS", "")
    if not admin_emails_str:
        return []
    return [email.strip().lower() for email in admin_emails_str.split(",")]

def admin_required(f):
    """Decorator to require admin authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'message': 'Authorization header is missing'}), 401
        
        try:
            # Extract token from "Bearer <token>"
            token = auth_header.split(" ")[1] if " " in auth_header else auth_header
            
            # Decode JWT token
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_email = payload.get('email', '').lower()
            
            # Check if user is in admin list
            admin_emails = get_admin_emails()
            
            if not admin_emails:
                return jsonify({'message': 'No admin emails configured'}), 500
            
            if user_email not in admin_emails:
                return jsonify({'message': 'Access denied. Admin privileges required.'}), 403
            
            # Store user info in g for use in route
            g.user = payload
            
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        except Exception as e:
            print(f"Admin auth error: {str(e)}")
            return jsonify({'message': 'Authentication failed'}), 401
    
    return decorated_function
