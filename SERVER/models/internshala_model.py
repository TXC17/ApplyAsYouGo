from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

class InternshalaInternshipModel:
    def __init__(self):
        db_name = os.getenv('DB_NAME', 'resume_processor_db')
        collection_name = os.getenv('INTERNSHALA_COLLECTION_NAME', 'internshala')
        
        # Try Atlas first, then fallback to local
        atlas_uri = os.getenv('MONGO_URI_ATLAS')
        local_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        
        self.client = None
        
        # Try Atlas connection first
        if atlas_uri:
            try:
                print("Attempting to connect to MongoDB Atlas...")
                self.client = MongoClient(atlas_uri, serverSelectionTimeoutMS=5000)
                # Test the connection
                self.client.admin.command('ping')
                print("Successfully connected to MongoDB Atlas")
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                print(f"Atlas connection failed: {e}")
                self.client = None
        
        # Fallback to local MongoDB
        if not self.client:
            try:
                print("Attempting to connect to local MongoDB...")
                self.client = MongoClient(local_uri, serverSelectionTimeoutMS=5000)
                # Test the connection
                self.client.admin.command('ping')
                print("Successfully connected to local MongoDB")
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                print(f"Local MongoDB connection failed: {e}")
                raise Exception("Could not connect to any MongoDB instance. Please ensure MongoDB is running locally or Atlas is accessible.")
        
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def find_internships(self, filters):
        total_count = self.collection.count_documents(filters)
        cursor = self.collection.find(
            filters,
            {
                '_id': 1,
                'title': 1,
                'company': 1,
                'location': 1,
                'applicants': 1,
                'days_left': 1,
                'skills': 1,
                'category': 1,
                'apply_link': 1,
                "stipend": 1,
            }
        )
        internships = []
        for doc in cursor:
            doc['_id'] = str(doc['_id'])
            internships.append(doc)
        return internships, total_count

    def find_by_id(self, internship_id):
        try:
            obj_id = ObjectId(internship_id)
            internship = self.collection.find_one({'_id': obj_id})
            if internship:
                internship['_id'] = str(internship['_id'])
            return internship
        except Exception:
            return None

    def get_statistics(self):
        stats = {
            'total_count': self.collection.count_documents({}),
            'by_category': [],
            'by_company': [],
            'days_left_distribution': []
        }

        pipeline = [
            {'$group': {'_id': '$category', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]
        stats['by_category'] = list(self.collection.aggregate(pipeline))

        pipeline = [
            {'$group': {'_id': '$company', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': 10}
        ]
        stats['by_company'] = list(self.collection.aggregate(pipeline))

        pipeline = [
            {'$group': {'_id': '$days_left', 'count': {'$sum': 1}}},
            {'$sort': {'_id': 1}}
        ]
        stats['days_left_distribution'] = list(self.collection.aggregate(pipeline))

        return stats

    def get_internships_by_category(self, category):
        """Get internships by category"""
        try:
            filters = {'category': category}
            internships, total_count = self.find_internships(filters)
            return internships
        except Exception as e:
            print(f"Error getting internships by category: {str(e)}")
            return []
