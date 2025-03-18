# SCRAPE ONE ARRAY "COMMST" IN ALL

import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
from indexCourses import process_csv_files

# -------------------
# Configuration
# -------------------

all_courses = process_csv_files("schedules/Courses")

chrome_binary_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
driver_path = r"C:\WebDriver\chromedriver-win64\chromedriver.exe"
user_data_dir = r"C:\Users\jyall\AppData\Local\Google\Chrome\User Data"
profile_dir = "Default"

chrome_options = Options()
chrome_options.binary_location = chrome_binary_path
#chrome_options.add_argument(f"--user-data-dir={user_data_dir}")
#chrome_options.add_argument(f"--profile-directory={profile_dir}")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--disable-extensions")


service = Service(driver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

BASE_SEARCH_URL = "https://classes.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl?sess=1251&level=under&subject={subject}&cournum={code}"

script_dir = os.path.dirname(os.path.abspath(__file__))
output_folder = os.path.join(script_dir, "HTML_Schedules")
os.makedirs(output_folder, exist_ok=True)

# -------------------
# Main Scraping Logic
# -------------------

try:
    subject = "COMMST"
    for index in all_courses:
        if (index[0] == subject):
            row = index
        else:
            row = all_courses[0]

    subject_folder = os.path.join(output_folder, subject)
    os.makedirs(subject_folder, exist_ok=True)

    for i in range(1, len(row)):
        course_code = row[i]
        search_url = BASE_SEARCH_URL.format(subject=subject, code=course_code)
        print(f"Visiting: {search_url}")

        try:
            # Open the search page
            driver.get(search_url)

            # Wait for the page to load completely
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )

            # Save the HTML content
            html_content = driver.page_source
            html_file_path = os.path.join(subject_folder, f"{subject}_code{course_code}.html")

            with open(html_file_path, "w", encoding="utf-8") as file:
                file.write(html_content)

            print(f"Saved HTML for subject '{subject}', code {course_code}: {html_file_path}")

        except Exception as e:
            print(f"Error scraping subject '{subject}', code {course_code}: {e}")

except Exception as e:
    print(f"Unexpected error: {e}")

finally:
    # Ensure the driver is closed gracefully
    driver.quit()
    print("WebDriver session ended.")
