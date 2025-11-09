#!/usr/bin/env python3
"""
Script to add sample internship data to test the platform
"""

import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv('SERVER/.env')

def add_sample_internships():
    """Add sample internship data to the database"""
    print("🗄️  Adding sample internship data...")
    
    # Connect to MongoDB
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    db_name = os.getenv('DB_NAME', 'ApplyAsYouGo')
    
    try:
        client = MongoClient(mongo_uri)
        db = client[db_name]
        
        # Sample Internshala internships
        internshala_collection = db.internshala
        
        sample_internshala_data = [
            {
                "internship_id": "internshala_001",
                "title": "Web Development Intern",
                "company": "TechCorp Solutions",
                "location": "Mumbai, India",
                "stipend": "₹15,000 /month",
                "duration": "3 months",
                "apply_link": "https://internshala.com/internship/detail/web-development-internship-in-mumbai-at-techcorp-solutions",
                "category": "web-development-internship",
                "applicants": "150",
                "days_left": "12",
                "skills": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
                "scraped_at": time.time()
            },
            {
                "internship_id": "internshala_002", 
                "title": "Frontend Developer Intern",
                "company": "StartupXYZ",
                "location": "Bangalore, India",
                "stipend": "₹12,000 /month",
                "duration": "6 months",
                "apply_link": "https://internshala.com/internship/detail/frontend-development-internship-in-bangalore-at-startupxyz",
                "category": "web-development-internship",
                "applicants": "89",
                "days_left": "8",
                "skills": ["React", "Vue.js", "CSS", "JavaScript"],
                "scraped_at": time.time()
            },
            {
                "internship_id": "internshala_003",
                "title": "Full Stack Developer Intern", 
                "company": "InnovateLabs",
                "location": "Delhi, India",
                "stipend": "₹18,000 /month",
                "duration": "4 months",
                "apply_link": "https://internshala.com/internship/detail/full-stack-development-internship-in-delhi-at-innovatelabs",
                "category": "web-development-internship",
                "applicants": "203",
                "days_left": "15",
                "skills": ["Python", "Django", "React", "PostgreSQL", "AWS"],
                "scraped_at": time.time()
            },
            {
                "internship_id": "internshala_004",
                "title": "Backend Developer Intern",
                "company": "DataFlow Systems",
                "location": "Hyderabad, India", 
                "stipend": "₹14,000 /month",
                "duration": "3 months",
                "apply_link": "https://internshala.com/internship/detail/backend-development-internship-in-hyderabad-at-dataflow-systems",
                "category": "web-development-internship",
                "applicants": "67",
                "days_left": "20",
                "skills": ["Node.js", "Express", "MongoDB", "REST APIs"],
                "scraped_at": time.time()
            },
            {
                "internship_id": "internshala_005",
                "title": "MERN Stack Developer Intern",
                "company": "CloudTech Solutions",
                "location": "Pune, India",
                "stipend": "₹16,000 /month", 
                "duration": "5 months",
                "apply_link": "https://internshala.com/internship/detail/mern-stack-development-internship-in-pune-at-cloudtech-solutions",
                "category": "web-development-internship",
                "applicants": "134",
                "days_left": "10",
                "skills": ["MongoDB", "Express", "React", "Node.js", "JavaScript"],
                "scraped_at": time.time()
            }
        ]
        
        # Clear existing data and insert new sample data
        internshala_collection.delete_many({})
        result = internshala_collection.insert_many(sample_internshala_data)
        print(f"✅ Added {len(result.inserted_ids)} Internshala internships")
        
        # Sample Unstop internships
        unstop_collection = db.unstop_internships
        
        sample_unstop_data = [
            {
                "opp_id": "unstop_001",
                "title": "Software Development Intern",
                "company": "Microsoft India",
                "location": "Bangalore",
                "link": "https://unstop.com/internship/unstop_001",
                "applications": "500+",
                "days_left": "25",
                "skills": ["C++", "Python", "Data Structures", "Algorithms"],
                "image_url": "https://example.com/microsoft-logo.png"
            },
            {
                "opp_id": "unstop_002", 
                "title": "Web Development Intern",
                "company": "Google India",
                "location": "Hyderabad",
                "link": "https://unstop.com/internship/unstop_002",
                "applications": "750+",
                "days_left": "18",
                "skills": ["JavaScript", "Angular", "TypeScript", "Firebase"],
                "image_url": "https://example.com/google-logo.png"
            },
            {
                "opp_id": "unstop_003",
                "title": "Machine Learning Intern",
                "company": "Amazon India",
                "location": "Mumbai",
                "link": "https://unstop.com/internship/unstop_003", 
                "applications": "300+",
                "days_left": "30",
                "skills": ["Python", "TensorFlow", "Machine Learning", "AWS"],
                "image_url": "https://example.com/amazon-logo.png"
            }
        ]
        
        # Clear existing data and insert new sample data
        unstop_collection.delete_many({})
        result = unstop_collection.insert_many(sample_unstop_data)
        print(f"✅ Added {len(result.inserted_ids)} Unstop internships")
        
        print(f"\n🎉 Sample data added successfully!")
        print(f"   - Internshala: {len(sample_internshala_data)} internships")
        print(f"   - Unstop: {len(sample_unstop_data)} internships")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error adding sample data: {str(e)}")

if __name__ == "__main__":
    add_sample_internships()