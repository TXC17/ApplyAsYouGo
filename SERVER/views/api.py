from flask import Blueprint, request, jsonify
from controllers.bot_controller import InternshalaController

internship_blueprint = Blueprint('internship', __name__)

@internship_blueprint.route('/search_and_apply', methods=['POST'])
def search_and_apply():
    """
    Search for internships and optionally apply to a specific internship.

    Expected JSON payload:
    {
        "keywords": "python",
        "max_applications": 5,
        "max_pages": 2,
        "credentials": {
            "email": "email@example.com",
            "password": "password"
        },
        "url": "https://internshala.com/internship/detail/..."  # Optional
    }
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    keywords = data.get('keywords')
    max_applications = data.get('max_applications', 5)
    max_pages = data.get('max_pages', 2)
    credentials = data.get('credentials', {})
    url = data.get('url')  # Optional

    if not keywords:
        return jsonify({"error": "No keywords provided"}), 400

    if not credentials.get('email') or not credentials.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    try:
        controller = InternshalaController(
            credentials.get('email'), 
            credentials.get('password')
        )

        # Perform search
        search_result = controller.process_search(
            keywords, 
            max_applications=max_applications,
            max_pages=max_pages
        )

        # Optionally apply to a specific internship
        if url:
            apply_result = controller.apply_to_specific_internship(url)
            return jsonify({"search_result": search_result, "apply_result": apply_result}), 200

        return jsonify({"search_result": search_result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500