from services.internshala_scraper import InternshalaScraper
from models.internshala_model import InternshalaInternshipModel

class InternshipController:
    def __init__(self):
        self.internshala_scraper = InternshalaScraper()
        self.internshala_model = InternshalaInternshipModel()
    
    def scrape_internships(self, category):
        """Controller method to scrape internships"""
        try:
            filters = {'category': category}
            result = self.internshala_scraper.scrape_internships(filters)
            return result
        except Exception as e:
            return {'count': 0, 'message': f'Scraping error: {str(e)}'}
    
    def get_internships(self, category):
        """Controller method to get internships from database"""
        try:
            return self.internshala_model.get_internships_by_category(category)
        except Exception as e:
            return []