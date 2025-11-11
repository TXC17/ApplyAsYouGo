"""
OAuth Helper Service for handling Google login automation
This service helps manage OAuth flows for platforms that support Google login
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pickle
import os

class OAuthHelper:
    """Helper class for OAuth authentication flows"""
    
    def __init__(self, platform_name):
        self.platform_name = platform_name
        self.session_file = f"sessions/{platform_name}_session.pkl"
        os.makedirs("sessions", exist_ok=True)
    
    def save_session(self, driver):
        """Save browser session cookies for reuse"""
        try:
            cookies = driver.get_cookies()
            with open(self.session_file, 'wb') as f:
                pickle.dump(cookies, f)
            return True
        except Exception as e:
            print(f"Error saving session: {str(e)}")
            return False
    
    def load_session(self, driver):
        """Load saved browser session cookies"""
        try:
            if not os.path.exists(self.session_file):
                return False
            
            with open(self.session_file, 'rb') as f:
                cookies = pickle.load(f)
            
            for cookie in cookies:
                try:
                    driver.add_cookie(cookie)
                except Exception as e:
                    # Some cookies might fail to load, that's okay
                    pass
            
            return True
        except Exception as e:
            print(f"Error loading session: {str(e)}")
            return False
    
    def wait_for_manual_login(self, driver, success_url_pattern, timeout=300):
        """
        Wait for user to manually complete OAuth login
        
        Args:
            driver: Selenium WebDriver instance
            success_url_pattern: URL pattern that indicates successful login
            timeout: Maximum time to wait (default 5 minutes)
        
        Returns:
            bool: True if login successful, False otherwise
        """
        try:
            print(f"\n{'='*60}")
            print(f"MANUAL LOGIN REQUIRED FOR {self.platform_name.upper()}")
            print(f"{'='*60}")
            print("Please complete the login in the browser window that opened.")
            print(f"Waiting up to {timeout} seconds...")
            print(f"{'='*60}\n")
            
            start_time = time.time()
            
            while time.time() - start_time < timeout:
                current_url = driver.current_url
                
                # Check if we've reached the success URL
                if success_url_pattern in current_url:
                    print(f"\n✓ Login successful for {self.platform_name}!")
                    self.save_session(driver)
                    return True
                
                time.sleep(2)
            
            print(f"\n✗ Login timeout for {self.platform_name}")
            return False
            
        except Exception as e:
            print(f"Error during manual login wait: {str(e)}")
            return False
    
    def handle_google_login_button(self, driver, google_button_selectors):
        """
        Click the Google login button on a platform
        
        Args:
            driver: Selenium WebDriver instance
            google_button_selectors: List of CSS selectors to try for Google login button
        
        Returns:
            bool: True if button clicked successfully
        """
        try:
            wait = WebDriverWait(driver, 10)
            
            for selector in google_button_selectors:
                try:
                    button = wait.until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                    )
                    button.click()
                    time.sleep(2)
                    return True
                except:
                    continue
            
            # Try finding by text content
            try:
                buttons = driver.find_elements(By.TAG_NAME, "button")
                for button in buttons:
                    if "google" in button.text.lower():
                        button.click()
                        time.sleep(2)
                        return True
            except:
                pass
            
            return False
            
        except Exception as e:
            print(f"Error clicking Google login button: {str(e)}")
            return False
    
    def clear_session(self):
        """Clear saved session file"""
        try:
            if os.path.exists(self.session_file):
                os.remove(self.session_file)
                return True
            return False
        except Exception as e:
            print(f"Error clearing session: {str(e)}")
            return False


class GoogleLoginAutomation:
    """Specialized class for Google OAuth automation"""
    
    @staticmethod
    def handle_internshala_google_login(driver, email):
        """Handle Google login for Internshala"""
        oauth_helper = OAuthHelper("internshala")
        
        # Navigate to Internshala login page
        driver.get("https://internshala.com/login")
        time.sleep(2)
        
        # Try to load existing session
        if oauth_helper.load_session(driver):
            driver.refresh()
            time.sleep(2)
            
            # Check if already logged in
            if "dashboard" in driver.current_url or "student" in driver.current_url:
                return True
        
        # Click Google login button
        google_selectors = [
            "button[data-google-login]",
            ".google-login-button",
            "button:contains('Google')",
            "#google-login-btn"
        ]
        
        if oauth_helper.handle_google_login_button(driver, google_selectors):
            # Wait for manual Google login
            return oauth_helper.wait_for_manual_login(
                driver, 
                success_url_pattern="internshala.com/student",
                timeout=300
            )
        
        return False
    
    @staticmethod
    def handle_linkedin_google_login(driver, email):
        """Handle Google login for LinkedIn"""
        oauth_helper = OAuthHelper("linkedin")
        
        driver.get("https://www.linkedin.com/login")
        time.sleep(2)
        
        if oauth_helper.load_session(driver):
            driver.refresh()
            time.sleep(2)
            
            if "feed" in driver.current_url or "mynetwork" in driver.current_url:
                return True
        
        google_selectors = [
            "button[data-provider='google']",
            ".google-login",
            "button:contains('Google')"
        ]
        
        if oauth_helper.handle_google_login_button(driver, google_selectors):
            return oauth_helper.wait_for_manual_login(
                driver,
                success_url_pattern="linkedin.com/feed",
                timeout=300
            )
        
        return False
    
    @staticmethod
    def handle_unstop_google_login(driver, email):
        """Handle Google login for Unstop"""
        oauth_helper = OAuthHelper("unstop")
        
        driver.get("https://unstop.com/login")
        time.sleep(2)
        
        if oauth_helper.load_session(driver):
            driver.refresh()
            time.sleep(2)
            
            if "dashboard" in driver.current_url or "profile" in driver.current_url:
                return True
        
        google_selectors = [
            "button[data-provider='google']",
            ".google-signin-button",
            "button:contains('Google')"
        ]
        
        if oauth_helper.handle_google_login_button(driver, google_selectors):
            return oauth_helper.wait_for_manual_login(
                driver,
                success_url_pattern="unstop.com/",
                timeout=300
            )
        
        return False
