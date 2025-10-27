# controllers/scraper_controller.py
from flask import Blueprint, request, jsonify
from services.unstop_scraper import ScraperService
import json

# Create a Blueprint for scraper routes
scraper_bp = Blueprint('scraper', __name__)

# MongoDB connection URI - update with your connection string if needed
MONGODB_URI = "mongodb://localhost:27017/"

@scraper_bp.route('/scrape', methods=['POST'])
def scrape_internships():
    """API endpoint to start scraping internships based on parameters"""
    try:
        # Get request body
        req_data = request.get_json()
        
        if not req_data:
            return jsonify({
                "status": "error",
                "message": "No request body provided"
            }), 400
            
        # Validate required fields
        # Add validation as needed
            
        # Initialize scraper service
        scraper_service = ScraperService(MONGODB_URI)
        
        # Start scraping
        result = scraper_service.scrape_internships(req_data)
        
        # Clean up resources
        scraper_service.cleanup()
        
        if result.get("status") == "error":
            return jsonify(result), 500
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@scraper_bp.route('/internships', methods=['GET'])
def get_internships():
    """API endpoint to get internships from the database"""
    try:
        # Get limit parameter from query string
        limit = request.args.get('limit', default=None, type=int)
        
        # Initialize scraper service
        scraper_service = ScraperService(MONGODB_URI)
        
        # Get internships from database
        internships = scraper_service.get_internships_from_db(limit)
        
        # Clean up resources
        scraper_service.cleanup()
        
        return jsonify({
            "status": "success",
            "count": len(internships),
            "internships": internships
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500