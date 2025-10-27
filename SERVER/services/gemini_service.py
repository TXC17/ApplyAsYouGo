import google.generativeai as genai
import os
from PyPDF2 import PdfReader
import json
import logging
import re

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY', 'AIzaSyD9tAeFXCHe1-sWsvakCvr35xDHBzXAFj4')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        except Exception as e:
            logging.error(f"Failed to initialize Gemini model: {str(e)}")
            raise Exception(f"Failed to initialize Gemini model: {str(e)}")

    def _extract_text_from_pdf(self, filepath):
        """Extract text content from PDF file with better error handling"""
        try:
            pdf_text = ""
            pdf = PdfReader(filepath)
            
            # Check if PDF is valid and has pages
            if len(pdf.pages) == 0:
                raise Exception("PDF file is empty or corrupted")
            
            for page_num, page in enumerate(pdf.pages):
                try:
                    page_text = page.extract_text()
                    if page_text:
                        pdf_text += page_text + "\n\n"
                    else:
                        logging.warning(f"Page {page_num + 1} has no extractable text")
                except Exception as e:
                    logging.warning(f"Error extracting text from page {page_num + 1}: {str(e)}")
                    continue
            
            if not pdf_text.strip():
                # If no text was extracted, provide a fallback
                pdf_text = "Resume content could not be extracted. Please ensure the PDF contains readable text."
                logging.warning("No text could be extracted from PDF")
            
            return pdf_text
            
        except Exception as e:
            logging.error(f"Error reading PDF file: {str(e)}")
            # Return a fallback text for malformed PDFs
            return "Resume content could not be extracted due to file format issues. Please ensure the PDF is valid and contains readable text."

    def extract_resume_data(self, filepath):
        """Extract structured resume data using Gemini API"""
        try:
            resume_content = self._extract_text_from_pdf(filepath)

            prompt = """
            Please extract all relevant information from this resume document and return ONLY valid JSON in this exact format:
            {
                "name": "Full Name",
                "email": "email@example.com",
                "phone": "phone number",
                "skills": ["skill1", "skill2"],
                "experience": [{"company": "Company", "position": "Position", "duration": "Duration"}],
                "education": [{"institution": "School", "degree": "Degree", "year": "Year"}]
            }
            """
            input_text = f"{prompt}\n\nResume Content:\n{resume_content}"

            try:
                response = self.model.generate_content(input_text)
                if not response or not response.text:
                    raise Exception("Empty response from Gemini API")
                
                # Clean the response
                cleaned_response = response.text.strip()
                cleaned_response = re.sub(r'```json\s*', '', cleaned_response)
                cleaned_response = re.sub(r'```\s*$', '', cleaned_response)
                cleaned_response = cleaned_response.strip()
                
                extracted_data = json.loads(cleaned_response)
                
            except json.JSONDecodeError as e:
                logging.error(f"Failed to parse Gemini API response: {cleaned_response}")
                # Return a fallback structure
                extracted_data = {
                    "name": "Unable to extract",
                    "email": "Unable to extract",
                    "phone": "Unable to extract",
                    "skills": ["Unable to extract skills"],
                    "experience": [{"company": "Unable to extract", "position": "Unable to extract", "duration": "Unable to extract"}],
                    "education": [{"institution": "Unable to extract", "degree": "Unable to extract", "year": "Unable to extract"}]
                }
            except Exception as e:
                logging.error(f"Gemini API error: {str(e)}")
                raise Exception(f"Gemini API error: {str(e)}")

            logging.debug(f"Extracted data: {extracted_data}")
            return extracted_data

        except Exception as e:
            logging.error(f"Error extracting data from resume: {str(e)}")
            raise Exception(f"Error extracting data from resume: {str(e)}")
    def score_resume_ats(self, filepath):
        """Use Gemini to evaluate resume for formatting and grammar ATS score"""
        try:
            resume_text = self._extract_text_from_pdf(filepath)

            prompt = """
            You are an ATS expert. Analyze this resume and return ONLY valid JSON in this exact format:
            {
                "totalScore": 85,
                "formatting": {"score": 80, "feedback": "Good structure"},
                "grammar": {"score": 90, "feedback": "Excellent grammar"}
            }
            """

            input_text = f"{prompt}\n\nResume:\n{resume_text}"
            
            try:
                response = self.model.generate_content(input_text)
                if not response or not response.text:
                    raise Exception("Empty response from Gemini API")
                
                # Clean the response
                cleaned_response = response.text.strip()
                cleaned_response = re.sub(r'```json\s*', '', cleaned_response)
                cleaned_response = re.sub(r'```\s*$', '', cleaned_response)
                cleaned_response = cleaned_response.strip()
                
                ats_score = json.loads(cleaned_response)
                
            except json.JSONDecodeError as e:
                logging.error(f"Gemini ATS score response parsing failed: {cleaned_response}")
                # Return fallback score
                ats_score = {
                    "totalScore": 75,
                    "formatting": {"score": 75, "feedback": "Unable to analyze formatting"},
                    "grammar": {"score": 75, "feedback": "Unable to analyze grammar"}
                }
            except Exception as e:
                logging.error(f"Gemini API error during ATS scoring: {str(e)}")
                raise Exception(f"Gemini API error during ATS scoring: {str(e)}")

            return ats_score

        except Exception as e:
            logging.error(f"Error scoring ATS: {str(e)}")
            raise Exception(f"Error scoring ATS: {str(e)}")