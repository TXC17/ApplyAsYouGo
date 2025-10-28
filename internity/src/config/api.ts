const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/user/signup`,
  LOGIN: `${API_BASE_URL}/user/login`,
  PROFILE: `${API_BASE_URL}/user/profile`,
  USER_DETAILS: `${API_BASE_URL}/user/details`,
  USER_APPLICATIONS: `${API_BASE_URL}/user/applications`,
  
  // Scraping endpoints
  LINKEDIN_SCRAPE: `${API_BASE_URL}/linkedin/scrape`,
  INTERNSHALA_SCRAPE: `${API_BASE_URL}/internshala/scrape`,
  UNSTOP_SCRAPE: `${API_BASE_URL}/unstop/scrape`,
  
  // Resume endpoints
  PROCESS_RESUME: `${API_BASE_URL}/api/process-resume`,
} as const

export default API_BASE_URL