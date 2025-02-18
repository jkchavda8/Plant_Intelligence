from flask import Flask, request, jsonify
import google.generativeai as genai
import json

app = Flask(__name__)

# Set your Gemini API Key
API_KEY = "AIzaSyBaLboKU6qiAEPcu72_Ib_qY3RBjK5JA6o"
genai.configure(api_key=API_KEY)

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-2.0-flash")

def ask_gemini(question):
    try:
        response = model.generate_content(f"""
                                          You are plant intelligence and you can only provide information about  plant.
                                          if any another query comes then don't respond it.
                                          Answer this plant-related question: 
                                          {question}
                                          """)
        return response
    except Exception as e:
        return json.dumps({"error": str(e)}, indent=4)


@app.route('/generate', methods=['POST'])
def generate_response():
    try:
        data = request.json
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        response = ask_gemini(prompt)
        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
