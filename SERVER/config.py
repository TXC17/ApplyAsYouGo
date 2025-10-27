import os

class Config:
    """Base configuration"""
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
    DEBUG = False
    TESTING = False    
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-key-for-development"
    GEMINI_API_KEY = 'AIzaSyD9tAeFXCHe1-sWsvakCvr35xDHBzXAFj4'

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