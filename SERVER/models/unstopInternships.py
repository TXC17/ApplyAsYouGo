# models/internship_model.py
from datetime import datetime
import pymongo
import json
import pandas as pd

class InternshipModel:
    def __init__(self, mongodb_uri="mongodb://localhost:27017/"):
        try:
            self.mongo_client = pymongo.MongoClient(mongodb_uri)
            self.db = self.mongo_client["resume_processor_db"]
            self.collection = self.db["unstop"]
            print("MongoDB connected successfully")
        except Exception as e:
            print(f"MongoDB connection error: {str(e)}")
            raise

    def save_internships(self, internships):
        """Save internships to MongoDB and files"""
        if not internships:
            print("No data to save")
            return False
        
        try:
            # Create a timestamp for this batch
            batch_id = datetime.now().strftime("%Y%m%d%H%M%S")
            
            # Add batch_id to each document
            for internship in internships:
                internship["batch_id"] = batch_id
                internship["scraped_at"] = datetime.now()
            
            # Insert the data into MongoDB
            result = self.collection.insert_many(internships)
            print(f"Saved {len(result.inserted_ids)} internships to MongoDB")
            
            # Create an index on opp_id if it doesn't exist
            self.collection.create_index("opp_id")
            
            # Save as JSON
            with open('unstop_internships.json', 'w', encoding='utf-8') as f:
                json.dump(internships, f, ensure_ascii=False, indent=4, default=str)
            
            # Save as CSV
            df = pd.DataFrame(internships)
            df.to_csv('unstop_internships.csv', index=False, encoding='utf-8')
            
            print(f"Saved {len(internships)} internships to files")
            return True
            
        except Exception as e:
            print(f"Error saving data: {str(e)}")
            return False
    
    def get_internships(self, limit=None):
        """Fetch internships from MongoDB database"""
        try:
            # Query the collection
            query = {}  # Empty query returns all documents
            projection = {"_id": 0}  # Exclude MongoDB IDs
            
            # Execute query
            if limit:
                cursor = self.collection.find(query, projection).limit(limit)
            else:
                cursor = self.collection.find(query, projection)
            
            # Convert cursor to list
            internships = list(cursor)
            
            print(f"Retrieved {len(internships)} internships from MongoDB")
            return internships
            
        except Exception as e:
            print(f"Error retrieving data from MongoDB: {str(e)}")
            return []
    
    def close_connection(self):
        """Close MongoDB connection"""
        if hasattr(self, 'mongo_client'):
            self.mongo_client.close()