import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
# -------------------
# Configuration
# -------------------

#----IMPORTANT----#
#  MUST RUN quitChrome.py BEFORE extractor.py
#----IMPORTANT----#

# Path to the Chrome executable (preinstalled Chrome browser)
chrome_binary_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Path to the ChromeDriver executable
driver_path = r"C:\WebDriver\chromedriver-win64\chromedriver.exe"

# Path to your Chrome user data directory
user_data_dir = r"C:\Users\jyall\AppData\Local\Google\Chrome\User Data"
profile_dir = "Default"

# Set up Chrome options to use your existing profile
chrome_options = Options()
chrome_options.binary_location = chrome_binary_path
chrome_options.add_argument(f"--user-data-dir={user_data_dir}")
chrome_options.add_argument(f"--profile-directory={profile_dir}")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

# Create the WebDriver instance
service = Service(driver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

# Base search URL pattern.
# We'll insert both the page number and the query (subject) dynamically.
BASE_SEARCH_URL = "https://outline.uwaterloo.ca/browse/search/?page={page}&q={query}&term=1251"

# Directory to save HTML files within the same folder as this script
script_dir = os.path.dirname(os.path.abspath(__file__))
output_folder = os.path.join(script_dir, "HTML_Files")
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Path to the text file that contains the subjects/queries to search for and extract
csv_path = os.path.join(script_dir, 'coursecodes.csv')
df = pd.read_csv(csv_path)
subjects = df['Course Strings'].dropna().tolist()

# -------------------
# Main Scraping Logic
# -------------------

try:
    # For each subject in the file
    for subject in subjects:
        print(f"Starting scrape for subject: {subject}")

        subject_folder = os.path.join(output_folder, subject)
        if not os.path.exists(subject_folder):
            os.makedirs(subject_folder)

        page = 1
        while True:

            # Construct the search URL for the current subject and page
            search_url = BASE_SEARCH_URL.format(page=page, query=subject)
            print(f"Visiting: {search_url}")

            # Open the search page
            driver.get(search_url)

            # Try waiting for the "view" buttons to appear
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_all_elements_located((By.CLASS_NAME, "btn-outline-primary"))
                )
            except:
                # If we timed out waiting for the buttons, assume no results or no page
                print(f"No view buttons found on page {page} for subject '{subject}'.")
                break  # Move to the next subject

            # Find all "view" buttons on the page
            view_buttons = driver.find_elements(By.CLASS_NAME, "btn-outline-primary")
            
            # If there are no buttons, there's nothing to scrape — break the loop
            if not view_buttons:
                print(f"No view buttons found on page {page} for subject '{subject}'.")
                break

            # Loop through all "view" buttons on the current page
            for i, button in enumerate(view_buttons, start=1):
                relative_url = button.get_attribute("href")
                if relative_url:
                    # Note: The site uses relative links ("/something") in some cases. 
                    # Check how the URL looks; if it starts with "/", prefix the domain.
                    if relative_url.startswith("/"):
                        # outline.uwaterloo.ca is presumably your base domain
                        redirect_url = f"https://outline.uwaterloo.ca{relative_url}"
                    else:
                        redirect_url = relative_url

                    print(f"Navigating to: {redirect_url}")

                    # Navigate to the redirected page
                    driver.get(redirect_url)

                    # Save the HTML of the page
                    html_content = driver.page_source
                    # Create a filename that includes subject, page, and the link index
                    html_file_path = os.path.join(subject_folder, f"{subject}_page{page}_{i}.html")

                    with open(html_file_path, "w", encoding="utf-8") as file:
                        file.write(html_content)

                    print(f"Saved HTML for subject '{subject}', page {page}, link {i}: {html_file_path}")

                    # Navigate back to the search results page
                    driver.back()

                    # Re-locate "view" buttons after navigating back
                    WebDriverWait(driver, 10).until(
                        EC.presence_of_all_elements_located((By.CLASS_NAME, "btn-outline-primary"))
                    )
                    view_buttons = driver.find_elements(By.CLASS_NAME, "btn-outline-primary")
                else:
                    print(f"No redirect URL found for button {i}.")

            # After finishing scraping all buttons on this page, 
            # increment the page number and see if there is a next page
            page += 1

finally:
    # Close the browser after finishing
    driver.quit()
