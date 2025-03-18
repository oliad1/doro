import os
import pandas as pd

def process_csv_files(directory):
    """
    Processes all CSV files in the given directory and extracts 'subject' and 'number' columns.

    Args:
        directory (str): Path to the directory containing CSV files.

    Returns:
        list: A 2D list where each sublist contains [subject, number1, number2, ...].
    """
    result = []
    for filename in os.listdir(directory):
        if filename.endswith(".csv"):
            file_path = os.path.join(directory, filename)
            try:
                df = pd.read_csv(file_path)
                if df.empty or "subject" not in df.columns or "number" not in df.columns:
                    continue
                subject = df["subject"].iloc[0]
                numbers = df["number"].tolist()
                result.append([subject] + numbers)
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    return result

