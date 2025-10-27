from services.scraper_service import ScraperService

class InternshipController:
    def __init__(self):
        self.scraper_service = ScraperService()
    
    def scrape_internships(self, category):
        """Controller method to scrape internships"""
        return self.scraper_service.scrape_internships(category)
    
    def get_internships(self, category):
        """Controller method to get internships from database"""
        return self.scraper_service.get_internships_by_category(category)