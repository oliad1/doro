import os

def quit_chrome_instances():
    try:
        # Command to kill all Chrome processes
        os.system("taskkill /im chrome.exe /f")
        print("All Google Chrome instances have been terminated.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Call the function
quit_chrome_instances()