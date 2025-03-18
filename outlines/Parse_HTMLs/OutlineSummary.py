import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel("gemini-1.5-flash")

def summarize_course_outline(api_key, html_file_path):
    """
    Sends an HTML file to the Google Gemini API for summarization.

    Args:
        api_key (str): Your API key for Google Gemini.
        html_file_path (str): Path to the HTML file to summarize.

    Returns:
        str: The summary of the site provided by the API.
    """
    # Ensure the file exists
    if not os.path.exists(html_file_path):
        raise FileNotFoundError(f"File not found: {html_file_path}")

    # Prepare the file and headers
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    input = "Provide a short explanation of the grading scheme, and list all the professors: \n" + html_content
    response = model.generate_content(input)

    # Check if the response contains content and return it
    if response and hasattr(response, 'text'):
        return response.text
    else:
        raise Exception("API request failed or did not return expected content.")

if __name__ == "__main__":
    # Replace with your actual API key
    api_key = os.getenv('GEMINI_API_KEY')

    if not api_key:
        raise ValueError("API key not found. Make sure GEMINI_API_KEY is set in the .env file.")

    # Path to the HTML file you want to summarize
    html_file_path = "outlines\\Parse_HTMLs\\MATH_page1_22.html"


    try:
        summary = summarize_course_outline(api_key, html_file_path)
        print("Summary of the course outline:")
        print(summary)
    except Exception as e:
        print(f"An error occurred: {e}")