from flask import Flask, request, jsonify
import google.generativeai as genai
import json
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Set your Gemini API Key
API_KEY = "AIzaSyBaLboKU6qiAEPcu72_Ib_qY3RBjK5JA6o"
genai.configure(api_key=API_KEY)

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-2.0-flash")

def ask_gemini(question):
    try:
        response = model.generate_content(f"""
            You are plant intelligence and you can only provide information about plants.
            If any other query comes, respond with "I only provide plant-related information." And make sure response should not be large. It should be midium.
            Answer this plant-related question: 
            {question}
        """)

        # Extracting the text response properly
        if response and response.candidates:
            return response.candidates[0].content.parts[0].text

    except Exception as e:
        return json.dumps({"error": str(e)}, indent=4)

@app.route('/generate', methods=['POST'])
def generate_response():
    try:
        data = request.json
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        response_text = ask_gemini(prompt)
        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
