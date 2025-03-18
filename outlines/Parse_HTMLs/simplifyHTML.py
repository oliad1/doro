from bs4 import BeautifulSoup, Comment

def simplify_html(input_html_path, output_html_path):
    """
    Simplifies an HTML file by removing style, script, and unnecessary formatting.

    Args:
        input_html_path (str): Path to the input HTML file.
        output_html_path (str): Path to save the simplified HTML file.
    """
    with open(input_html_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Remove style and script tags
    for tag in soup(['style', 'script']):
        tag.decompose()

    # Remove class and id attributes to strip formatting
    for attr in ['class', 'id', 'style']:
        for tag in soup.find_all(attrs={attr: True}):
            del tag[attr]

    # Remove comments
    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()

    # Write the simplified HTML to the output file
    with open(output_html_path, 'w', encoding='utf-8') as file:
        file.write(str(soup))

# Example usage
# input_html = 'outlines\\Parse_HTMLs\\ECE_page1_4.html'  # Replace with your input HTML path
# output_html = 'outlines\\Parse_HTMLs\\simplified_ECE_page.html'  # Replace with your desired output path
# simplify_html(input_html, output_html)
