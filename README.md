# Interngenie - AI-Powered Internship Platform

A comprehensive platform that helps students find internships using AI-powered scraping and resume building tools.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **AI-Powered Scraping**: Automatically scrapes internships from multiple platforms
- **Resume Builder**: Create professional resumes with AI assistance
- **Dashboard**: Track applications and manage profile
- **Real-time Updates**: Get notified about new opportunities

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Component library

### Backend
- **Flask** - Python web framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Authentication
- **BeautifulSoup** - Web scraping
- **Selenium** - Dynamic content scraping

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account

### Frontend Setup
```bash
cd internity
npm install
npm run dev
```

### Backend Setup
```bash
cd SERVER
pip install -r requirements.txt
python app.py
```

## 🔧 Environment Variables

Create a `.env` file in the `SERVER` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_jwt_key
```

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment

#### Frontend (Vercel/Netlify)
```bash
cd internity
npm run build
npm start
```

#### Backend (Railway/Heroku)
```bash
cd SERVER
pip install -r requirements.txt
python app.py
```

## 📊 API Endpoints

### Authentication
- `POST /user/signup` - User registration
- `POST /user/login` - User login
- `GET /user/details` - Get user details (protected)

### Internships
- `GET /api/internships/linkedin` - LinkedIn internships
- `GET /api/internships/internshala` - Internshala internships
- `GET /api/internships/unstop` - Unstop internships

### Contact
- `POST /user/contactus` - Contact form submission

## 🧪 Testing

Run the comprehensive test suite:
```bash
cd SERVER
python test_endpoints.py
```

## 🔒 Security Features

- JWT-based authentication
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection headers

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Progressive Web App ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend Development**: React/Next.js
- **Backend Development**: Python/Flask
- **Database Design**: MongoDB
- **UI/UX Design**: Tailwind CSS

## 🆘 Support

For support, email support@interngenie.com or create an issue in the repository.

---

**Made with ❤️ for students seeking internships**