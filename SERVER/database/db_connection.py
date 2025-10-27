# database/db_connection.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class MockDatabase:
    """Mock database for testing when MongoDB is not available"""
    def __init__(self):
        self.collections = {}
        print("📝 Using mock database for testing")
    
    def __getitem__(self, collection_name):
        if collection_name not in self.collections:
            self.collections[collection_name] = MockCollection()
        return self.collections[collection_name]
    
    def list_collection_names(self):
        return list(self.collections.keys())
    
    def create_collection(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection()

class MockCollection:
    """Mock collection for testing"""
    def __init__(self):
        self.data = []
        self._id_counter = 1
    
    def insert_one(self, document):
        document['_id'] = self._id_counter
        self._id_counter += 1
        self.data.append(document)
        return type('Result', (), {'inserted_id': document['_id']})()
    
    def find_one(self, query):
        for doc in self.data:
            if all(doc.get(k) == v for k, v in query.items()):
                return doc
        return None
    
    def find(self, query=None):
        if query is None:
            return self.data
        results = []
        for doc in self.data:
            if all(doc.get(k) == v for k, v in query.items()):
                results.append(doc)
        return results
    
    def delete_one(self, query):
        for i, doc in enumerate(self.data):
            if all(doc.get(k) == v for k, v in query.items()):
                del self.data[i]
                return type('Result', (), {'deleted_count': 1})()
        return type('Result', (), {'deleted_count': 0})()
    
    def delete_many(self, query):
        count = 0
        for i in range(len(self.data) - 1, -1, -1):
            doc = self.data[i]
            if all(doc.get(k) == v for k, v in query.items()):
                del self.data[i]
                count += 1
        return type('Result', (), {'deleted_count': count})()
    
    def create_index(self, field, **kwargs):
        pass  # Mock implementation

def get_db_connection():
    """Create a connection to the MongoDB Cloud database"""
    try:
        # Get MongoDB Cloud connection string from environment
        mongo_uri = os.environ.get('MONGO_URI')
        db_name = os.environ.get('DB_NAME', 'interngenie')
        
        if not mongo_uri:
            raise Exception("MONGO_URI environment variable is required for MongoDB Cloud connection")
        
        # Add connection timeout and retry settings for cloud connections
        client = MongoClient(
            mongo_uri,
            serverSelectionTimeoutMS=10000,  # 10 second timeout for cloud
            connectTimeoutMS=20000,          # 20 second connection timeout
            socketTimeoutMS=30000,           # 30 second socket timeout
            retryWrites=True,
            maxPoolSize=10,
            minPoolSize=1
        )
        
        # Test the connection
        client.admin.command('ping')
        print(f"[SUCCESS] Successfully connected to MongoDB Cloud: {db_name}")
        
        db = client[db_name]
        return db
    except Exception as e:
        print(f"[ERROR] MongoDB Cloud connection error: {str(e)}")
        print("[INFO] Please check your MONGO_URI and ensure MongoDB Cloud is accessible")
        raise Exception(f"MongoDB Cloud connection failed: {str(e)}")

def init_database():
    """Initialize database with required collections and indexes"""
    try:
        db = get_db_connection()

        # Create collections if they don't exist
        if "resumes" not in db.list_collection_names():
            db.create_collection("resumes")

        if "users" not in db.list_collection_names():
            db.create_collection("users")

        # Create useful indexes
        db.resumes.create_index("upload_date")
        db.users.create_index("email", unique=True)

        return True
    except Exception as e:
        raise Exception(f"Database initialization error: {str(e)}")
