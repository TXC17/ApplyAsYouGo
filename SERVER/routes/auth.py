from flask import Blueprint, request, jsonify,g
from werkzeug.security import check_password_hash
from database.db_connection import get_db_connection
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv
from middlewares.auth_middleware import jwt_required

# Load environment variables
load_dotenv()

auth_blueprint = Blueprint('auth', __name__)

# Load from .env
JWT_SECRET = os.getenv("JWT_SECRET", "5caba265540278dd7885f6b6950c4904")
JWT_ALGORITHM = 'HS256'

@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validate required fields
        if not name or not email or not password:
            return jsonify({'message': 'All fields are required'}), 400
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({'message': 'Invalid email format'}), 400
        
        # Validate password strength
        if len(password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters long'}), 400

        db = get_db_connection()
        users_collection = db.users

        # Check if user exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        hashed_password_str = hashed_password.decode('utf-8')

        user_data = {
            'name': name,
            'email': email,
            'password': hashed_password_str,
            'created_at': datetime.datetime.now(datetime.timezone.utc)
        }

        result = users_collection.insert_one(user_data)
        
        if not result.inserted_id:
            return jsonify({'message': 'Failed to create user'}), 500

        # Generate JWT
        payload = {
            'name': name,
            'email': email,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {
                'name': name,
                'email': email
            }
        }), 201
        
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500


@auth_blueprint.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({'message': 'Email and password required'}), 400

        db = get_db_connection()
        users_collection = db.users

        user = users_collection.find_one({'email': email})

        # CRITICAL FIX: Always check both user existence AND password
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401

        # CRITICAL FIX: Ensure password verification is properly checked
        try:
            # Handle both string and bytes password storage
            stored_password = user['password']
            if isinstance(stored_password, str):
                stored_password = stored_password.encode('utf-8')
            
            password_valid = bcrypt.checkpw(password.encode('utf-8'), stored_password)
            if not password_valid:
                return jsonify({'message': 'Invalid credentials'}), 401
        except Exception as e:
            print(f"Password verification error: {str(e)}")
            print(f"Stored password type: {type(user['password'])}")
            print(f"Input password: {password}")
            return jsonify({'message': 'Invalid credentials'}), 401

        # Only generate token if authentication is successful
        payload = {
            'name': user['name'],
            'email': email,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@auth_blueprint.route('/contactus', methods=['POST'])
def contact_us():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        message = data.get('message', '').strip()
        phone = data.get('phone', '').strip()

        if not name or not email or not message:
            return jsonify({'message': 'Name, email, and message are required'}), 400

        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({'message': 'Invalid email format'}), 400

        db = get_db_connection()
        contact_collection = db.contact

        contact_data = {
            'name': name,
            'email': email,
            'message': message,
            'phone': phone,
            'created_at': datetime.datetime.now(datetime.timezone.utc),
            'status': 'new'
        }

        result = contact_collection.insert_one(contact_data)
        
        if not result.inserted_id:
            return jsonify({'message': 'Failed to send message'}), 500

        return jsonify({
            'message': 'Thank you for your message! We will get back to you soon.',
            'success': True
        }), 201
        
    except Exception as e:
        print(f"Contact form error: {str(e)}")
        return jsonify({'message': 'Failed to send message. Please try again later.'}), 500

@auth_blueprint.route('/details', methods=['GET'])
@jwt_required
def get_user():
    try:
        # Get fresh user data from database instead of JWT token
        user_data = g.user
        email = user_data.get('email')
        
        db = get_db_connection()
        users_collection = db.users
        
        # Fetch current user data from database
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Return fresh user data
        response_data = {
            'name': user.get('name', ''),
            'email': user.get('email', ''),
            'phone': user.get('phone', ''),
            'created_at': user.get('created_at').isoformat() if user.get('created_at') else None
        }
        
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_blueprint.route('/logout', methods=['POST'])
@jwt_required
def logout():
    """Logout user and invalidate token"""
    try:
        # Get the token from the request and blacklist it
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token.split(" ")[1]
            # Import and use the blacklist function
            from middlewares.auth_middleware import blacklist_token
            blacklist_token(token)
        
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_blueprint.route('/profile', methods=['PUT'])
@jwt_required
def update_profile():
    """Update user profile information"""
    try:
        user_data = g.user
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        
        if not name:
            return jsonify({'message': 'Name is required'}), 400
        
        db = get_db_connection()
        users_collection = db.users
        
        # Update user profile
        update_data = {
            'name': name,
            'phone': phone,
            'updated_at': datetime.datetime.now(datetime.timezone.utc)
        }
        
        result = users_collection.update_one(
            {'email': user_data['email']}, 
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'name': name,
                'email': user_data['email'],
                'phone': phone
            }
        }), 200
        
    except Exception as e:
        print(f"Profile update error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@auth_blueprint.route('/preferences', methods=['POST'])
@jwt_required
def save_preferences():
    """Save user application preferences"""
    try:
        user_data = g.user
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        db = get_db_connection()
        preferences_collection = db.user_preferences
        
        # Prepare preferences data
        preferences_data = {
            'user_email': user_data['email'],
            'auto_apply': data.get('auto_apply', False),
            'preferred_locations': data.get('preferred_locations', []),
            'preferred_skills': data.get('preferred_skills', []),
            'updated_at': datetime.datetime.now(datetime.timezone.utc)
        }
        
        # Upsert preferences (update if exists, insert if not)
        result = preferences_collection.update_one(
            {'user_email': user_data['email']},
            {'$set': preferences_data},
            upsert=True
        )
        
        return jsonify({
            'message': 'Preferences saved successfully',
            'preferences': preferences_data
        }), 200
        
    except Exception as e:
        print(f"Save preferences error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@auth_blueprint.route('/test-auth', methods=['GET'])
@jwt_required
def test_auth():
    """Simple test endpoint to verify JWT middleware"""
    try:
        user_data = g.user
        return jsonify({
            'message': 'Authentication successful',
            'user': user_data
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_blueprint.route('/delete', methods=['DELETE'])
@jwt_required
def delete_user():
    """Delete user account and all associated data"""
    try:
        user_data = g.user
        db = get_db_connection()
        users_collection = db.users
        
        # Delete user from database
        result = users_collection.delete_one({'email': user_data['email']})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'User not found'}), 404
        
        # Optionally delete associated data (resumes, applications, etc.)
        # This is for cleanup purposes
        resume_collection = db.resumes
        resume_collection.delete_many({'user_email': user_data['email']})
        
        internship_applications = db.internship_applications
        internship_applications.delete_many({'user_email': user_data['email']})
        
        return jsonify({'message': 'User account deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500