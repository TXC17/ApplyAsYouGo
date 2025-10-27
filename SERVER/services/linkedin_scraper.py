from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from models.linkedinInternships import LinkedInInternshipModel  # Custom MongoDB model

class LinkedInScraper:
    def __init__(self):
        self.model = LinkedInInternshipModel()

    def _setup_driver(self):
        chrome_options = Options()
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920x1080')
        chrome_options.add_argument('--start-maximized')
        chrome_options.add_argument('--disable-notifications')
        # chrome_options.add_argument('--headless')  # Uncomment for headless mode
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        wait = WebDriverWait(driver, 20)
        driver.implicitly_wait(20)

        return driver, wait

    def scrape_internships(self, filters):
        driver, wait = self._setup_driver()
        count = 0

        try:
            category = filters.get('category', 'full-stack-development')
            usertype = filters.get('usertype', 'fresher')
            passing_year = filters.get('passing_year', '2027')
            quick_apply = filters.get('quick_apply', True)

            # Construct LinkedIn search URL (unauthenticated)
            base_url = "https://www.linkedin.com/jobs/search/"
            query = f"?keywords={category.replace('-', '%20')}&f_WT=2&f_TPR=r86400"  # Internship + recent
            if quick_apply:
                query += "&f_AL=true"  # LinkedIn Easy Apply filter
            query += "&f_E=1" if usertype == "fresher" else ""  # Entry-level only for freshers

            driver.get(base_url + query)
            time.sleep(5)

            # Scroll to load jobs
            for _ in range(5):
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)

            job_cards = wait.until(EC.presence_of_all_elements_located(
                (By.CSS_SELECTOR, "ul.jobs-search__results-list li")
            ))

            collection = self.model.collection

            for card in job_cards:
                try:
                    title = card.find_element(By.CSS_SELECTOR, "h3").text.strip()
                    company = card.find_element(By.CSS_SELECTOR, "h4").text.strip()
                    location = card.find_element(By.CSS_SELECTOR, "div>div>div>span").text.strip()
                    link = card.find_element(By.CSS_SELECTOR, "a").get_attribute("href").split("?")[0]

                    internship_data = {
                        "title": title,
                        "company": company,
                        "location": location,
                        "apply_link": link,
                        "category": category,
                        "usertype": usertype,
                        "quick_apply": quick_apply,
                        "passing_year": passing_year
                    }

                    # Avoid duplicates
                    existing = collection.find_one({
                        "title": title,
                        "company": company,
                        "location": location
                    })

                    if not existing:
                        collection.insert_one(internship_data)
                        count += 1

                except Exception as e:
                    print(f"Error processing job card: {str(e)}")
                    continue

            return {'count': count, 'message': f'Successfully scraped {count} LinkedIn internships'}

        except Exception as e:
            print(f"LinkedIn scraping error: {str(e)}")
            return {'count': 0, 'message': f'Error: {str(e)}'}

        finally:
            if driver:
                driver.quit()
