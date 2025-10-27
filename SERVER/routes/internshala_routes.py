from flask import Blueprint, request, jsonify
from controllers.internshala_controller import InternshalaController

# Create the blueprint for Internshala API routes
internshala_bp = Blueprint('internshala_internships', __name__, url_prefix='/api/internshala')
controller = InternshalaController()

@internshala_bp.route('/list', methods=['GET'])
def api_list_internshala_internships():
    """API endpoint to get Internshala internships as JSON"""
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

@internshala_bp.route('/<internship_id>', methods=['GET'])
def api_get_internshala_internship(internship_id):
    """API endpoint to get a specific Internshala internship by ID"""
    result = controller.get_internship_by_id(internship_id)
    return jsonify(result)

@internshala_bp.route('/scrape', methods=['POST'])
def api_scrape_internshala_internships():
    """API endpoint to trigger Internshala internship scraping"""
    data = request.json or {}

    filters = {
        'category': data.get('category', 'web-development'),
        'usertype': data.get('usertype', 'fresher'),
        'passing_year': data.get('passing_year', '2027'),
        'quick_apply': data.get('quick_apply', True)
    }

    result = controller.trigger_scrape_internships(filters)
    return jsonify(result)

@internshala_bp.route('/statistics', methods=['GET'])
def api_internshala_statistics():
    """API endpoint to get statistics about Internshala internships"""
    result = controller.get_internship_statistics()
    return jsonify(result)
