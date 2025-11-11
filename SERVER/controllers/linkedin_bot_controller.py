from services.linkedin_bot_service import LinkedInBot

class LinkedInController:
    def __init__(self, email, password=None, login_method='email', user_profile=None):
        self.email = email
        self.password = password
        self.login_method = login_method
        self.user_profile = user_profile or {}
        self.bot = None
    
    def _initialize_bot(self):
        """Initialize the bot if not already initialized"""
        if self.bot is None:
            if self.login_method == 'google':
                self.bot = LinkedInBot(self.email, password=None, use_google_login=True, user_profile=self.user_profile)
            else:
                self.bot = LinkedInBot(self.email, self.password, use_google_login=False, user_profile=self.user_profile)
        return self.bot
    
    def process_search(self, keywords, max_applications=5, max_pages=2):
        """Process a search for jobs"""
        try:
            print(f"[LINKEDIN_CONTROLLER] Initializing bot for {self.email}")
            bot = self._initialize_bot()
            
            # Login to LinkedIn
            print(f"[LINKEDIN_CONTROLLER] Attempting login...")
            if not bot.login():
                print(f"[LINKEDIN_CONTROLLER] Login failed!")
                return {"success": False, "message": "Login failed - please check your credentials"}
            
            print(f"[LINKEDIN_CONTROLLER] Login successful!")
            results = {
                "success": True,
                "keywords": keywords,
                "applications": [],
                "total_applied": 0
            }
            
            # Search for jobs
            print(f"[LINKEDIN_CONTROLLER] Searching for jobs: {keywords}")
            if not bot.search_jobs(keywords):
                print(f"[LINKEDIN_CONTROLLER] Search failed!")
                bot.close()
                results["success"] = False
                results["message"] = f"Failed to search for {keywords}"
                return results
            
            print(f"[LINKEDIN_CONTROLLER] Search successful!")
            
            # Apply to jobs
            for page in range(1, max_pages + 1):
                print(f"[LINKEDIN_CONTROLLER] Processing page {page}/{max_pages}")
                page_results = []
                jobs = bot.get_all_jobs_on_page()
                print(f"[LINKEDIN_CONTROLLER] Found {len(jobs)} jobs on page {page}")
                
                for job in jobs[:max_applications]:
                    application_result = {
                        "success": False,
                        "title": "Unknown",
                        "company": "Unknown"
                    }
                    
                    # Try to extract job details
                    try:
                        title_element = job.find_element(bot.driver.By.CSS_SELECTOR, ".job-card-list__title")
                        application_result["title"] = title_element.text
                        
                        company_element = job.find_element(bot.driver.By.CSS_SELECTOR, ".job-card-container__company-name")
                        application_result["company"] = company_element.text.strip()
                    except:
                        pass
                    
                    # Apply to the job
                    if bot.apply_to_job(job):
                        application_result["success"] = True
                        results["total_applied"] += 1
                    
                    page_results.append(application_result)
                    
                    if len(page_results) >= max_applications:
                        break
                
                results["applications"].extend(page_results)
            
            # Close the browser
            print(f"[LINKEDIN_CONTROLLER] Closing browser. Total applied: {results['total_applied']}")
            bot.close()
            self.bot = None
            
            return results
            
        except Exception as e:
            print(f"[LINKEDIN_CONTROLLER] ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
            if self.bot:
                try:
                    self.bot.close()
                except:
                    pass
                self.bot = None
            return {
                "success": False,
                "message": f"Error during automation: {str(e)}",
                "applications": [],
                "total_applied": 0
            }
