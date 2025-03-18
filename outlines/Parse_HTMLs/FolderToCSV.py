import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai
import typing_extensions as typing
import enum
import csv
import json
import time

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
    grade: list[float]
    date: list[str]

class Scheme(typing.TypedDict):
    schemeNum: int
    condition: schemeCondition
    assessments: list[Assessment] # only fill needed number of assessments, else put null

class Role(enum.Enum):
    TA = "ta"
    PROFESSOR = "professor"

class Personnel(typing.TypedDict):
    name: str
    role: Role
    email: str

class Course(typing.TypedDict):
    code: str
    personnel: list[Personnel]
    schemes: list[Scheme]

def parse_course_outline_to_json(api_key, html_file_path):
    # Ensure the file exists
    if not os.path.exists(html_file_path):
        raise FileNotFoundError(f"File not found: {html_file_path}")

    # Prepare the file content
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    input = f"""Parse the HTML course outline into JSON with the following rules:
    0. Assessment count is the number of [x assessment], drop is the number of [x assessment] to drop
    1. Course code format example: "ECE 105"
    2. Symbols should be single characters, unique for each assessment type. condition symbol MUST match the symbol of one of the assessments
    3. Assessment weight is a float (0.3 for 30%), unless it is a function, which should then be expressed as an equation with the one letter symbols representing the marks in other assessments
    4. Leave grade as [-1.0]
    5. Leave date as ["none"]
    6. If email not provided, [string ID]@uwaterloo.ca, eg. a6lian@uwaterloo.ca
    7. If there is only one grading scheme, the bounds should be 0 and 100
    The html is attached: \n
    {html_content}
    """
    
    retries = 0
    max_retries = 12  # Limit the number of retries
    backoff = 1  # Initial wait time in seconds

    while retries < max_retries:
        try:
            # Send the request to Gemini API
            response = model.generate_content(
                input, 
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json", 
                    response_schema=Course
                ),
            )
            
            # Check if the response contains content and return it
            if response and hasattr(response, 'text'):
                return response.text
            else:
                raise Exception("API request failed or did not return expected content.")
        
        except Exception as e:
            # Check if it's a 429 error (rate limit exceeded)
            if "429" in str(e) or "Resource has been exhausted" in str(e):
                print(f"Rate limit hit. Retrying in {backoff} seconds...")
                time.sleep(backoff)
                retries += 1
                backoff *= 2  # Exponential backoff
            else:
                raise  # Re-raise other exceptions

    raise Exception("Max retries exceeded. Could not complete the API call.")


def generate_csv_subject(input_folder, output_csv, api_key):
    with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(["JSON"])
        for file_name in os.listdir(input_folder):
            if file_name.endswith('.html'):
                file_path = os.path.join(input_folder, file_name)
                print("Processing: " + file_path)
                course_json = parse_course_outline_to_json(api_key, file_path)
                csvwriter.writerow([json.dumps(course_json)])  # Write each parsed JSON to the CSV


def generate_json_procedural(input_folder, output_folder, api_key):
    start_processing = False  # Flag to control when to start
    for folder_name in os.listdir(input_folder):
        if folder_name == "OPTOM":
            start_processing = True
        else: 
            print("folder already processed")
        if start_processing == True:
            folder_path = os.path.join(input_folder, folder_name)
            output_json = os.path.join(output_folder, f"{folder_name}.csv")
            print(folder_path)
            generate_csv_subject(folder_path, output_json, api_key)


if __name__ == "__main__":
    # Replace with your actual API key
    api_key = os.getenv('GEMINI_API_KEY')

    if not api_key:
        raise ValueError("API key not found. Make sure GEMINI_API_KEY is set in the .env file.")

    # Path to the HTML file you want to parse
    html_main_folder_path = "outlines\\SimplifiedHTMLFiles"
    output_csv_folder = "outlines\\CSVs"

    try:
        generate_json_procedural(html_main_folder_path, output_csv_folder, api_key)
        # print("Parsed JSON from the course outline:")
    except Exception as e:
        print(f"An error occurred: {e}")
