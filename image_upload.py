import base64
import requests
import sys

# Get file path and name from command line arguments
file_path = sys.argv[1]
file_name = file_path.split('/')[-1]

# Encode file contents to base64
file_encoded = None
with open(file_path, "rb") as image_file:
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')

# Prepare JSON data and headers for POST request
r_json = {
    'name': file_name,
    'type': 'image',
    'isPublic': True,
    'data': file_encoded,
    'parentId': sys.argv[3]
}
r_headers = {
    'X-Token': sys.argv[2]
}

# Send POST request to the specified URL
r = requests.post("http://0.0.0.0:5000/files", json=r_json, headers=r_headers)

# Print the JSON response from the server
print(r.json())
