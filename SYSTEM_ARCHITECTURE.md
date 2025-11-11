# Multi-Platform Credentials System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React/Next.js Frontend)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS/JSON
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FLASK BACKEND API                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Authentication Middleware (JWT)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │         Automation Routes (/api/v1/internships)         │  │
│  │  • POST /search_and_apply                               │  │
│  │  • GET  /status/<task_id>                               │  │
│  │  • GET  /tasks                                          │  │
│  └──────────────────────────┬──────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │           Background Task Manager                        │  │
│  │           (Threading/Task Queue)                         │  │
│  └──────────────────────────┬──────────────────────────────┘  │
│                             │                                   │
│              ┌──────────────┼──────────────┐                   │
│              │              │              │                   │
│  ┌───────────▼───┐  ┌──────▼──────┐  ┌───▼──────────┐        │
│  │  Internshala  │  │   LinkedIn  │  │    Unstop    │        │
│  │  Controller   │  │  Controller │  │  Controller  │        │
│  └───────┬───────┘  └──────┬──────┘  └───┬──────────┘        │
│          │                 │              │                   │
│  ┌───────▼─────────────────▼──────────────▼──────────┐       │
│  │           OAuth Helper Service                     │       │
│  │  • Session Management                              │       │
│  │  • Google Login Handler                            │       │
│  │  • Cookie Persistence                              │       │
│  └────────────────────────┬───────────────────────────┘       │
└───────────────────────────┼───────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
    ┌───────────▼──┐  ┌────▼─────┐  ┌─▼──────────┐
    │ Internshala  │  │ LinkedIn │  │   Unstop   │
    │   Website    │  │ Website  │  │  Website   │
    └──────────────┘  └──────────┘  └────────────┘
```

## Component Interaction Flow

### 1. User Initiates Automation

```
User
  │
  ├─ Enables platforms (checkboxes)
  ├─ Selects login methods
  ├─ Enters credentials
  └─ Clicks "Automate"
      │
      ▼
Frontend Validation
  │
  ├─ At least one platform enabled?
  ├─ Email provided for each enabled platform?
  └─ Password provided for email login?
      │
      ▼
API Request
  POST /api/v1/internships/search_and_apply
  {
    keywords: "web-development",
    max_applications: 20,
    max_pages: 2,
    platforms: {
      internshala: { enabled: true, email: "...", password: "...", loginMethod: "email" },
      linkedin: { enabled: false },
      unstop: { enabled: true, email: "...", loginMethod: "google" }
    }
  }
```

### 2. Backend Processing

```
Automation Route Handler
  │
  ├─ Validate request data
  ├─ Check JWT authentication
  └─ Extract enabled platforms
      │
      ▼
Create Background Task
  │
  ├─ Generate unique task_id
  ├─ Spawn background thread
  └─ Return task_id to user
      │
      ▼
Immediate Response
  {
    success: true,
    task_id: "task_1699876543210",
    platforms: ["internshala", "unstop"]
  }
```

### 3. Background Task Execution

```
For Each Enabled Platform:
  │
  ├─ Platform: Internshala (Email Login)
  │   │
  │   ├─ Initialize InternshalaController
  │   ├─ Create Selenium WebDriver
  │   ├─ Navigate to login page
  │   ├─ Enter email & password
  │   ├─ Submit login form
  │   ├─ Wait for dashboard
  │   ├─ Search for internships
  │   ├─ Apply to each internship
  │   └─ Return results
  │
  ├─ Platform: LinkedIn (Not Implemented)
  │   │
  │   └─ Return status: "not_implemented"
  │
  └─ Platform: Unstop (Google Login)
      │
      ├─ Initialize OAuthHelper
      ├─ Check for saved session
      │   │
      │   ├─ Session exists?
      │   │   ├─ Yes: Load cookies → Skip to search
      │   │   └─ No: Continue to manual login
      │   │
      │   ├─ Navigate to login page
      │   ├─ Click "Google Login" button
      │   ├─ Wait for user to complete OAuth
      │   ├─ Detect successful login
      │   └─ Save session cookies
      │
      ├─ Search for internships
      ├─ Apply to each internship
      └─ Return results
```

### 4. Status Tracking

```
User Polls Status
  │
  ▼
GET /api/v1/internships/status/<task_id>
  │
  ├─ Lookup task in active_tasks
  └─ Return current status
      │
      ▼
Response
  {
    task: {
      task_id: "task_1699876543210",
      status: "running",
      platforms: {
        internshala: {
          status: "completed",
          total_applied: 15,
          applications: [...]
        },
        unstop: {
          status: "running",
          total_applied: 8,
          applications: [...]
        }
      }
    }
  }
```

## Data Models

### Frontend State
```typescript
interface PlatformCredentials {
  enabled: boolean          // Is this platform active?
  email: string            // User's email for this platform
  password: string         // Password (empty for Google login)
  loginMethod: "email" | "google"  // Authentication method
}

interface FormData {
  keywords: string         // Search keywords
  max_applications: number // Max applications per platform
  max_pages: number       // Max pages to search
  platforms: {
    internshala: PlatformCredentials
    linkedin: PlatformCredentials
    unstop: PlatformCredentials
  }
}
```

### Backend Task State
```python
{
  "task_id": "task_1699876543210",
  "status": "running" | "completed" | "failed",
  "started_at": 1699876543.210,
  "completed_at": 1699876789.456,
  "platforms": {
    "internshala": {
      "status": "completed" | "failed" | "running",
      "total_applied": 15,
      "applications": [
        {
          "title": "Web Developer Intern",
          "company": "Tech Corp",
          "success": true
        }
      ],
      "error": null | "Error message"
    }
  }
}
```

### Session Storage
```python
# Stored in: SERVER/sessions/{platform}_session.pkl
[
  {
    "name": "session_id",
    "value": "abc123...",
    "domain": ".internshala.com",
    "path": "/",
    "expiry": 1699999999
  },
  # ... more cookies
]
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Transport Security                           │
│  ├─ HTTPS encryption                                   │
│  └─ Secure WebSocket connections                       │
│                                                         │
│  Layer 2: Authentication                               │
│  ├─ JWT token validation                               │
│  ├─ Token expiration (7 days)                          │
│  └─ Token blacklisting on logout                       │
│                                                         │
│  Layer 3: Authorization                                │
│  ├─ User can only access own tasks                     │
│  └─ Platform credentials isolated per user             │
│                                                         │
│  Layer 4: Data Protection                              │
│  ├─ Credentials not stored in database                 │
│  ├─ Passwords cleared from memory after use            │
│  ├─ Session files encrypted (pickle)                   │
│  └─ No logging of sensitive data                       │
│                                                         │
│  Layer 5: Input Validation                             │
│  ├─ Frontend validation                                │
│  ├─ Backend validation                                 │
│  ├─ SQL injection prevention                           │
│  └─ XSS prevention                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Implementation (Single Server)
```
┌──────────────────────────────────────┐
│         Single Flask Server          │
│  ┌────────────────────────────────┐  │
│  │  Web Server (Flask)            │  │
│  ├────────────────────────────────┤  │
│  │  Background Tasks (Threading)  │  │
│  ├────────────────────────────────┤  │
│  │  Session Storage (File System) │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Future Scalable Architecture
```
┌─────────────────────────────────────────────────────┐
│              Load Balancer (Nginx)                  │
└────────────┬────────────────────────┬────────────────┘
             │                        │
    ┌────────▼────────┐      ┌───────▼────────┐
    │  Flask Server 1 │      │ Flask Server 2 │
    └────────┬────────┘      └───────┬────────┘
             │                        │
             └────────┬───────────────┘
                      │
         ┌────────────▼────────────┐
         │   Task Queue (Celery)   │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │  Message Broker (Redis) │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │  Shared Storage (S3)    │
         │  (Session Files)        │
         └─────────────────────────┘
```

## Error Handling Flow

```
Error Occurs
  │
  ├─ Platform-Level Error
  │   │
  │   ├─ Login Failed
  │   │   └─ Return: { status: "failed", error: "Invalid credentials" }
  │   │
  │   ├─ Network Error
  │   │   └─ Return: { status: "failed", error: "Network timeout" }
  │   │
  │   └─ Application Error
  │       └─ Return: { status: "partial", applied: 5, failed: 3 }
  │
  └─ Task-Level Error
      │
      ├─ No Platforms Enabled
      │   └─ Return 400: "No platforms enabled"
      │
      ├─ Invalid Credentials
      │   └─ Return 400: "Email required for {platform}"
      │
      └─ System Error
          └─ Return 500: "Internal server error"
```

## Performance Metrics

### Expected Performance
```
Single Platform:
  ├─ Login: 5-10 seconds
  ├─ Search: 2-5 seconds per page
  ├─ Apply: 10-15 seconds per application
  └─ Total: ~5-10 minutes for 20 applications

Multiple Platforms (Parallel):
  ├─ Same as single platform (runs concurrently)
  └─ Total: ~5-10 minutes for 60 applications (20 per platform)

Session Reuse (Google Login):
  ├─ Login: 1-2 seconds (cookie load)
  └─ Saves: 5-8 seconds per run
```

### Resource Usage
```
Memory:
  ├─ Flask Server: ~100-200 MB
  ├─ Per Browser Instance: ~200-300 MB
  └─ Total (3 platforms): ~800 MB - 1 GB

CPU:
  ├─ Idle: 1-5%
  ├─ Active Automation: 20-40%
  └─ Peak (3 platforms): 60-80%

Disk:
  ├─ Session Files: ~1-5 MB per platform
  └─ Logs: ~10-50 MB per day
```

## Monitoring & Logging

```
Application Logs
  │
  ├─ Request Logs
  │   ├─ Timestamp
  │   ├─ User ID
  │   ├─ Endpoint
  │   └─ Response Status
  │
  ├─ Task Logs
  │   ├─ Task ID
  │   ├─ Platform
  │   ├─ Status Changes
  │   └─ Error Messages
  │
  └─ Security Logs
      ├─ Failed Login Attempts
      ├─ Invalid Tokens
      └─ Suspicious Activity
```

---

**Architecture Version:** 2.0.0
**Last Updated:** November 11, 2025
