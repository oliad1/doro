import pandas as pd

# Load the CSV file
file_path = "outlines\combined_output.csv"  # Replace with the path to your CSV file
df = pd.read_csv(file_path)

# Ensure no changes that would merge distinct strings
df[df.columns[0]] = df[df.columns[0]].astype(str)

# Find duplicate groups
duplicate_groups = df[df.duplicated(subset=df.columns[0], keep=False)]

# Process each group and compare columns 1 and 2
def process_group(group):
    indices = group.index.tolist()
    shared_value = group.iloc[0, 0]  # The shared value from the first column
    # Check if columns 1 and 2 are identical across the group
    comparison_result = group.iloc[:, 1].nunique() == 1 and group.iloc[:, 2].nunique() == 1
    return [shared_value] + indices + [comparison_result]

# Group by the first column and process each group
grouped_results = (
    duplicate_groups.groupby(df.columns[0])
    .apply(process_group)
    .tolist()
)

# Print the results
print("Shared values, indices, and comparison result:")
for group in grouped_results:
    print(group)