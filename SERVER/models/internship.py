from pymongo import MongoClient


class InternshipModel:
    def __init__(self):
        self.client = MongoClient('mongodb://localhost:27017/')
        self.db = self.client['resume_processor_db']
        self.collection = self.db['internships']
    
    def insert_internship(self, internship_data):
        """Insert a new internship into the database"""
        result = self.collection.insert_one(internship_data)
        return {"_id": result.inserted_id}
    
    def find_internships_by_category(self, category):
        """Find internships by category"""
        return list(self.collection.find({"category": category}))