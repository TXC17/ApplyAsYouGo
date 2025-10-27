from services.bot_service import InternshalaBot

class InternshalaController:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.bot = None
    
    def _initialize_bot(self):
        """Initialize the bot if not already initialized"""
        if self.bot is None:
            self.bot = InternshalaBot(self.email, self.password)
        return self.bot
    
    def process_search(self, keywords, max_applications=5, max_pages=2):
        """Process a search for internships"""
        try:
            bot = self._initialize_bot()
            
            # Login to Internshala
            if not bot.login():
                return {"success": False, "message": "Login failed"}
            
            results = {
                "success": True,
                "keywords": keywords,
                "applications": [],
                "total_applied": 0
            }
            
            # Search for internships
            if not bot.search_internships(keywords):
                bot.close()
                results["success"] = False
                results["message"] = f"Failed to search for {keywords}"
                return results
            
            # Apply to internships across multiple pages
            for page in range(1, max_pages + 1):
                page_results = []
                internships = bot.get_all_internships_on_page()
                
                for internship in internships[:max_applications]:
                    application_result = {
                        "success": False,
                        "title": "Unknown",
                        "company": "Unknown"
                    }
                    
                    # Extract internship details before applying
                    try:
                        title_element = internship.find_element(bot.driver.By.CSS_SELECTOR, "a.job-title-href")
                        application_result["title"] = title_element.text
                        
                        company_element = internship.find_element(bot.driver.By.CSS_SELECTOR, "p.company-name")
                        application_result["company"] = company_element.text.strip()
                    except:
                        pass
                    
                    # Apply to the internship
                    if bot.apply_to_internship(internship):
                        application_result["success"] = True
                        results["total_applied"] += 1
                    
                    page_results.append(application_result)
                    
                    if len(page_results) >= max_applications:
                        break
                
                results["applications"].extend(page_results)
                
                # Navigate to next page if needed
                if page < max_pages and not bot.navigate_to_next_page():
                    break
            
            # Close the browser
            bot.close()
            self.bot = None
            
            return results
            
        except Exception as e:
            if self.bot:
                self.bot.close()
                self.bot = None
            raise e
    
    def apply_to_specific_internship(self, url):
        """Apply to a specific internship URL"""
        try:
            bot = self._initialize_bot()
            
            # Login to Internshala
            if not bot.login():
                return {"success": False, "message": "Login failed"}
            
            result = {
                "success": False,
                "url": url,
                "message": ""
            }
            
            # Navigate to the URL
            bot.driver.get(url)
            
            # Wait for the page to load
            bot._wait_for_page_load()
            
            # Extract internship details
            try:
                title_element = bot.driver.find_element(bot.driver.By.CSS_SELECTOR, ".profile_title h4, .job-title")
                result["title"] = title_element.text
            except:
                result["title"] = "Unknown"
                
            try:
                company_element = bot.driver.find_element(bot.driver.By.CSS_SELECTOR, ".company_name, .company-name")
                result["company"] = company_element.text
            except:
                result["company"] = "Unknown"
            
            # Try to find the apply button
            apply_button = None
            apply_selectors = [
                "button#continue_button",
                "button.btn-primary:contains('Apply now')",
                "button:contains('Apply')",
                "a.apply-button",
                "a:contains('Apply')",
                ".apply_button",
                ".apply-now-button",
                ".apply-now"
            ]
            
            for selector in apply_selectors:
                try:
                    elements = bot.driver.find_elements(bot.driver.By.CSS_SELECTOR, selector)
                    for element in elements:
                        if element.is_displayed() and ("apply" in element.text.lower() or "continue" in element.text.lower()):
                            apply_button = element
                            break
                    if apply_button:
                        break
                except:
                    continue
            
            if not apply_button:
                # Try a more generic approach - look for any button with "apply" in text
                buttons = bot.driver.find_elements(bot.driver.By.TAG_NAME, "button")
                for button in buttons:
                    if button.is_displayed() and ("apply" in button.text.lower() or "continue" in button.text.lower()):
                        apply_button = button
                        break
            
            if apply_button:
                # Scroll to the apply button
                bot._scroll_into_view(apply_button)
                bot._human_like_click(apply_button)
                
                # Wait for application form to load
                bot._wait_for_page_load()
                
                # Handle application form
                if bot._handle_application_form():
                    result["success"] = True
                    result["message"] = "Successfully applied"
                else:
                    result["message"] = "Failed to complete application"
            else:
                result["message"] = "Could not find Apply button"
            
            # Close the browser
            bot.close()
            self.bot = None
            
            return result
            
        except Exception as e:
            if self.bot:
                self.bot.close()
                self.bot = None
            result = {
                "success": False,
                "url": url,
                "message": f"Error: {str(e)}"
            }
            return result