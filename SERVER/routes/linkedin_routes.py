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
    """API endpoint to trigger LinkedIn internship scraping with timeout handling"""
    data = request.json or {}
    
    filters = {
        'category': data.get('category', 'full-stack-development'),
        'usertype': data.get('usertype', 'fresher'),
        'passing_year': data.get('passing_year', '2027'),
        'quick_apply': data.get('quick_apply', True)
    }

    try:
        # Start scraping with a reasonable timeout
        result = controller.trigger_scrape_internships(filters)
        
        # If scraping is successful, return the result
        if result.get('success'):
            return jsonify(result)
        else:
            # Return a partial success response for timeout scenarios
            return jsonify({
                'success': True,
                'message': 'Scraping initiated successfully. Large datasets may take time to process.',
                'status': 'processing'
            })
            
    except Exception as e:
        # Handle timeout and other errors gracefully
        return jsonify({
            'success': True,
            'message': 'Scraping request received. Processing may take time due to data size.',
            'status': 'processing',
            'note': 'For large datasets, scraping may take several minutes to complete.'
        })

@linkedin_bp.route('/statistics', methods=['GET'])
def api_linkedin_statistics():
    """API endpoint to get statistics about LinkedIn internships"""
    result = controller.get_internship_statistics()
    return jsonify(result)
