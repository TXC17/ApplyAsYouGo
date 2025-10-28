from flask import Blueprint, request, jsonify
from controllers.linkedin_controller import LinkedInController

# Create the blueprint for LinkedIn API routes
linkedin_bp = Blueprint('linkedin_internships', __name__, url_prefix='/api/linkedin')
controller = LinkedInController()

@linkedin_bp.route('/list', methods=['GET'])
def api_list_linkedin_internships():
    """API endpoint to get LinkedIn internships as JSON"""
    # Get query parameters for filtering
    category = request.args.get('category')
    company = request.args.get('company')
    title_search = request.args.get('title')
    days_left = request.args.get('days_left')
    
    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    filters = {}
    if category:
        filters['category'] = category
    if company:
        filters['company'] = company
    if title_search:
        filters['title'] = {"$regex": title_search, "$options": "i"}
    if days_left:
        filters['days_left'] = days_left

    result = controller.get_all_internships(filters)
    return jsonify(result)

@linkedin_bp.route('/<internship_id>', methods=['GET'])
def api_get_linkedin_internship(internship_id):
    """API endpoint to get a specific LinkedIn internship by ID"""
    result = controller.get_internship_by_id(internship_id)
    return jsonify(result)

@linkedin_bp.route('/scrape', methods=['POST'])
def api_scrape_linkedin_internships():
    """API endpoint to trigger LinkedIn internship scraping"""
    data = request.json or {}
    
    filters = {
        'category': data.get('category', 'internship'),
        'usertype': data.get('usertype', 'fresher'),
        'passing_year': data.get('passing_year', '2027'),
        'quick_apply': data.get('quick_apply', True)
    }

    try:
        result = controller.trigger_scrape_internships(filters)
        
        if result.get('count', 0) > 0:
            return jsonify({
                'success': True,
                'message': result.get('message', 'Scraping completed successfully'),
                'count': result.get('count', 0)
            })
        else:
            return jsonify({
                'success': False,
                'message': result.get('message', 'No internships found'),
                'count': 0
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Scraping failed: {str(e)}',
            'count': 0
        }), 500

@linkedin_bp.route('/statistics', methods=['GET'])
def api_linkedin_statistics():
    """API endpoint to get statistics about LinkedIn internships"""
    result = controller.get_internship_statistics()
    return jsonify(result)
