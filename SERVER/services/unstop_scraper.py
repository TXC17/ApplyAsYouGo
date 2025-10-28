# services/scraper_service.py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time
from models.unstopInternships import InternshipModel

class ScraperService:
    def __init__(self, mongodb_uri="mongodb://localhost:27017/"):
        # Data storage
        self.internships = []
        
        # MongoDB model
        self.internship_model = InternshipModel(mongodb_uri)
        
    def _initialize_driver(self, headless=True):
        """Initialize Selenium WebDriver"""
        # Set up Chrome options
        chrome_options = Options()
        
         # chrome_options.add_argument("--headless")  # Run in headless mode (no browser UI)
            
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        # Initialize WebDriver
        driver = webdriver.Chrome(options=chrome_options)
        wait = WebDriverWait(driver, 10)
        
        return driver, wait
        
    def generate_url(self, params):
        """Generate URL based on request parameters"""
        base_url = "https://unstop.com/internships"
        query_params = []
        
        # Always add open status
        query_params.append("oppstatus=open")
        
        # Add category if provided
        if params.get("category"):
            query_params.append(f"category={params['category']}")
        
        # Add quick apply if true
        if params.get("quick_apply") == True:
            query_params.append("quickApply=true")
            
        # Add user type if provided
        if params.get("usertype"):
            query_params.append(f"usertype={params['usertype']}")
            
        # Add passing year if provided
        if params.get("passing_year"):
            query_params.append(f"fresherPassingOutYear={params['passing_year']}")
            
        # Construct the full URL
        if query_params:
            url = f"{base_url}?{'&'.join(query_params)}"
        else:
            url = base_url
            
        return url
        
    def scrape_internships(self, params):
        """Scrape internships based on parameters"""
        url = self.generate_url(params)
        print(f"Starting to scrape: {url}")
        
        # Initialize WebDriver
        driver, wait = self._initialize_driver()
        
        try:
            driver.get(url)
            
            # Wait for the page to fully load
            try:
                wait.until(EC.presence_of_element_located((By.CLASS_NAME, "single_profile")))
                print("Page loaded successfully")
            except TimeoutException:
                print("Timed out waiting for page to load")
                driver.quit()
                return {"error": "Page failed to load", "status": "error"}
            
            # Scroll to load more internships (if needed)
            self._scroll_page(driver)
            
            # Extract all internship cards
            self.internships = []  # Reset the internships list
            self._extract_internships(driver)
            
            # Save data to MongoDB and files
            if self.internships:
                self.internship_model.save_internships(self.internships)
                
            result = {
                "status": "success",
                "count": len(self.internships),
                "url_scraped": url
            }
            
        except Exception as e:
            print(f"Error during scraping: {str(e)}")
            result = {
                "status": "error",
                "message": str(e)
            }
            
        finally:
            # Close the browser
            driver.quit()
            
        return result
    
    def _scroll_page(self, driver):
        """Scroll down the page to load all internships"""
        print("Scrolling to load more internships...")
        last_height = driver.execute_script("return document.body.scrollHeight")
        
        max_scroll_count = 10  # Limit the number of scrolls
        scroll_count = 0
        
        while scroll_count < max_scroll_count:
            # Scroll down
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            
            # Wait to load more results
            time.sleep(2)
            
            # Calculate new scroll height and compare with last scroll height
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                # If heights are the same, we've reached the end of the page
                break
            last_height = new_height
            scroll_count += 1
            
            # Limit internships (optional)
            if len(driver.find_elements(By.CLASS_NAME, "single_profile")) > 50:
                print(f"Reached 50+ internships, stopping scroll")
                break
    
    def _extract_internships(self, driver):
        """Extract data from all internship cards"""
        print("Extracting internship data...")
        
        # Try multiple selectors for internship cards
        card_selectors = [
            ".single_profile",
            "[id^='opp_']",
            ".opportunity-card",
            ".card-container",
            "[data-opportunity-id]"
        ]
        
        internship_cards = []
        for selector in card_selectors:
            try:
                cards = driver.find_elements(By.CSS_SELECTOR, selector)
                if cards:
                    internship_cards = cards
                    print(f"Found {len(internship_cards)} internship cards using selector: {selector}")
                    break
            except:
                continue
        
        if not internship_cards:
            print("No internship cards found with any selector")
            return
        
        for i, card in enumerate(internship_cards[:25]):  # Limit to 25 cards
            try:
                internship_data = {}
                
                # Get the ID from the element
                opp_id = None
                try:
                    opp_id = card.get_attribute("id")
                    if opp_id and opp_id.startswith("opp_"):
                        opp_id = opp_id.replace("opp_", "")
                    elif not opp_id:
                        opp_id = card.get_attribute("data-opportunity-id") or f"unstop_{int(time.time())}_{i}"
                except:
                    opp_id = f"unstop_{int(time.time())}_{i}"
                
                internship_data["opp_id"] = opp_id
                internship_data["link"] = f"https://unstop.com/internship/{opp_id}"
                
                # Get the title - try multiple selectors
                title = self._extract_text_from_card(card, [
                    ".opp-title h2",
                    ".opportunity-title",
                    "h2",
                    "h3",
                    ".title",
                    "[class*='title']"
                ])
                internship_data["title"] = title or "Internship Position"
                
                # Get the company name - try multiple selectors
                company = self._extract_text_from_card(card, [
                    ".content > p",
                    ".company-name",
                    ".organization",
                    "p",
                    "[class*='company']",
                    "[class*='organization']"
                ])
                internship_data["company"] = company or "Company"
                
                # Get location if available
                location = self._extract_text_from_card(card, [
                    ".location",
                    "[class*='location']",
                    ".venue"
                ])
                internship_data["location"] = location or "Remote"
                
                # Get the application count if available
                applications = self._extract_text_from_card(card, [
                    ".//div[contains(@class, 'seperate_box')][contains(., 'Applied')]",
                    "[class*='applied']",
                    "[class*='application']"
                ], use_xpath=True)
                
                if applications:
                    try:
                        applications = applications.split(' ')[0].strip()
                    except:
                        pass
                internship_data["applications"] = applications or "N/A"
                
                # Get days left if available
                days_left = self._extract_text_from_card(card, [
                    ".//div[contains(@class, 'seperate_box')][contains(., 'days left')]",
                    "[class*='deadline']",
                    "[class*='days']"
                ], use_xpath=True)
                
                if days_left:
                    try:
                        days_left = days_left.split(' ')[0].strip()
                    except:
                        pass
                internship_data["days_left"] = days_left or "N/A"
                
                # Get skills/requirements if available
                skills = []
                try:
                    skill_elements = card.find_elements(By.CSS_SELECTOR, ".chip_text, .skill-tag, [class*='skill'], .tag")
                    for skill in skill_elements[:5]:  # Limit to 5 skills
                        skill_text = skill.text.strip()
                        if skill_text and skill_text not in skills:
                            skills.append(skill_text)
                except:
                    pass
                
                internship_data["skills"] = skills
                
                # Get the image URL if available
                try:
                    img_element = card.find_element(By.TAG_NAME, "img")
                    internship_data["image_url"] = img_element.get_attribute("src")
                except:
                    internship_data["image_url"] = "N/A"
                
                # Only add if we have essential data
                if internship_data["title"] and internship_data["company"]:
                    self.internships.append(internship_data)
                    print(f"Extracted: {internship_data['title']} - {internship_data['company']}")
                
            except Exception as e:
                print(f"Error extracting internship data from card {i}: {str(e)}")
    
    def _extract_text_from_card(self, card, selectors, use_xpath=False):
        """Helper method to extract text using multiple selectors"""
        for selector in selectors:
            try:
                if use_xpath:
                    element = card.find_element(By.XPATH, selector)
                else:
                    element = card.find_element(By.CSS_SELECTOR, selector)
                
                text = element.text.strip()
                if text:
                    return text
            except:
                continue
        return None
    
    def get_internships_from_db(self, limit=None):
        """Get internships from MongoDB"""
        return self.internship_model.get_internships(limit)
    
    def cleanup(self):
        """Clean up resources"""
        self.internship_model.close_connection()