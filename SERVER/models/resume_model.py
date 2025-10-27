# models/resume_model.py
from database.db_connection import get_db_connection
import datetime

class ResumeModel:
    def __init__(self):
        self.db = get_db_connection()
        self.collection = self.db.resumes
    
    def save_resume_data(self, filepath, filename, extracted_data,ats_score):
        """
        Save the extracted resume data to MongoDB
        Returns the document ID on success
        """
        try:
            # Prepare document
            resume_document = {
                "filename": filename,
                "filepath": filepath,
                "upload_date": datetime.datetime.now(),
                "raw_data": extracted_data,
                "ats_score": ats_score
                      # Save raw data without enforcing a model
            }
            
            # Insert into MongoDB
            result = self.collection.insert_one(resume_document)
            
            return result.inserted_id
            
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    def search_resumes(self, query):
        """
        Search resumes by skills, name, or other criteria
        """
        try:
            # Example of a simple search function
            results = self.collection.find(query)
            return list(results)
        except Exception as e:
            raise Exception(f"Search error: {str(e)}")
    
    def get_resume_by_id(self, resume_id):
        """
        Retrieve a resume by its ID
        """
        try:
            from bson.objectid import ObjectId
            resume = self.collection.find_one({"_id": ObjectId(resume_id)})
            return resume
        except Exception as e:
            raise Exception(f"Retrieval error: {str(e)}")
  
