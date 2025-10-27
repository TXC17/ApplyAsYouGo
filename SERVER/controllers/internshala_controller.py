from services.internshala_scraper import InternshalaScraper
from models.internshala_model import InternshalaInternshipModel

class InternshalaController:
    def __init__(self):
        self.scraper = InternshalaScraper()
        self.model = InternshalaInternshipModel()

    def trigger_scrape_internships(self, filters):
        return self.scraper.scrape_internships(filters)

    def get_all_internships(self, filters):
        internships, total = self.model.find_internships(filters)
        return {
            "total": total,
            "data": internships
        }

    def get_internship_by_id(self, internship_id):
        return self.model.find_by_id(internship_id)

    def get_internship_statistics(self):
        return self.model.get_statistics()
