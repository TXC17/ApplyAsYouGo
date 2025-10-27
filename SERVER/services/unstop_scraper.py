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
        internship_cards = driver.find_elements(By.CLASS_NAME, "single_profile")
        print(f"Found {len(internship_cards)} internship cards")
        
        for card in internship_cards:
            try:
                internship_data = {}
                
                # Get the ID from the element (for the link)
                opp_id = card.get_attribute("id").replace("opp_", "")
                internship_data["opp_id"] = opp_id
                internship_data["link"] = f"https://unstop.com/internship/{opp_id}"
                
                # Get the title
                title_element = card.find_element(By.CSS_SELECTOR, ".opp-title h2")
                internship_data["title"] = title_element.text.strip()
                
                # Get the company name
                company_element = card.find_element(By.CSS_SELECTOR, ".content > p")
                internship_data["company"] = company_element.text.strip()
                
                # Get the application count if available
                try:
                    applied_box = card.find_element(By.XPATH, ".//div[contains(@class, 'seperate_box')][contains(., 'Applied')]")
                    applied_count = applied_box.text.split(' ')[0].strip()
                    internship_data["applications"] = applied_count
                except:
                    internship_data["applications"] = "N/A"
                
                # Get days left if available
                try:
                    days_left_box = card.find_element(By.XPATH, ".//div[contains(@class, 'seperate_box')][contains(., 'days left')]")
                    days_left = days_left_box.text.split(' ')[0].strip()
                    internship_data["days_left"] = days_left
                except:
                    internship_data["days_left"] = "N/A"
                
                # Get skills/requirements if available
                skills = []
                try:
                    skill_elements = card.find_elements(By.CSS_SELECTOR, ".chip_text")
                    for skill in skill_elements:
                        skills.append(skill.text.strip())
                    
                    # Check if there are more skills indicated by +X
                    try:
                        more_skills = card.find_element(By.CSS_SELECTOR, ".skill_count").text
                        skills.append(more_skills)
                    except:
                        pass
                except:
                    pass
                
                internship_data["skills"] = skills
                
                # Get the image URL if available
                try:
                    img_element = card.find_element(By.TAG_NAME, "img")
                    internship_data["image_url"] = img_element.get_attribute("src")
                except:
                    internship_data["image_url"] = "N/A"
                
                # Add to our list
                self.internships.append(internship_data)
                print(f"Extracted: {internship_data['title']} - {internship_data['company']}")
                
            except Exception as e:
                print(f"Error extracting internship data: {str(e)}")
    
    def get_internships_from_db(self, limit=None):
        """Get internships from MongoDB"""
        return self.internship_model.get_internships(limit)
    
    def cleanup(self):
        """Clean up resources"""
        self.internship_model.close_connection()