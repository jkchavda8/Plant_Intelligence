import os
import requests
from flask import Flask, request, jsonify
import google.generativeai as genai
import json

app = Flask(__name__)

# ✅ API Keys
PLANTNET_API_KEY = "2b10Okq5nYPVEPb1A3e0Wi89u"
GEMINI_API_KEY = "AIzaSyBaLboKU6qiAEPcu72_Ib_qY3RBjK5JA6o"

# ✅ Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

def identify_plant(image_urls):
    """Send image URL(s) to PlantNet API for identification."""
    url = "https://my-api.plantnet.org/v2/identify/all"
    
    if not isinstance(image_urls, list):
        image_urls = [image_urls]

    params = {
        "images": image_urls,
        "include-related-images": "false",
        "no-reject": "false",
        "nb-results": "3",
        "lang": "en",
        "api-key": PLANTNET_API_KEY,
    }

    try:
        response = requests.get(url, params=params)
        response_data = response.json()

        if "results" not in response_data or not response_data["results"]:
            return {"error": "No plant identified. Try another image."}

        best_match = response_data["results"][0]
        scientific_name = best_match["species"]["scientificNameWithoutAuthor"]
        confidence = round(best_match["score"] * 100, 2)

        return {"scientific_name": scientific_name, "confidence": confidence}
    
    except requests.exceptions.RequestException as e:
        return {"error": f"API Request Error: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected Error: {str(e)}"}

def ask_gemini(scientific_name):
    """Ask Gemini for the common name and detailed plant information."""
    try:
        prompt = f"""
        You are a plant expert. Provide the common English name and detailed information for the plant with the scientific name: {scientific_name}.
        Format the response as valid JSON:
        {{
            "common_name": "Common Name",
            "details": "Detailed plant information"
        }}
        """
        response = model.generate_content(prompt)

        response_text = response.text.strip()

        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        gemini_data = json.loads(response_text)
        
        return gemini_data
    except json.JSONDecodeError:
        return {"error": "Failed to parse Gemini response as JSON."}
    except Exception as e:
        return {"error": f"Error: {str(e)}"}

@app.route("/predict", methods=["GET"])
def predict():
    """Identify the plant from the provided image URL and fetch its common name and details from Gemini."""
    image_url = request.args.get("image_url")
    
    if not image_url:
        return jsonify({"error": "Please provide an image URL as a query parameter."})
    
    result = identify_plant([image_url])
    
    if "error" in result:
        return jsonify(result)

    gemini_info = ask_gemini(result["scientific_name"])
    
    return jsonify({
        "scientific_name": result["scientific_name"],
        "confidence": result["confidence"],
        "gemini_info": gemini_info
    })

if __name__ == "__main__":
    app.run(debug=True)
