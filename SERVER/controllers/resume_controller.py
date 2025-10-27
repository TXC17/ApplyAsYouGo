from models.resume_model import ResumeModel
from services.gemini_service import GeminiService
import logging

class ResumeController:
    def __init__(self):
        self.resume_model = ResumeModel()
        self.gemini_service = GeminiService()
    
    def process_resume(self, filepath):
        try:
            # Validate file exists
            import os
            if not os.path.exists(filepath):
                raise Exception(f"File not found: {filepath}")
            
            # Extract data from resume using Gemini API
            try:
                extracted_data = self.gemini_service.extract_resume_data(filepath)
            except Exception as e:
                logging.error(f"Error extracting resume data: {str(e)}")
                # Provide fallback data
                extracted_data = {
                    "name": "Unable to extract",
                    "email": "Unable to extract",
                    "phone": "Unable to extract",
                    "skills": ["Data extraction failed"],
                    "experience": [{"company": "Unable to extract", "position": "Unable to extract", "duration": "Unable to extract"}],
                    "education": [{"institution": "Unable to extract", "degree": "Unable to extract", "year": "Unable to extract"}]
                }
            
            # Get ATS score using Gemini
            try:
                ats_score = self.gemini_service.score_resume_ats(filepath)
            except Exception as e:
                logging.error(f"Error scoring resume: {str(e)}")
                # Provide fallback score
                ats_score = {
                    "totalScore": 50,
                    "formatting": {"score": 50, "feedback": "Unable to analyze formatting due to processing error"},
                    "grammar": {"score": 50, "feedback": "Unable to analyze grammar due to processing error"}
                }
            
            # Save both extracted data and ATS scores to MongoDB
            try:
                # Use proper path separator
                filename = filepath.replace('\\', '/').split('/')[-1]
                doc_id = self.resume_model.save_resume_data(
                    filepath=filepath,
                    filename=filename,
                    extracted_data=extracted_data,
                    ats_score=ats_score
                )
            except Exception as e:
                logging.error(f"Error saving to database: {str(e)}")
                raise Exception(f"Database save error: {str(e)}")
            
            return {
                'success': True,
                'message': 'Resume processed and scored successfully',
                'document_id': str(doc_id),
                'data': extracted_data,
                'ats_scores': ats_score
            }
            
        except Exception as e:
            logging.error(f"Error in process_resume: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
