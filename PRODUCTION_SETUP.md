# Production Setup Guide

This guide will help you deploy the ApplyAsYouGo application to production safely.

## 🔒 Security Checklist

### Environment Variables (CRITICAL)

Before deploying, you MUST update the following environment variables:

#### Backend (SERVER/.env)
```bash
# Replace with your actual MongoDB connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Replace with your actual database name
DB_NAME=your_production_database_name

# Generate a strong, unique JWT secret (use a password generator)
JWT_SECRET=your_super_secure_jwt_secret_at_least_32_characters_long

# Your Google Gemini API key
GEMINI_API_KEY=your_actual_gemini_api_key

# Your production frontend domain(s)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Generate a strong Flask secret key
SECRET_KEY=your_flask_secret_key_at_least_32_characters_long
```

#### Frontend (internity/.env.local)
```bash
# Your production backend URL
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Database Security
1. Ensure MongoDB Atlas has proper IP whitelisting
2. Use strong database credentials
3. Enable MongoDB Atlas encryption at rest
4. Regularly backup your database

### SSL/TLS
1. Use HTTPS for both frontend and backend
2. Obtain SSL certificates (Let's Encrypt recommended)
3. Configure proper SSL headers

## 🚀 Deployment Steps

### 1. Backend Deployment

#### Option A: Docker (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up -d
```

#### Option B: Manual Deployment
```bash
cd SERVER
pip install -r requirements.txt
python app.py
```

### 2. Frontend Deployment

#### Option A: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Option B: Manual Build
```bash
cd internity
npm install
npm run build
npm start
```

## 🔧 Production Configuration

### Nginx Configuration (if using manual deployment)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Environment-Specific Settings

#### Production
- Set `FLASK_ENV=production`
- Disable debug mode
- Use production database
- Enable logging
- Set up monitoring

#### Staging
- Use separate database
- Enable limited debugging
- Test with production-like data

## 📊 Monitoring & Logging

### Recommended Tools
- **Application Monitoring**: Sentry, DataDog
- **Server Monitoring**: New Relic, Prometheus
- **Log Management**: ELK Stack, Splunk
- **Uptime Monitoring**: Pingdom, UptimeRobot

### Health Check Endpoints
- Backend: `GET /` - Returns API status
- Frontend: Built-in Next.js health checks

## 🔐 Security Best Practices

### API Security
- Rate limiting implemented
- CORS properly configured
- JWT tokens with expiration
- Input validation on all endpoints
- SQL injection prevention

### Frontend Security
- XSS protection headers
- Content Security Policy
- Secure cookie settings
- Environment variable validation

## 🚨 Important Notes

1. **Never commit sensitive data** to version control
2. **Use different secrets** for each environment
3. **Regularly rotate API keys** and secrets
4. **Monitor for security vulnerabilities**
5. **Keep dependencies updated**
6. **Backup your database regularly**

## 📞 Support

If you encounter issues during deployment:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure database connectivity
4. Check firewall and security group settings

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor security advisories
- Review and rotate secrets quarterly
- Backup database weekly
- Monitor application performance

### Deployment Pipeline
1. Test in staging environment
2. Run security scans
3. Deploy to production
4. Monitor for issues
5. Rollback if necessary