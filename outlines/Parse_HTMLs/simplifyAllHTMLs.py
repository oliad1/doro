from simplifyHTML import simplify_html
import os


def simplify_html_in_folder(input_folder, output_folder):
    """
    Simplifies all HTML files in a folder and stores them in another folder.

    Args:
        input_folder (str): Path to the input folder containing HTML files.
        output_folder (str): Path to the output folder to save simplified HTML files.
    """
    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Iterate through all files in the input folder
    for file_name in os.listdir(input_folder):
        input_file_path = os.path.join(input_folder, file_name)
        
        # Check if the file is an HTML file
        if os.path.isfile(input_file_path) and file_name.lower().endswith('.html'):
            output_file_path = os.path.join(output_folder, file_name)
            print(f"Simplifying: {input_file_path} -> {output_file_path}")
            
            # Simplify the HTML file
            simplify_html(input_file_path, output_file_path)

main_input_folder = "outlines\\HTML_Files"
main_output_folder = "outlines\\SimplifiedHTMLFiles"

for folder_name in os.listdir(main_input_folder):
    input_folder = os.path.join(main_input_folder, folder_name)  # Replace with the path to your folder containing HTML files
    output_folder = os.path.join(main_output_folder, folder_name)  # Replace with the path to your desired output folder
    simplify_html_in_folder(input_folder, output_folder)