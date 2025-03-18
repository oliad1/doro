import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai
import typing_extensions as typing
import enum

load_dotenv()

# Configure the Gemini model
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel("gemini-1.5-flash")

class AssessmentType(enum.Enum):
    QUIZ = "quiz"
    LAB = "lab"
    TUTORIAL = "tutorial"
    WORKSHOP = "workshop"
    MIDTERM = "midterm"
    FINAL = "final"
    PROJECT = "project"
    ESSAY = "essay"
    PARTICIPATION = "participation"
    ATTENDANCE = "attendance"
    OTHER = "other"

class schemeCondition(typing.TypedDict, total=False):  # Optional fields
    symbol: str
    upperBound: float  # Simplify into a single tuple
    lowerBound: float

class Assessment(typing.TypedDict):
    name: str
    assessmentType: str
    count: int
    drop: int
    symbol: str # one letter please
    weight: str

class Scheme(typing.TypedDict):
    schemeNum: int
    condition: schemeCondition
    assessments: list[Assessment] # only fill needed number of assessments, else put null

class Course(typing.TypedDict):
    code: str
    schemes: list[Scheme]


def parse_course_outline_to_json(api_key, html_file_path):

    # Ensure the file exists
    if not os.path.exists(html_file_path):
        raise FileNotFoundError(f"File not found: {html_file_path}")

    # Prepare the file content
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    input = f"""Parse the HTML course outline into JSON with the following rules:
    0. Course code format example: "ECE 105"
    1. Use a single grading scheme if there are no conditional rules.
    2. Symbols should be single characters, unique for each assessment type.
    3. Assessment weight is a float (0.3 for 30%), unless it is a function, which should then be expressed as an equation with the one letter symbols representing the marks in other assessments
    The html is attached: \n
    {html_content}
    """
    # Send the request to Gemini API
    response = model.generate_content(input, generation_config=genai.GenerationConfig(
        response_mime_type="application/json", response_schema=Course),)

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

    # Path to the HTML file you want to parse
    html_file_path = "outlines\\Parse_HTMLs\\simplified_ECE_page.html"

    try:
        parsed_json = parse_course_outline_to_json(api_key, html_file_path)
        # print("Parsed JSON from the course outline:")
        print(parsed_json)
    except Exception as e:
        print(f"An error occurred: {e}")
