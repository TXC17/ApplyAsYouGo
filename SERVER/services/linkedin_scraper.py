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
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        # chrome_options.add_argument('--headless')  # Uncomment for headless mode
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.set_page_load_timeout(30)  # 30 second page load timeout
        wait = WebDriverWait(driver, 15)  # Reduced from 20 to 15
        driver.implicitly_wait(10)  # Reduced from 20 to 10

        return driver, wait

    def scrape_internships(self, filters):
        driver, wait = self._setup_driver()
        count = 0

        try:
            category = filters.get('category', 'internship')
            usertype = filters.get('usertype', 'fresher')
            passing_year = filters.get('passing_year', '2027')
            quick_apply = filters.get('quick_apply', True)

            # Construct LinkedIn search URL with better parameters
            base_url = "https://www.linkedin.com/jobs/search/"
            keywords = f"internship {category}".replace('-', ' ')
            query = f"?keywords={keywords.replace(' ', '%20')}&f_WT=2&f_TPR=r86400&location=India"
            
            if quick_apply:
                query += "&f_AL=true"  # LinkedIn Easy Apply filter
            if usertype == "fresher":
                query += "&f_E=1"  # Entry-level only for freshers

            print(f"Scraping LinkedIn with URL: {base_url + query}")
            driver.get(base_url + query)
            time.sleep(5)

            # Handle potential popups/modals
            try:
                # Close any modal that might appear
                close_button = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Dismiss']")
                close_button.click()
                time.sleep(1)
            except:
                pass

            # Scroll to load more jobs (reduced scrolling for faster scraping)
            for i in range(2):  # Reduced from 3 to 2
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)  # Reduced from 3 to 2 seconds
                print(f"Scrolled {i+1} times")

            # Try multiple selectors for job cards
            job_cards = []
            selectors = [
                "ul.jobs-search__results-list li",
                ".jobs-search-results__list-item",
                ".job-search-card",
                "[data-entity-urn*='jobPosting']"
            ]

            for selector in selectors:
                try:
                    job_cards = driver.find_elements(By.CSS_SELECTOR, selector)
                    if job_cards:
                        print(f"Found {len(job_cards)} job cards using selector: {selector}")
                        break
                except:
                    continue

            if not job_cards:
                print("No job cards found with any selector")
                return {'count': 0, 'message': 'No job listings found on LinkedIn'}

            collection = self.model.collection

            for i, card in enumerate(job_cards[:15]):  # Limit to first 15 jobs for faster scraping
                try:
                    # Try multiple selectors for each field
                    title = self._extract_text(card, [
                        "h3 a span[title]",
                        "h3 a span",
                        ".job-search-card__title a",
                        "h3",
                        "[data-entity-urn] h3"
                    ])

                    company = self._extract_text(card, [
                        "h4 a span[title]",
                        "h4 a span", 
                        ".job-search-card__subtitle a",
                        "h4",
                        "[data-entity-urn] h4"
                    ])

                    location = self._extract_text(card, [
                        ".job-search-card__location",
                        ".artdeco-entity-lockup__caption",
                        "div[class*='location']",
                        "span[class*='location']"
                    ])

                    # Get the job link
                    link = None
                    try:
                        link_element = card.find_element(By.CSS_SELECTOR, "h3 a, .job-search-card__title a, a[data-entity-urn]")
                        link = link_element.get_attribute("href").split("?")[0]
                    except:
                        pass

                    if title and company:  # Only save if we have essential data
                        internship_data = {
                            "title": title,
                            "company": company,
                            "location": location or "Not specified",
                            "apply_link": link,
                            "category": category,
                            "usertype": usertype,
                            "quick_apply": quick_apply,
                            "passing_year": passing_year,
                            "scraped_at": time.time()
                        }

                        # Check for duplicates
                        existing = collection.find_one({
                            "title": title,
                            "company": company
                        })

                        if not existing:
                            collection.insert_one(internship_data)
                            count += 1
                            print(f"Saved: {title} at {company}")

                except Exception as e:
                    print(f"Error processing job card {i}: {str(e)}")
                    continue

            message = f'Successfully scraped {count} LinkedIn internships'
            print(message)
            return {'count': count, 'message': message}

        except Exception as e:
            error_msg = f"LinkedIn scraping error: {str(e)}"
            print(error_msg)
            return {'count': 0, 'message': error_msg}

        finally:
            if driver:
                driver.quit()

    def _extract_text(self, element, selectors):
        """Try multiple selectors to extract text"""
        for selector in selectors:
            try:
                found_element = element.find_element(By.CSS_SELECTOR, selector)
                text = found_element.get_attribute("title") or found_element.text.strip()
                if text:
                    return text
            except:
                continue
        return None
