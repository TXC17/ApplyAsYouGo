from flask import Blueprint, request, jsonify
from middlewares.auth_middleware import jwt_required
from database.db_connection import get_db_connection
import datetime

dashboard_blueprint = Blueprint('dashboard', __name__)

@dashboard_blueprint.route('/dashboard', methods=['GET'])
@jwt_required
def get_dashboard_data():
    """
    Get dashboard data for authenticated user including profile info and internship tracking
    """
    try:
        # Get user info from JWT token (set by auth middleware)
        from flask import g
        user_data = g.user
        
        # Get database connection
        db = get_db_connection()
        
        # Get user profile data
        users_collection = db.users
        user = users_collection.find_one({'email': user_data['email']})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's internship applications (if any)
        internships_collection = db.internship_applications
        user_internships = list(internships_collection.find({'user_email': user_data['email']}))
        
        # Get recent internship listings from all platforms
        linkedin_collection = db.linkedin_internships
        internshala_collection = db.internshala_internships
        unstop_collection = db.unstop_internships
        
        # Get recent internships (last 10 from each platform)
        recent_linkedin = list(linkedin_collection.find().sort('scraped_at', -1).limit(5))
        recent_internshala = list(internshala_collection.find().sort('scraped_at', -1).limit(5))
        recent_unstop = list(unstop_collection.find().sort('scraped_at', -1).limit(5))
        
        # Prepare dashboard response
        dashboard_data = {
            'profile': {
                'name': user.get('name', ''),
                'email': user.get('email', ''),
                'created_at': user.get('created_at', datetime.datetime.now(datetime.timezone.utc)).isoformat() if user.get('created_at') else None
            },
            'internships': {
                'applications': user_internships,
                'recent_listings': {
                    'linkedin': recent_linkedin,
                    'internshala': recent_internshala,
                    'unstop': recent_unstop
                }
            },
            'stats': {
                'total_applications': len(user_internships),
                'recent_listings_count': len(recent_linkedin) + len(recent_internshala) + len(recent_unstop),
                'linkedin_count': len(recent_linkedin),
                'internshala_count': len(recent_internshala),
                'unstop_count': len(recent_unstop)
            }
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get dashboard data: {str(e)}'}), 500

@dashboard_blueprint.route('/dashboard/stats', methods=['GET'])
@jwt_required
def get_dashboard_stats():
    """
    Get dashboard statistics for authenticated user
    """
    try:
        from flask import g
        user_data = g.user
        
        db = get_db_connection()
        internships_collection = db.internship_applications
        
        # Get user's application statistics
        user_applications = list(internships_collection.find({'user_email': user_data['email']}))
        
        # Count applications by status
        status_counts = {}
        for app in user_applications:
            status = app.get('status', 'unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
        
        stats = {
            'total_applications': len(user_applications),
            'status_breakdown': status_counts,
            'last_activity': user_applications[0].get('applied_at').isoformat() if user_applications else None
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get stats: {str(e)}'}), 500
