import os
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains

class LinkedInBot:
    def __init__(self, email, password=None, use_google_login=False, user_profile=None):
        """Initialize the LinkedIn bot with user credentials"""
        self.email = email
        self.password = password
        self.use_google_login = use_google_login
        self.user_profile = user_profile or {}
        
        if not self.email:
            raise ValueError("Email not provided.")
        
        if not use_google_login and not self.password:
            raise ValueError("Password not provided for email/password login.")
        
        print(f"[BOT] User profile loaded: Phone={bool(self.user_profile.get('phone'))}, Name={bool(self.user_profile.get('fullName'))}")
        
        # Setup Chrome options
        options = Options()
        
        # Create a completely separate Chrome profile for automation
        # This avoids conflicts with your main Chrome browser
        import tempfile
        temp_profile = os.path.join(tempfile.gettempdir(), 'LinkedInAutomation')
        
        # Create the directory if it doesn't exist
        os.makedirs(temp_profile, exist_ok=True)
        
        options.add_argument(f'--user-data-dir={temp_profile}')
        print(f"[CHROME] Using dedicated automation profile: {temp_profile}")
        print(f"[CHROME] This is a SEPARATE Chrome window - keep your main browser open!")
        print(f"[CHROME] Note: You'll need to login with Google the first time, then it will remember")
        
        # Run in visible mode for Google login
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--window-size=1920,1080')
        options.add_argument('--disable-notifications')
        options.add_argument('--disable-popup-blocking')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        # Add user agent
        options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        self.driver = webdriver.Chrome(options=options)
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 15)
        self.actions = ActionChains(self.driver)

    def login(self):
        """Login to LinkedIn"""
        print("[BOT] ===== LOGIN METHOD CALLED =====")
        try:
            print("[BOT] Step 1: Navigating to LinkedIn...")
            self.driver.get("https://www.linkedin.com/login")
            print("[BOT] Step 2: Waiting 3 seconds...")
            time.sleep(3)
            
            # Check if already logged in (redirected to feed)
            print("[BOT] Step 3: Checking current URL...")
            current_url = self.driver.current_url
            print(f"[BOT] Current URL after navigation: {current_url}")
            
            # Check multiple indicators of being logged in
            if "feed" in current_url or "mynetwork" in current_url or "/in/" in current_url:
                print("[BOT] ✓ Already logged in! (Saved session from previous login)")
                print("[BOT] Returning True from login()")
                return True
            
            # Also check if we can find navigation elements that only appear when logged in
            print("[BOT] Step 4: Checking for navigation elements...")
            try:
                nav_elements = self.driver.find_elements(By.CSS_SELECTOR, "nav.global-nav")
                if nav_elements and len(nav_elements) > 0:
                    print("[BOT] ✓ Already logged in! (Found navigation elements)")
                    print("[BOT] Returning True from login()")
                    return True
            except Exception as nav_e:
                print(f"[BOT] Nav check failed: {nav_e}")
            
            print("[BOT] Step 5: Not logged in, proceeding with login...")
            if self.use_google_login:
                print("[BOT] Using Google login...")
                result = self._login_with_google()
                print(f"[BOT] Google login returned: {result}")
                return result
            else:
                print("[BOT] Using email/password login...")
                result = self._login_with_email_password()
                print(f"[BOT] Email/password login returned: {result}")
                return result
                
        except Exception as e:
            print(f"[BOT] ===== ERROR during login: {e} =====")
            import traceback
            traceback.print_exc()
            return False
    
    def _login_with_email_password(self):
        """Login using email and password"""
        try:
            # Wait for login form
            email_field = self.wait.until(EC.presence_of_element_located((By.ID, "username")))
            password_field = self.wait.until(EC.presence_of_element_located((By.ID, "password")))
            
            # Enter credentials
            email_field.send_keys(self.email)
            time.sleep(random.uniform(0.5, 1.5))
            password_field.send_keys(self.password)
            time.sleep(random.uniform(0.5, 1.5))
            
            # Click login button
            login_button = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))
            login_button.click()
            
            # Wait for successful login
            time.sleep(5)
            
            # Check if we're on the feed page
            if "feed" in self.driver.current_url or "mynetwork" in self.driver.current_url:
                print("Login successful!")
                return True
            else:
                print("Login may have failed or requires verification")
                return False
                
        except TimeoutException:
            print("Login failed. Please check your credentials.")
            return False
    
    def _login_with_google(self):
        """Login using Google OAuth"""
        try:
            print("[BOT] Looking for Google login button on LinkedIn...")
            print(f"[BOT] Current URL: {self.driver.current_url}")
            
            # LinkedIn has "Sign in with Google" button
            google_button_selectors = [
                "button[data-tracking-control-name*='google']",
                "button[aria-label*='Google']",
                ".google-auth-button",
                "button.google-login",
                "a[href*='google']"
            ]
            
            google_button = None
            for selector in google_button_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        if element.is_displayed():
                            google_button = element
                            print(f"[BOT] Found Google button with selector: {selector}")
                            break
                    if google_button:
                        break
                except Exception as e:
                    continue
            
            if not google_button:
                print("[BOT] Standard selectors failed, trying to find by text...")
                # Try finding by text - look for buttons and links
                all_clickable = self.driver.find_elements(By.TAG_NAME, "button") + \
                               self.driver.find_elements(By.TAG_NAME, "a") + \
                               self.driver.find_elements(By.TAG_NAME, "div")
                
                for element in all_clickable:
                    try:
                        if not element.is_displayed():
                            continue
                        text = element.text.lower()
                        aria_label = element.get_attribute("aria-label")
                        if aria_label:
                            aria_label = aria_label.lower()
                        
                        if ("google" in text or (aria_label and "google" in aria_label)) and \
                           ("sign in" in text or "continue" in text or "login" in text or \
                            (aria_label and ("sign in" in aria_label or "continue" in aria_label))):
                            google_button = element
                            print(f"[BOT] Found Google button by text: '{element.text}' or aria-label: '{aria_label}'")
                            break
                    except:
                        continue
            
            if google_button:
                print("[BOT] Clicking Google login button...")
                try:
                    google_button.click()
                except:
                    # Try JavaScript click if regular click fails
                    self.driver.execute_script("arguments[0].click();", google_button)
                
                time.sleep(3)
                
                print("[BOT] ⏳ Please complete Google authentication in the browser window...")
                print("[BOT] ⏳ Waiting for login to complete (timeout: 120 seconds)...")
                print(f"[BOT] Current URL: {self.driver.current_url}")
                
                # Wait until we're redirected to LinkedIn feed
                for i in range(120):
                    current_url = self.driver.current_url
                    if "feed" in current_url or "mynetwork" in current_url or "/in/" in current_url:
                        print("[BOT] ✓ Google login successful!")
                        return True
                    if i % 10 == 0:  # Log every 10 seconds
                        print(f"[BOT] Still waiting... ({i}/120 seconds)")
                    time.sleep(1)
                
                print("[BOT] ✗ Google login timed out")
                print(f"[BOT] Final URL: {self.driver.current_url}")
                return False
            else:
                print("[BOT] ✗ Could not find Google login button on the page")
                print(f"[BOT] Current URL: {self.driver.current_url}")
                print("[BOT] Page title:", self.driver.title)
                
                # Save screenshot for debugging
                try:
                    screenshot_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'linkedin_login_debug.png')
                    self.driver.save_screenshot(screenshot_path)
                    print(f"[BOT] Screenshot saved to: {screenshot_path}")
                except:
                    pass
                
                return False
                
        except TimeoutException:
            print("[BOT] ✗ Google login timed out")
            return False
        except Exception as e:
            print(f"[BOT] ✗ Google login error: {e}")
            import traceback
            traceback.print_exc()
            return False

    def search_jobs(self, keywords):
        """Search for jobs on LinkedIn"""
        try:
            print(f"[BOT] Searching for jobs: {keywords}")
            
            # Navigate to jobs page with entry-level filter
            search_url = f"https://www.linkedin.com/jobs/search/?keywords={keywords.replace(' ', '%20')}&location=India&f_E=1,2&f_TPR=r86400"
            print(f"[BOT] Navigating to: {search_url}")
            self.driver.get(search_url)
            print(f"[BOT] Waiting for page to load...")
            time.sleep(5)
            
            print(f"[BOT] Current URL: {self.driver.current_url}")
            print(f"[BOT] Page title: {self.driver.title}")
            
            # Check if job listings are present - try multiple selectors
            job_list_selectors = [
                "jobs-search-results__list",
                "jobs-search__results-list",
                "scaffold-layout__list-container",
                "jobs-search-results-list"
            ]
            
            found = False
            for selector in job_list_selectors:
                try:
                    elements = self.driver.find_elements(By.CLASS_NAME, selector)
                    if elements and len(elements) > 0:
                        print(f"[BOT] ✓ Found job listings with selector: {selector}")
                        found = True
                        break
                except:
                    continue
            
            if not found:
                print("[BOT] ✗ Could not find job listings with standard selectors")
                print("[BOT] Trying alternative method...")
                
                # Try finding any job cards
                job_cards = self.driver.find_elements(By.CSS_SELECTOR, "[data-job-id]")
                if job_cards and len(job_cards) > 0:
                    print(f"[BOT] ✓ Found {len(job_cards)} job cards using data-job-id")
                    found = True
                else:
                    # Save screenshot for debugging
                    try:
                        screenshot_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'linkedin_jobs_debug.png')
                        self.driver.save_screenshot(screenshot_path)
                        print(f"[BOT] Screenshot saved to: {screenshot_path}")
                    except:
                        pass
            
            if found:
                print(f"[BOT] ✓ Successfully loaded jobs page for: {keywords}")
                return True
            else:
                print("[BOT] ✗ No jobs found or page didn't load properly")
                return False
                
        except Exception as e:
            print(f"[BOT] ✗ Error searching for jobs: {e}")
            import traceback
            traceback.print_exc()
            return False

    def get_all_jobs_on_page(self):
        """Get all job listings on the current page"""
        try:
            print("[BOT] Getting job listings from page...")
            
            # Try multiple selectors for job cards
            job_card_selectors = [
                "[data-job-id]",
                ".jobs-search-results__list-item",
                ".job-card-container",
                ".scaffold-layout__list-item"
            ]
            
            job_cards = []
            for selector in job_card_selectors:
                try:
                    cards = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if cards and len(cards) > 0:
                        job_cards = cards
                        print(f"[BOT] Found {len(job_cards)} job listings using selector: {selector}")
                        break
                except:
                    continue
            
            if not job_cards:
                print("[BOT] ✗ No job cards found with any selector")
            
            return job_cards
            
        except Exception as e:
            print(f"[BOT] ✗ Error getting job listings: {e}")
            import traceback
            traceback.print_exc()
            return []

    def apply_to_job(self, job_card):
        """Apply to a specific job"""
        try:
            # First, check if there's a discard confirmation modal and handle it
            try:
                discard_modal = self.driver.find_elements(By.CSS_SELECTOR, "[data-test-modal-id='data-test-easy-apply-discard-confirmation']")
                if discard_modal and len(discard_modal) > 0 and discard_modal[0].is_displayed():
                    print("[BOT] Found discard confirmation modal, clicking Discard...")
                    # Click the Discard button
                    discard_buttons = self.driver.find_elements(By.CSS_SELECTOR, "button[data-test-dialog-primary-btn]")
                    for btn in discard_buttons:
                        if "discard" in btn.text.lower():
                            btn.click()
                            time.sleep(1)
                            break
            except:
                pass
            
            # Scroll the job card into view
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", job_card)
            time.sleep(1)
            
            # Click on the job card to view details
            try:
                job_card.click()
            except:
                # Try JavaScript click if regular click fails
                self.driver.execute_script("arguments[0].click();", job_card)
            
            time.sleep(2)
            
            # Look for Easy Apply button
            try:
                easy_apply_button = self.driver.find_element(By.CSS_SELECTOR, "button.jobs-apply-button")
                if "Easy Apply" in easy_apply_button.text or "easy apply" in easy_apply_button.text.lower():
                    print("[BOT] Found Easy Apply button, clicking...")
                    try:
                        easy_apply_button.click()
                    except:
                        self.driver.execute_script("arguments[0].click();", easy_apply_button)
                    
                    time.sleep(3)
                    
                    # Handle the Easy Apply modal
                    # Check if it's a simple one-click apply or multi-step
                    try:
                        # Try to fill any visible form fields with profile data
                        if self.user_profile:
                            print("[BOT] Attempting to fill form fields with profile data...")
                            self._fill_application_form()
                        
                        # Check if this is a multi-step application (has "Next" button)
                        next_buttons = self.driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='Continue'], button[aria-label*='Next']")
                        has_next = False
                        for btn in next_buttons:
                            try:
                                if btn.is_displayed() and btn.text and ("next" in btn.text.lower() or "continue" in btn.text.lower()):
                                    has_next = True
                                    break
                            except:
                                continue
                        
                        if has_next:
                            print("[BOT] Multi-step application detected, attempting to fill and proceed...")
                            # Try to click Next button after filling
                            try:
                                for btn in next_buttons:
                                    if btn.is_displayed() and ("next" in btn.text.lower() or "continue" in btn.text.lower()):
                                        print("[BOT] Clicking Next button...")
                                        btn.click()
                                        time.sleep(2)
                                        
                                        # Fill next page if needed
                                        if self.user_profile:
                                            self._fill_application_form()
                                        
                                        # Check if we can submit now
                                        break
                            except Exception as e:
                                print(f"[BOT] Could not proceed with multi-step: {e}")
                                # Close the modal
                                self._close_easy_apply_modal()
                                return False
                        
                        # Look for Submit button (simple one-click apply)
                        submit_selectors = [
                            "button[aria-label*='Submit application']",
                            "button[aria-label*='Submit']"
                        ]
                        
                        submitted = False
                        for selector in submit_selectors:
                            try:
                                submit_buttons = self.driver.find_elements(By.CSS_SELECTOR, selector)
                                for submit_button in submit_buttons:
                                    if submit_button.is_displayed() and "submit" in submit_button.get_attribute("aria-label").lower():
                                        print("[BOT] Found simple submit button, clicking...")
                                        submit_button.click()
                                        time.sleep(2)
                                        print("[BOT] ✓ Application submitted!")
                                        submitted = True
                                        break
                                if submitted:
                                    break
                            except:
                                continue
                        
                        if submitted:
                            return True
                        else:
                            print("[BOT] ⚠️ No simple submit button found, skipping...")
                            self._close_easy_apply_modal()
                            return False
                    except Exception as modal_e:
                        print(f"[BOT] Error in Easy Apply modal: {modal_e}")
                        self._close_easy_apply_modal()
                        return False
                else:
                    print("[BOT] Not an Easy Apply job")
                    return False
            except Exception as apply_e:
                print(f"[BOT] Easy Apply button not found: {apply_e}")
                return False
                
        except Exception as e:
            print(f"[BOT] Error applying to job: {e}")
            return False

    def _fill_application_form(self):
        """Fill application form fields with user profile data"""
        try:
            # Fill phone number
            if self.user_profile.get('phone'):
                phone_selectors = [
                    "input[id*='phone']",
                    "input[name*='phone']",
                    "input[type='tel']"
                ]
                for selector in phone_selectors:
                    try:
                        phone_fields = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        for field in phone_fields:
                            if field.is_displayed() and not field.get_attribute('value'):
                                field.clear()
                                field.send_keys(self.user_profile['phone'])
                                print(f"[BOT] Filled phone number")
                                break
                    except:
                        continue
            
            # Fill other text fields that might be empty
            text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text'], input:not([type])")
            for input_field in text_inputs:
                try:
                    if not input_field.is_displayed() or input_field.get_attribute('value'):
                        continue
                    
                    label = input_field.get_attribute('aria-label') or input_field.get_attribute('placeholder') or ''
                    label = label.lower()
                    
                    if 'linkedin' in label and self.user_profile.get('linkedinUrl'):
                        input_field.send_keys(self.user_profile['linkedinUrl'])
                        print(f"[BOT] Filled LinkedIn URL")
                    elif 'portfolio' in label or 'website' in label:
                        if self.user_profile.get('portfolioUrl'):
                            input_field.send_keys(self.user_profile['portfolioUrl'])
                            print(f"[BOT] Filled portfolio URL")
                    elif 'github' in label and self.user_profile.get('githubUrl'):
                        input_field.send_keys(self.user_profile['githubUrl'])
                        print(f"[BOT] Filled GitHub URL")
                except:
                    continue
            
            time.sleep(1)
        except Exception as e:
            print(f"[BOT] Error filling form: {e}")
    
    def _close_easy_apply_modal(self):
        """Close Easy Apply modal and handle discard confirmation"""
        try:
            # Click dismiss button
            dismiss_buttons = self.driver.find_elements(By.CSS_SELECTOR, "button[aria-label='Dismiss']")
            for btn in dismiss_buttons:
                if btn.is_displayed():
                    btn.click()
                    time.sleep(1)
                    break
            
            # Handle discard confirmation
            time.sleep(1)
            discard_buttons = self.driver.find_elements(By.CSS_SELECTOR, "button[data-test-dialog-primary-btn]")
            for btn in discard_buttons:
                try:
                    if btn.is_displayed() and "discard" in btn.text.lower():
                        print("[BOT] Clicking Discard button...")
                        btn.click()
                        time.sleep(1)
                        break
                except:
                    continue
        except Exception as e:
            print(f"[BOT] Error closing modal: {e}")

    def close(self):
        """Close the browser"""
        try:
            self.driver.quit()
            print("Browser closed")
        except Exception as e:
            print(f"Error closing browser: {e}")
