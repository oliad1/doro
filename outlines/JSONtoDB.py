import json
import csv
import os

def json_to_csv_row(course_json: dict) -> list:
    """
    Converts a Course JSON object into a CSV row based on the specified format.

    Args:
        course_json (dict): JSON object matching the Course class.

    Returns:
        list: A list representing a single row for the CSV file.
    """
    code = course_json.get("code", "")

    # Convert personnel and schemes into JSON strings
    personnel_json = json.dumps(course_json.get("personnel", []))
    schemes_json = json.dumps(course_json.get("schemes", []))

    # Create a row with the necessary columns
    row = [
        code,
        personnel_json,
        schemes_json
    ]
    return row

def combine_csvs_in_folder(input_folder: str, output_csv: str):
    """
    Iterates through every CSV in a folder, applies the unpacking process, and stacks the results into one CSV.

    Args:
        input_folder (str): Path to the folder containing the input CSV files.
        output_csv (str): Path to the output CSV file.
    """
    combined_rows = []

    for file_name in os.listdir(input_folder):
        if file_name.endswith(".csv"):
            input_csv_path = os.path.join(input_folder, file_name)
            with open(input_csv_path, "r", newline="") as infile:
                reader = csv.reader(infile)
                header_skipped = False
                for row in reader:
                    # Skip the header row or invalid rows
                    if not header_skipped:
                        header_skipped = True
                        continue
                    if not row or not row[0].strip().startswith("\""):
                        continue
                    try:
                        # Parse the double-encoded JSON string
                        outer_json = json.loads(row[0].strip())  # First layer of decoding
                        course_json = json.loads(outer_json)    # Second layer of decoding
                        csv_row = json_to_csv_row(course_json)
                        combined_rows.append(csv_row)
                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON in file {file_name}, row: {row}. Error: {e}")
                    except AttributeError as e:
                        print(f"Invalid JSON structure in file {file_name}, row: {row}. Error: {e}")

    # Write all combined rows to the output CSV
    with open(output_csv, "w", newline="") as outfile:
        writer = csv.writer(outfile)
        writer.writerow(["Code", "Personnel", "Schemes"])
        writer.writerows(combined_rows)


# Example usage
if __name__ == "__main__":
    input_folder_path = "outlines\\CSVs"  # Replace with your folder path containing input CSVs
    output_csv_path = "outlines\\combined_output.csv"  # Replace with your desired output CSV file

    combine_csvs_in_folder(input_folder_path, output_csv_path)
    print("All CSVs combined and unpacked successfully.")
