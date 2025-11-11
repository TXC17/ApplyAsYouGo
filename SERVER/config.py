import os

class Config:
    """Base configuration"""
    MONGODB_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
    DEBUG = False
    TESTING = False    
    SECRET_KEY = os.environ.get("SECRET_KEY")
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyD9tAeFXCHe1-sWsvakCvr35xDHBzXAFj4')
    
    @classmethod
    def validate_required_vars(cls):
        """Validate that required environment variables are set for production"""
        if os.environ.get('FLASK_ENV') == 'production':
            required_vars = ['SECRET_KEY', 'GEMINI_API_KEY']
            missing_vars = [var for var in required_vars if not getattr(cls, var)]
            if missing_vars:
                raise ValueError(f"Missing required environment variables for production: {', '.join(missing_vars)}")

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    pass

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    MONGODB_URI = 'mongodb://localhost:27017/test_unstop_internships'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}