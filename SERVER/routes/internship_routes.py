from flask import Blueprint, request, Response
from controllers.internship_controller import InternshipController
from bson import json_util
from middlewares.auth_middleware import jwt_required
import json

internship_blueprint = Blueprint('internship_routes', __name__)
internship_controller = InternshipController()

@internship_blueprint.route('/scrape', methods=['GET'])
@jwt_required
def scrape_internships():
    category = request.args.get('category', 'web-development-internship')
    result = internship_controller.scrape_internships(category)
    return Response(
        json_util.dumps(result),
        mimetype='application/json'
    )

@internship_blueprint.route('/get', methods=['GET'])
@jwt_required
def get_internships():
    category = request.args.get('category', 'web-development-internship')
    internships = internship_controller.get_internships(category)
    response_data = {
        "success": True,
        "count": len(internships),
        "data": internships
    }
    return Response(
        json_util.dumps(response_data),
        mimetype='application/json'
    )