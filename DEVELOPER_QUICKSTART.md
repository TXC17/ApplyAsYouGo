# Developer Quick Start - Multi-Platform Credentials

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
# Backend (if not already installed)
cd SERVER
pip install flask flask-cors selenium

# Frontend (if not already installed)
cd internity
npm install
```

### 2. Start the Servers

**Backend:**
```bash
cd SERVER
python app.py
```

**Frontend:**
```bash
cd internity
npm run dev
```

### 3. Test the New Feature

1. Navigate to `http://localhost:3000/dashboard`
2. Find "Automated Internship Applier" card
3. You should see the new multi-platform form

## Quick Test Scenarios

### Test 1: Single Platform (Email Login)
```javascript
// Enable only Internshala
// Login Method: Email & Password
// Email: test@example.com
// Password: testpass123
// Click Automate
```

### Test 2: Multiple Platforms (Same Credentials)
```javascript
// Enable Internshala, LinkedIn, Unstop
// All use same email/password
// Click Automate
```

### Test 3: Google Login
```javascript
// Enable Internshala
// Login Method: Google Login
// Email: your.google@gmail.com
// Click Automate
// Complete manual login in browser
```

## API Testing with cURL

### Start Automation
```bash
curl -X POST http://localhost:5000/api/v1/internships/search_and_apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "keywords": "web-development",
    "max_applications": 5,
    "max_pages": 1,
    "platforms": {
      "internshala": {
        "enabled": true,
        "email": "test@example.com",
        "password": "testpass123",
        "loginMethod": "email"
      },
      "linkedin": {
        "enabled": false
      },
      "unstop": {
        "enabled": false
      }
    }
  }'
```

### Check Status
```bash
curl http://localhost:5000/api/v1/internships/status/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Code Structure Overview

### Frontend Component
```typescript
// internity/src/app/dashboard/components/smart-scraper-credentials-form.tsx

interface PlatformCredentials {
  enabled: boolean
  email: string
  password: string
  loginMethod: "email" | "google"
}

interface FormData {
  keywords: string
  max_applications: number
  max_pages: number
  platforms: {
    internshala: PlatformCredentials
    linkedin: PlatformCredentials
    unstop: PlatformCredentials
  }
}
```

### Backend Route
```python
# SERVER/routes/automation_routes.py

@automation_blueprint.route('/search_and_apply', methods=['POST'])
@jwt_required
def search_and_apply():
    # Validates credentials
    # Starts background task
    # Returns task_id
```

### OAuth Helper
```python
# SERVER/services/oauth_helper.py

class OAuthHelper:
    def save_session(driver)      # Save cookies
    def load_session(driver)      # Load cookies
    def wait_for_manual_login()   # Wait for user
```

## Adding a New Platform

### Step 1: Update Frontend Type
```typescript
// Add to FormData interface
platforms: {
  internshala: PlatformCredentials
  linkedin: PlatformCredentials
  unstop: PlatformCredentials
  newplatform: PlatformCredentials  // Add this
}
```

### Step 2: Add UI Section
```tsx
{/* Copy existing platform section and modify */}
<div className="mb-6 p-4 rounded-lg bg-[rgba(30,30,35,0.3)]">
  <Checkbox
    id="newplatform-enabled"
    checked={formData.platforms.newplatform.enabled}
    onCheckedChange={() => handlePlatformToggle("newplatform")}
  />
  <Label>New Platform</Label>
  {/* ... rest of fields */}
</div>
```

### Step 3: Create Bot Controller
```python
# SERVER/controllers/newplatform_controller.py

class NewPlatformController:
    def __init__(self, email, password=None, login_method='email'):
        self.email = email
        self.password = password
        self.login_method = login_method
    
    def process_search(self, keywords, max_applications, max_pages):
        # Implement automation logic
        pass
```

### Step 4: Add to Automation Route
```python
# SERVER/routes/automation_routes.py

elif platform_name == "newplatform":
    if config['loginMethod'] == 'email':
        controller = NewPlatformController(
            config['email'], 
            config['password']
        )
    else:
        controller = NewPlatformController(
            config['email'],
            login_method='google'
        )
    
    result = controller.process_search(keywords, max_applications, max_pages)
```

### Step 5: Add OAuth Handler (if needed)
```python
# SERVER/services/oauth_helper.py

@staticmethod
def handle_newplatform_google_login(driver, email):
    oauth_helper = OAuthHelper("newplatform")
    driver.get("https://newplatform.com/login")
    # ... implement login flow
```

## Debugging Tips

### Frontend Debugging
```javascript
// Add console logs in form component
console.log('Form data:', formData)
console.log('Enabled platforms:', Object.entries(formData.platforms)
  .filter(([_, config]) => config.enabled))
```

### Backend Debugging
```python
# Add print statements in automation route
print(f"Received platforms: {platforms}")
print(f"Enabled platforms: {enabled_platforms}")
print(f"Task ID: {task_id}")
```

### Check Session Files
```bash
# List session files
ls -la SERVER/sessions/

# View session file (binary)
python -c "import pickle; print(pickle.load(open('SERVER/sessions/internshala_session.pkl', 'rb')))"
```

### Monitor Background Tasks
```python
# In automation_routes.py
print(f"Active tasks: {list(active_tasks.keys())}")
print(f"Task status: {active_tasks.get(task_id)}")
```

## Common Issues & Fixes

### Issue: "Module not found: oauth_helper"
```bash
# Make sure file exists
ls SERVER/services/oauth_helper.py

# Check Python path
cd SERVER
python -c "import services.oauth_helper"
```

### Issue: "Checkbox component not found"
```bash
# Check if component exists
ls internity/src/components/ui/checkbox.tsx

# If missing, install shadcn checkbox
npx shadcn-ui@latest add checkbox
```

### Issue: Session files not saving
```bash
# Create sessions directory
mkdir -p SERVER/sessions

# Check permissions
chmod 755 SERVER/sessions
```

### Issue: CORS errors
```python
# In SERVER/app.py, verify CORS config
CORS(app, resources={r"/*": {"origins": "*"}})  # For development only
```

## Performance Optimization

### Frontend
- Debounce input changes
- Lazy load platform sections
- Memoize handlers

### Backend
- Use connection pooling for database
- Implement task queue (Celery/RQ)
- Cache session files in memory
- Add rate limiting

## Security Checklist

- [ ] Validate all inputs on backend
- [ ] Use HTTPS in production
- [ ] Don't log passwords
- [ ] Encrypt session files
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets

## Testing Commands

### Run Frontend Tests
```bash
cd internity
npm test
```

### Run Backend Tests
```bash
cd SERVER
python -m pytest tests/
```

### Manual Testing Checklist
- [ ] Form renders correctly
- [ ] Can enable/disable platforms
- [ ] Can switch login methods
- [ ] Validation works
- [ ] API call succeeds
- [ ] Background task runs
- [ ] Status endpoint works
- [ ] Google login flow works
- [ ] Session persistence works

## Useful Commands

### Clear All Sessions
```bash
rm SERVER/sessions/*.pkl
```

### Restart Backend
```bash
# Kill existing process
pkill -f "python app.py"

# Start fresh
cd SERVER && python app.py
```

### View Logs
```bash
# Backend logs
tail -f SERVER/logs/app.log

# Frontend logs
# Check browser console
```

### Database Queries
```python
# Check applications
from database.db_connection import get_db_connection
db = get_db_connection()
apps = db.internship_applications.find().limit(10)
for app in apps:
    print(app)
```

## Resources

- **Flask Docs:** https://flask.palletsprojects.com/
- **Selenium Docs:** https://selenium-python.readthedocs.io/
- **React Docs:** https://react.dev/
- **Shadcn UI:** https://ui.shadcn.com/

## Need Help?

1. Check error messages in browser console
2. Check server logs
3. Review the guides:
   - `MULTI_PLATFORM_CREDENTIALS_GUIDE.md`
   - `CREDENTIAL_MIGRATION_GUIDE.md`
   - `IMPLEMENTATION_SUMMARY.md`
4. Search for similar issues
5. Ask the team

---

**Happy Coding! 🚀**
