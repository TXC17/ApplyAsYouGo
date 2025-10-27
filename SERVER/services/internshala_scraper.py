from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import time
from models.internshala_model import InternshalaInternshipModel

class InternshalaScraper:
    def __init__(self):
        self.model = InternshalaInternshipModel()
        
    def _setup_driver(self):
        chrome_options = Options()
        chrome_options.add_argument('--disable-gpu')
        # chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-extensions')
        
        # Disable images and CSS for faster loading
        prefs = {
            "profile.managed_default_content_settings.images": 2,
            "profile.default_content_setting_values.css": 2
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.implicitly_wait(3)  # Short implicit wait
        
        return driver
    
    def scrape_internships(self, filters):
        driver = self._setup_driver()
        
        try:
            category = filters.get('category', 'Web Development')
            
            # Use direct URL to avoid UI interactions
            url_category = category.lower().replace(" ", "-")
            url = f"https://internshala.com/internships/{url_category}-internship"
            if filters.get('quick_apply', True):
                url += "/fast-apply-true"
            
            driver.get(url)
            time.sleep(2)
            
            # Close popups using JavaScript
            driver.execute_script("""
                var modals = document.querySelectorAll('.modal');
                for (var i = 0; i < modals.length; i++) {
                    modals[i].style.display = 'none';
                }
                document.body.classList.remove('modal-open');
                var backdrops = document.querySelectorAll('.modal-backdrop');
                for (var i = 0; i < backdrops.length; i++) {
                    backdrops[i].remove();
                }
            """)
            
            # Use JavaScript to extract all internship data at once - MUCH FASTER!
            internships_data = driver.execute_script("""
                var internships = [];
                var cards = document.querySelectorAll('div.individual_internship, div.container-fluid.individual_internship, div[id^="individual_internship_"]');
                
                for (var i = 0; i < Math.min(cards.length, 30); i++) {
                    var card = cards[i];
                    var internship = {
                        internship_id: card.getAttribute('internshipid') || card.getAttribute('id') || 'unknown_' + Date.now() + '_' + i,
                        title: 'Not found',
                        company: 'Not found',
                        location: 'Not specified',
                        stipend: 'Not mentioned',
                        duration: 'Not specified',
                        apply_link: null,
                        category: arguments[0]
                    };
                    
                    // Get link
                    var link = card.getAttribute('data-href');
                    if (!link) {
                        var links = card.querySelectorAll('a');
                        if (links.length > 0) {
                            link = links[0].getAttribute('href');
                        }
                    }
                    
                    if (link) {
                        if (!link.startsWith('http')) {
                            link = 'https://internshala.com' + link;
                        }
                        internship.apply_link = link;
                    }
                    
                    // Get title
                    var titleElement = card.querySelector('.profile, .heading_4_5, .internship-heading-container h3, .heading');
                    if (titleElement && titleElement.textContent.trim()) {
                        internship.title = titleElement.textContent.trim();
                    }
                    
                    // Get company
                    var companyElement = card.querySelector('.company_name, .heading_6, .company-name');
                    if (companyElement && companyElement.textContent.trim()) {
                        internship.company = companyElement.textContent.trim();
                    }
                    
                    // Get location
                    var locationElement = card.querySelector('span.location_link, .location, .location_name');
                    if (locationElement && locationElement.textContent.trim()) {
                        internship.location = locationElement.textContent.trim();
                    }
                    
                    // Get stipend
                    var stipendElement = card.querySelector('.stipend');
                    if (stipendElement && stipendElement.textContent.trim()) {
                        internship.stipend = stipendElement.textContent.trim();
                    }
                    
                    // Get duration
                    var durationElement = card.querySelector('.internship_other_details_container .item_body, .duration');
                    if (durationElement && durationElement.textContent.trim()) {
                        internship.duration = durationElement.textContent.trim();
                    }
                    
                    internships.push(internship);
                }
                
                return internships;
            """, category)
            
            # Filter out internships with missing essential data
            valid_internships = []
            for internship in internships_data:
                if internship["internship_id"] and internship["apply_link"] and internship["title"] != "Not found":
                    valid_internships.append(internship)
            
            # Batch insert only new internships
            collection = self.model.collection
            internships_to_save = []
            
            # Filter existing records efficiently using a set
            existing_ids = set()
            existing_cursor = collection.find(
                {"internship_id": {"$in": [i["internship_id"] for i in valid_internships]}},
                {"internship_id": 1}
            )
            
            for doc in existing_cursor:
                existing_ids.add(doc["internship_id"])
            
            # Only add internships that don't exist
            for internship in valid_internships:
                if internship["internship_id"] not in existing_ids:
                    internships_to_save.append(internship)
            
            # Batch insert
            if internships_to_save:
                collection.insert_many(internships_to_save)
                print(f"Saved {len(internships_to_save)} new internships in batch")
            
            return {
                'count': len(internships_to_save), 
                'message': f'Successfully scraped {len(valid_internships)} internships, {len(internships_to_save)} new'
            }
            
        except Exception as e:
            print(f"Internshala scraping error: {str(e)}")
            return {'count': 0, 'message': f'Error: {str(e)}'}
            
        finally:
            if driver:
                driver.quit()