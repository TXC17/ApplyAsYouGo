from models.linkedinInternships import LinkedInInternshipModel
from services.linkedin_scraper import LinkedInScraper

class LinkedInController:
    def __init__(self):
        self.model = LinkedInInternshipModel()
        self.scraper = LinkedInScraper()
    
    def get_all_internships(self, filters=None):
        """Get all LinkedIn internships without pagination"""
        if filters is None:
            filters = {}

        try:
            internships, total_count = self.model.find_internships(filters)  # No pagination passed

            return {
                'success': True,
                'count': total_count,
                'data': internships,
                'internships': internships  # Add this for backward compatibility
            }
        except Exception as e:
            return {
                'success': False,
                'message': f"Error retrieving internships: {str(e)}",
                'data': [],
                'internships': [],  # Add for backward compatibility
                'count': 0
            }

    
    def get_internship_by_id(self, internship_id):
        """Get a specific LinkedIn internship by ID"""
        try:
            internship = self.model.find_by_id(internship_id)
            
            if not internship:
                return {
                    'success': False,
                    'message': 'Internship not found',
                    'data': None
                }
            
            return {
                'success': True,
                'data': internship
            }
        except Exception as e:
            return {
                'success': False,
                'message': f"Error retrieving internship: {str(e)}",
                'data': None
            }

    def trigger_scrape_internships(self, filters):
        """Trigger LinkedIn scraping process"""
        try:
            result = self.scraper.scrape_internships(filters)
            count = result.get('count', 0)
            
            if count > 0:
                return {
                    'success': True,
                    'message': result.get('message', f"Successfully scraped {count} LinkedIn internships"),
                    'count': count
                }
            else:
                return {
                    'success': False,
                    'message': result.get('message', 'No internships found'),
                    'count': 0
                }
        except Exception as e:
            return {
                'success': False,
                'message': f"Scraping error: {str(e)}",
                'count': 0
            }

    def get_internship_statistics(self):
        """Get statistics about LinkedIn internships"""
        try:
            stats = self.model.get_statistics()
            return {
                'success': True,
                'data': stats
            }
        except Exception as e:
            return {
                'success': False,
                'message': f"Error retrieving statistics: {str(e)}",
                'data': None
            }
