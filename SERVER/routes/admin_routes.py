from flask import Blueprint, jsonify, request
from database.db_connection import get_db_connection
from middlewares.admin_middleware import admin_required
import jwt
import os

admin_blueprint = Blueprint('admin', __name__)

@admin_blueprint.route('/contact-messages', methods=['GET'])
@admin_required
def get_contact_messages():
    """Get all contact form submissions"""
    try:
        db = get_db_connection()
        contact_collection = db.contact
        
        # Fetch all messages, sorted by most recent first
        messages = list(contact_collection.find(
            {},
            {'_id': 0}  # Exclude MongoDB _id field
        ).sort('created_at', -1))
        
        # Format dates for better readability
        for msg in messages:
            if msg.get('created_at'):
                msg['created_at'] = msg['created_at'].isoformat()
        
        return jsonify({
            'messages': messages,
            'count': len(messages)
        }), 200
        
    except Exception as e:
        print(f"Get contact messages error: {str(e)}")
        return jsonify({'message': 'Failed to fetch messages', 'messages': []}), 500

@admin_blueprint.route('/contact-messages/<status>', methods=['GET'])
@admin_required
def get_contact_messages_by_status(status):
    """Get contact messages filtered by status (new, read, resolved)"""
    try:
        db = get_db_connection()
        contact_collection = db.contact
        
        messages = list(contact_collection.find(
            {'status': status},
            {'_id': 0}
        ).sort('created_at', -1))
        
        for msg in messages:
            if msg.get('created_at'):
                msg['created_at'] = msg['created_at'].isoformat()
        
        return jsonify({
            'messages': messages,
            'count': len(messages),
            'status': status
        }), 200
        
    except Exception as e:
        print(f"Get contact messages by status error: {str(e)}")
        return jsonify({'message': 'Failed to fetch messages', 'messages': []}), 500

@admin_blueprint.route('/check-admin', methods=['GET'])
def check_admin_status():
    """Check if the current user is an admin (no authentication required for checking)"""
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'isAdmin': False}), 200
        
        try:
            token = auth_header.split(" ")[1] if " " in auth_header else auth_header
            payload = jwt.decode(token, os.getenv("JWT_SECRET", "5caba265540278dd7885f6b6950c4904"), algorithms=['HS256'])
            user_email = payload.get('email', '').lower()
            
            # Get admin emails from environment
            admin_emails_str = os.getenv("ADMIN_EMAILS", "")
            admin_emails = [email.strip().lower() for email in admin_emails_str.split(",") if email.strip()]
            
            is_admin = user_email in admin_emails
            
            return jsonify({'isAdmin': is_admin}), 200
            
        except:
            return jsonify({'isAdmin': False}), 200
            
    except Exception as e:
        print(f"Check admin status error: {str(e)}")
        return jsonify({'isAdmin': False}), 200
