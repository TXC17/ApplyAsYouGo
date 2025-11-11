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
            category = filters.get('category', 'web-development')
            
            # Use direct URL to avoid UI interactions
            url_category = category.lower().replace(" ", "-").replace("_", "-")
            url = f"https://internshala.com/internships/{url_category}-internship"
            
            print(f"Scraping Internshala with URL: {url}")
            driver.get(url)
            time.sleep(3)
            
            # Close popups using JavaScript
            driver.execute_script("""
                // Close any modals or popups
                var modals = document.querySelectorAll('.modal, .popup, [class*="modal"], [class*="popup"]');
                for (var i = 0; i < modals.length; i++) {
                    modals[i].style.display = 'none';
                }
                document.body.classList.remove('modal-open');
                var backdrops = document.querySelectorAll('.modal-backdrop, [class*="backdrop"]');
                for (var i = 0; i < backdrops.length; i++) {
                    backdrops[i].remove();
                }
                
                // Remove overlay elements
                var overlays = document.querySelectorAll('[class*="overlay"]');
                for (var i = 0; i < overlays.length; i++) {
                    overlays[i].style.display = 'none';
                }
            """)
            
            # Wait for content to load
            time.sleep(2)
            
            # Use JavaScript to extract all internship data at once
            internships_data = driver.execute_script("""
                var internships = [];
                
                // Try multiple selectors for internship cards
                var cardSelectors = [
                    'div.individual_internship',
                    'div.container-fluid.individual_internship', 
                    'div[id^="individual_internship_"]',
                    '.internship_meta',
                    '[data-internship-id]'
                ];
                
                var cards = [];
                for (var s = 0; s < cardSelectors.length; s++) {
                    var foundCards = document.querySelectorAll(cardSelectors[s]);
                    if (foundCards.length > 0) {
                        cards = foundCards;
                        console.log('Found ' + cards.length + ' cards with selector: ' + cardSelectors[s]);
                        break;
                    }
                }
                
                if (cards.length === 0) {
                    console.log('No internship cards found');
                    return [];
                }
                
                for (var i = 0; i < Math.min(cards.length, 25); i++) {
                    var card = cards[i];
                    var internship = {
                        internship_id: null,
                        title: null,
                        company: null,
                        location: 'Not specified',
                        stipend: 'Not mentioned',
                        duration: 'Not specified',
                        apply_link: null,
                        category: arguments[0],
                        applicants: 'N/A',
                        days_left: 'N/A',
                        skills: []
                    };
                    
                    // Get internship ID
                    internship.internship_id = card.getAttribute('internshipid') || 
                                             card.getAttribute('id') || 
                                             card.getAttribute('data-internship-id') ||
                                             'internshala_' + Date.now() + '_' + i;
                    
                    // Get link
                    var link = card.getAttribute('data-href');
                    if (!link) {
                        var linkElements = card.querySelectorAll('a[href*="/internship/"]');
                        if (linkElements.length > 0) {
                            link = linkElements[0].getAttribute('href');
                        }
                    }
                    
                    if (link && !link.startsWith('http')) {
                        link = 'https://internshala.com' + link;
                    }
                    internship.apply_link = link;
                    
                    // Get title - try multiple selectors
                    var titleSelectors = [
                        '.profile h3 a',
                        '.heading_4_5 a',
                        '.internship-heading-container h3',
                        '.heading a',
                        'h3 a',
                        '.profile a'
                    ];
                    
                    for (var t = 0; t < titleSelectors.length; t++) {
                        var titleElement = card.querySelector(titleSelectors[t]);
                        if (titleElement && titleElement.textContent.trim()) {
                            internship.title = titleElement.textContent.trim();
                            break;
                        }
                    }
                    
                    // Get company - try multiple selectors
                    var companySelectors = [
                        '.company_name',
                        '.heading_6',
                        '.company-name',
                        '.company a',
                        'p a[href*="/company/"]'
                    ];
                    
                    for (var c = 0; c < companySelectors.length; c++) {
                        var companyElement = card.querySelector(companySelectors[c]);
                        if (companyElement && companyElement.textContent.trim()) {
                            internship.company = companyElement.textContent.trim();
                            break;
                        }
                    }
                    
                    // Get location
                    var locationSelectors = [
                        'span.location_link',
                        '.location',
                        '.location_name',
                        '[class*="location"]'
                    ];
                    
                    for (var l = 0; l < locationSelectors.length; l++) {
                        var locationElement = card.querySelector(locationSelectors[l]);
                        if (locationElement && locationElement.textContent.trim()) {
                            internship.location = locationElement.textContent.trim();
                            break;
                        }
                    }
                    
                    // Get stipend
                    var stipendElement = card.querySelector('.stipend, [class*="stipend"]');
                    if (stipendElement && stipendElement.textContent.trim()) {
                        internship.stipend = stipendElement.textContent.trim();
                    }
                    
                    // Get duration
                    var durationElement = card.querySelector('.internship_other_details_container .item_body, .duration, [class*="duration"]');
                    if (durationElement && durationElement.textContent.trim()) {
                        internship.duration = durationElement.textContent.trim();
                    }
                    
                    // Get skills
                    var skillElements = card.querySelectorAll('.round_tabs, .skill_tag, [class*="skill"]');
                    for (var sk = 0; sk < skillElements.length; sk++) {
                        var skillText = skillElements[sk].textContent.trim();
                        if (skillText && internship.skills.length < 5) {
                            internship.skills.push(skillText);
                        }
                    }
                    
                    // Only add if we have essential data
                    if (internship.title && internship.company) {
                        internships.push(internship);
                    }
                }
                
                return internships;
            """, category)
            
            print(f"Extracted {len(internships_data)} internships from page")
            
            if not internships_data:
                return {'count': 0, 'message': 'No internships found on the page'}
            
            # Save to database
            collection = self.model.collection
            internships_to_save = []
            
            # Filter existing records
            existing_ids = set()
            if internships_data:
                existing_cursor = collection.find(
                    {"internship_id": {"$in": [i["internship_id"] for i in internships_data]}},
                    {"internship_id": 1}
                )
                
                for doc in existing_cursor:
                    existing_ids.add(doc["internship_id"])
            
            # Only add new internships
            for internship in internships_data:
                if internship["internship_id"] not in existing_ids:
                    internship["scraped_at"] = time.time()
                    internships_to_save.append(internship)
            
            # Batch insert
            if internships_to_save:
                collection.insert_many(internships_to_save)
                print(f"Saved {len(internships_to_save)} new internships to database")
            
            message = f'Successfully scraped {len(internships_data)} internships, {len(internships_to_save)} new'
            print(message)
            
            return {
                'count': len(internships_to_save), 
                'message': message
            }
            
        except Exception as e:
            error_msg = f"Internshala scraping error: {str(e)}"
            print(error_msg)
            raise Exception(error_msg)
            
        finally:
            try:
                if driver:
                    driver.quit()
            except Exception as e:
                print(f"Error closing driver: {str(e)}")