from flask import Blueprint, request, jsonify
from middlewares.auth_middleware import jwt_required
from controllers.bot_controller import InternshalaController
from controllers.linkedin_bot_controller import LinkedInController
import threading
import time

automation_blueprint = Blueprint('automation', __name__)

# Store active automation tasks
active_tasks = {}

def run_automation_task(task_id, platforms, keywords, max_applications, max_pages, user_profile=None):
    """Background task to run automation across multiple platforms"""
    print(f"\n{'='*60}")
    print(f"[AUTOMATION] Starting task {task_id}")
    print(f"[AUTOMATION] Keywords: {keywords}")
    print(f"[AUTOMATION] Max Applications: {max_applications}, Max Pages: {max_pages}")
    print(f"[AUTOMATION] Platforms: {list(platforms.keys())}")
    print(f"[AUTOMATION] User Profile: {'Loaded' if user_profile else 'Not found'}")
    print(f"{'='*60}\n")
    
    results = {
        "task_id": task_id,
        "status": "running",
        "platforms": {},
        "started_at": time.time()
    }
    
    # Store initial results immediately
    active_tasks[task_id] = results
    
    try:
        # Process each enabled platform
        for platform_name, config in platforms.items():
            if not config.get('enabled', False):
                continue
            
            print(f"[AUTOMATION] Processing platform: {platform_name}")
                
            platform_result = {
                "status": "pending",
                "applications": [],
                "total_applied": 0,
                "error": None
            }
            
            try:
                if platform_name == "internshala":
                    # Handle Internshala automation
                    login_method = config.get('loginMethod', 'email')
                    print(f"[INTERNSHALA] Login method: {login_method}")
                    print(f"[INTERNSHALA] Email: {config.get('email')}")
                    
                    print(f"[INTERNSHALA] Initializing controller...")
                    if login_method == 'google':
                        controller = InternshalaController(
                            config['email'],
                            password=None,
                            login_method='google',
                            user_profile=user_profile
                        )
                    else:
                        controller = InternshalaController(
                            config['email'], 
                            config['password'],
                            login_method='email',
                            user_profile=user_profile
                        )
                    
                    print(f"[INTERNSHALA] Starting automation process...")
                    result = controller.process_search(keywords, max_applications, max_pages)
                    print(f"[INTERNSHALA] Automation completed. Result: {result}")
                    
                    platform_result.update({
                        "status": "completed" if result.get('success') else "failed",
                        "applications": result.get('applications', []),
                        "total_applied": result.get('total_applied', 0),
                        "message": result.get('message', ''),
                        "login_method": login_method
                    })
                
                elif platform_name == "linkedin":
                    # Handle LinkedIn automation
                    login_method = config.get('loginMethod', 'email')
                    print(f"[LINKEDIN] Login method: {login_method}")
                    print(f"[LINKEDIN] Email: {config.get('email')}")
                    
                    print(f"[LINKEDIN] Initializing controller...")
                    if login_method == 'google':
                        controller = LinkedInController(
                            config['email'],
                            password=None,
                            login_method='google',
                            user_profile=user_profile
                        )
                    else:
                        controller = LinkedInController(
                            config['email'], 
                            config['password'],
                            login_method='email',
                            user_profile=user_profile
                        )
                    
                    print(f"[LINKEDIN] Starting automation process...")
                    result = controller.process_search(keywords, max_applications, max_pages)
                    print(f"[LINKEDIN] Automation completed. Result: {result}")
                    
                    platform_result.update({
                        "status": "completed" if result.get('success') else "failed",
                        "applications": result.get('applications', []),
                        "total_applied": result.get('total_applied', 0),
                        "message": result.get('message', ''),
                        "login_method": login_method
                    })
                        
            except Exception as e:
                print(f"[ERROR] Platform {platform_name} error: {str(e)}")
                import traceback
                traceback.print_exc()
                platform_result.update({
                    "status": "error",
                    "error": str(e)
                })
            
            results["platforms"][platform_name] = platform_result
            # Update task status after each platform
            active_tasks[task_id] = results
        
        results["status"] = "completed"
        results["completed_at"] = time.time()
        print(f"\n[AUTOMATION] Task {task_id} completed successfully!")
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"\n[ERROR] Task {task_id} failed: {str(e)}")
        import traceback
        traceback.print_exc()
        print(f"{'='*60}\n")
        results["status"] = "failed"
        results["error"] = str(e)
        results["completed_at"] = time.time()
    
    # Store final results
    active_tasks[task_id] = results


@automation_blueprint.route('/search_and_apply', methods=['POST'])
@jwt_required
def search_and_apply():
    """Start automated internship application across multiple platforms"""
    try:
        from flask import g
        from database.db_connection import get_db_connection
        
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        keywords = data.get('keywords', 'web-development')
        max_applications = data.get('max_applications', 20)
        max_pages = data.get('max_pages', 2)
        platforms = data.get('platforms', {})
        
        # Validate at least one platform is enabled
        enabled_platforms = {k: v for k, v in platforms.items() if v.get('enabled', False)}
        
        if not enabled_platforms:
            return jsonify({'message': 'No platforms enabled'}), 400
        
        # Validate credentials for enabled platforms
        for platform_name, config in enabled_platforms.items():
            if not config.get('email'):
                return jsonify({'message': f'Email required for {platform_name}'}), 400
            
            if config.get('loginMethod') == 'email' and not config.get('password'):
                return jsonify({'message': f'Password required for {platform_name} with email login'}), 400
        
        # Fetch user's application profile
        user_data = g.user
        db = get_db_connection()
        profiles_collection = db.application_profiles
        
        profile_doc = profiles_collection.find_one({'user_email': user_data['email']})
        user_profile = profile_doc.get('profile', {}) if profile_doc else {}
        
        print(f"[AUTOMATION] User profile loaded: {bool(user_profile)}")
        if not user_profile:
            print("[AUTOMATION] WARNING: No application profile found. Applications may fail if forms require additional info.")
        
        # Generate task ID
        task_id = f"task_{int(time.time() * 1000)}"
        
        # Start automation in background thread
        thread = threading.Thread(
            target=run_automation_task,
            args=(task_id, enabled_platforms, keywords, max_applications, max_pages, user_profile)
        )
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'success': True,
            'message': 'Automation started successfully',
            'task_id': task_id,
            'platforms': list(enabled_platforms.keys())
        }), 200
        
    except Exception as e:
        print(f"Automation error: {str(e)}")
        return jsonify({'message': f'Failed to start automation: {str(e)}'}), 500


@automation_blueprint.route('/status/<task_id>', methods=['GET'])
@jwt_required
def get_automation_status(task_id):
    """Get the status of an automation task"""
    try:
        if task_id not in active_tasks:
            return jsonify({'message': 'Task not found'}), 404
        
        task_data = active_tasks[task_id]
        return jsonify({
            'success': True,
            'task': task_data
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error retrieving task status: {str(e)}'}), 500


@automation_blueprint.route('/tasks', methods=['GET'])
@jwt_required
def get_all_tasks():
    """Get all automation tasks"""
    try:
        return jsonify({
            'success': True,
            'tasks': active_tasks
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error retrieving tasks: {str(e)}'}), 500
