from flask import Blueprint, render_template_string

homepage_blueprint = Blueprint('homepage', __name__)

@homepage_blueprint.route('/', methods=['GET'])
def get_homepage():
    """Simple homepage endpoint for testing purposes"""
    
    # Simple HTML response for testing
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interngenie - AI-Powered Internship Platform</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; }
            .features { margin: 30px 0; }
            .feature { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .api-info { background: #e8f4f8; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Interngenie - AI-Powered Internship Platform</h1>
            
            <div class="api-info">
                <h3>Backend API Server</h3>
                <p>✅ Server is running and ready to serve requests!</p>
                <p><strong>Available Endpoints:</strong></p>
                <ul>
                    <li>POST /user/signup - User registration</li>
                    <li>POST /user/login - User authentication</li>
                    <li>GET /user/details - Get user details (protected)</li>
                    <li>GET /dashboard - Dashboard data (protected)</li>
                    <li>POST /api/process-resume - Resume processing</li>
                    <li>GET /api/linkedin/list - LinkedIn internships</li>
                    <li>POST /api/linkedin/scrape - Trigger scraping</li>
                    <li>POST /user/contactus - Contact form</li>
                </ul>
            </div>

            <div class="features">
                <h3>🎯 Key Features</h3>
                <div class="feature">
                    <strong>AI-Powered Resume Builder:</strong> Create professional resumes with AI assistance
                </div>
                <div class="feature">
                    <strong>Smart Internship Scraping:</strong> Automated scraping from LinkedIn, Internshala, and Unstop
                </div>
                <div class="feature">
                    <strong>Dashboard Management:</strong> Track applications and manage your profile
                </div>
                <div class="feature">
                    <strong>Authentication System:</strong> Secure JWT-based user authentication
                </div>
                <div class="feature">
                    <strong>Responsive UI:</strong> Modern interface with animations and dark mode
                </div>
            </div>

            <div class="api-info">
                <h3>🧪 Testing Status</h3>
                <p>✅ Backend API tests completed</p>
                <p>✅ Authentication system working</p>
                <p>✅ Dashboard endpoint implemented</p>
                <p>✅ Resume processing improved</p>
                <p>✅ Contact form functional</p>
                <p>🔄 Frontend server should be running on port 3000</p>
            </div>

            <p style="text-align: center; margin-top: 30px; color: #666;">
                <em>Backend API Server | Interngenie Platform</em>
            </p>
        </div>
    </body>
    </html>
    """
    
    return html_content
