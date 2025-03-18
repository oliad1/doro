# need to parse htmls for the schedule, if course wasnt found, no column should be created
# course format: 
# 
# Subject+Code, Subject, Code, Section, Class Type, Class Number, Enroll Limit, Enroll Number, Waitlist Limit, Waitlist Number, Time-start, Time-end, M Bool, T Bool, W Bool, Th Bool, F Bool
# eg.
# ECE106, ECE, 106, 001, LEC, 4824, 144, 140, 0, 0, 3:30PM, 4:20PM, False, False, False, True, False

import os
import csv
from bs4 import BeautifulSoup

# Function to parse a single HTML file and extract data
def parse_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Check for "no matches"
    if soup.find('b', string="Sorry, but your query had no matches."):
        print("skipped, no matches")
        return []

    # Locate the main section and extract the text after "Your selection was:"
    main_section = soup.find('main')
    if not main_section:
        print(f"Main section not found in {file_path}")
        return []  # Skip if the main section is missing

    main_text = main_section.get_text(separator=' ', strip=True)
    if "Your selection was:" not in main_text:
        print(f"'Your selection was:' not found in main section of {file_path}")
        return []  # Skip if the phrase is missing

    try:
        selection_text = main_text.split("Your selection was:")[1]
        subject = selection_text.split(', ')[2].split(': ')[1].strip()
        course_code = selection_text.split(', ')[3].split(': ')[1].split('S')[0].strip()
    except IndexError:
        print(f"Parsing failed for subject/course in {file_path}")
        return []  # Skip if parsing fails

    print(subject + course_code)
    rows = []
    table = soup.find('table', border="2")
    if table:
        classes = table.find_all('tr')[3:]  # Skip headers
        for cls in classes:
            cols = cls.find_all('td')
            if len(cols) < 12:
                continue  # Skip rows without enough columns

            # Parse data
            class_number = cols[0].text.strip()
            comp_sec = cols[1].text.strip().split()
            if len(comp_sec) < 2:
                continue
            class_type = comp_sec[0]
            section = comp_sec[1]
            online = cols[2].text.strip()

            # Filter out Problematic courses (no time or date, since online)
            if (online == "ONLN  ONLINE" and (class_type == "LEC" or class_type == "SEM")):
                continue
            if (online == "REN   R" or online == "BLNDR ONLINE" or online == "ONLNR ONLINE"):
                continue

            enroll_limit = cols[6].text.strip()
            enroll_number = cols[7].text.strip()
            waitlist_limit = cols[8].text.strip()
            waitlist_number = cols[9].text.strip()

            # Parse data
            time_days_date = cols[10].text.strip()
            # Ensure there's a valid time and days string
            if "-" not in time_days_date:
                continue
            
            # print(f"time_days_date: {time_days_date}")
            # time_days_split = time_days_date.split("<br>")
            # print(f"time_days_split: {time_days_split}")
            # tdlen = len(time_days_split)
            # print(f"len: {tdlen}")
            # continue
            days_range = 0
            for char in time_days_date:
                if (char.isalpha()):
                    days_range += 1
            time_range, days = time_days_date[:11], time_days_date[11:days_range+11]
            # print("ECE" + course_code + " " + class_number + " " + class_type + section)
            # print(f"tdd: {time_days_date}")
            # print(f"tr: {time_range}")
            # print(f"days: {days}")
            # continue

            if len(time_range.split('-')) != 2:
                print(f"Unexpected time format in file: {file_path}")
                continue

            time_start, time_end = time_range.split('-')
            time_start = format_time(time_start)
            time_end = format_time(time_end)
            days = parse_days(days)

            rows.append([
                f"{subject}{course_code}", subject, course_code, section, class_type, class_number,
                enroll_limit, enroll_number, waitlist_limit, waitlist_number, time_start, time_end,
                days.get("M", False), days.get("T", False), days.get("W", False), days.get("Th", False), days.get("F", False)
            ])

    return rows

# Function to format time into AM/PM
def format_time(time_str):
    hour, minute = map(int, time_str.split(':'))
    period = time_str[-2:].upper()
    if period == "AM" or (period == "PM" and hour == 12):
        return f"{hour}:{minute:02}AM"
    elif period == "PM" or hour < 8:
        return f"{hour}:{minute:02}PM"
    else:
        return f"{hour}:{minute:02}AM"

# Function to parse days
def parse_days(days_str):
    days = {"M": False, "T": False, "W": False, "Th": False, "F": False}
    for day in ["M", "T", "W", "Th", "F"]:
        days[day] = day in days_str
    return days

# Main function to iterate over folder and generate CSV
def generate_csv(input_folder, output_csv):
    rows = []
    for folder_name in os.listdir(input_folder):
        folder_path = os.path.join(input_folder, folder_name)
        print(folder_path)
        for file_name in os.listdir(folder_path):
            if file_name.endswith('.html'):
                file_path = os.path.join(folder_path, file_name)
                rows.extend(parse_html(file_path))
    
    # Write to CSV
    with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow([
            "CourseCode", "Subject", "Code", "Section", "Class Type", "Class Number",
            "Enroll Limit", "Enroll Number", "Waitlist Limit", "Waitlist Number",
            "Time-start", "Time-end", "M Bool", "T Bool", "W Bool", "Th Bool", "F Bool"
        ])
        csvwriter.writerows(rows)

# Run the script
input_folder = "schedules\\HTML_Schedules"  # Replace with your folder path
output_csv = "schedules\\schedules.csv"  # Replace with your desired output file name
generate_csv(input_folder, output_csv)
