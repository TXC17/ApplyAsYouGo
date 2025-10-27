# from flask import Blueprint, request, jsonify
# from controllers.unstop_controller import InternshipController

# # Create Blueprint for internship routes
# internship_bp = Blueprint('internships', __name__)

# # Initialize controller
# internship_controller = InternshipController()

# @internship_bp.route('/scrape', methods=['POST'])
# def scrape_internships():
#     """Endpoint to trigger scraping of internships based on dynamic parameters"""
#     # Get parameters from request
#     data = request.json
    
#     if not data:
#         return jsonify({
#             'success': False,
#             'message': 'Request body is required'
#         }), 400
    
#     # Call controller to handle scraping with dynamic parameters
#     result = internship_controller.scrape_and_save_dynamic(data)
    
#     # Return response
#     status_code = 200 if result['success'] else 500
#     return jsonify(result), status_code

# @internship_bp.route('/', methods=['GET'])
# def get_internships():
#     """Endpoint to get internships with pagination"""
#     # Get query parameters
#     limit = request.args.get('limit', default=20, type=int)
#     skip = request.args.get('skip', default=0, type=int)
    
#     # Call controller to get internships
#     result = internship_controller.get_internships(limit=limit, skip=skip)
    
#     # Return response
#     status_code = 200 if result['success'] else 500
#     return jsonify(result), status_code

# @internship_bp.route('/<opp_id>', methods=['GET'])
# def get_internship(opp_id):
#     """Endpoint to get a single internship by ID"""
#     # Call controller to get internship
#     result = internship_controller.get_internship(opp_id)
    
#     # Return response
#     status_code = 200 if result['success'] else 404 if result.get('message', '').endswith('not found') else 500
#     return jsonify(result), status_code