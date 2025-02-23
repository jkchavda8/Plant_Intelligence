from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
import google.generativeai as genai
from flask_cors import CORS  # Import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Upload folder for images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load Hugging Face model
processor = AutoImageProcessor.from_pretrained("ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease")
model = AutoModelForImageClassification.from_pretrained("ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease")

# Configure Google Gemini API Key
gemini_api_key = "AIzaSyBaLboKU6qiAEPcu72_Ib_qY3RBjK5JA6o"  # Replace with your actual API key
if not gemini_api_key:
    raise ValueError("Google Gemini API Key is missing. Please provide a valid API key.")

genai.configure(api_key=gemini_api_key)

# Initialize Gemini Model
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

def get_disease_info(disease_name):
    """Fetch disease information using Google Gemini."""
    prompt = f"""
    You are a plant intelligence system. Provide information only about plant diseases.
    Ignore plant names and focus only on the disease. If the input is not related to plant diseases, reply with:
    'I only provide plant disease information.'
    
    What is {disease_name}, its symptoms, and how to prevent or cure it?
    """
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip() if hasattr(response, 'text') else "No information available."
    except Exception as e:
        return f"Error fetching disease info: {str(e)}"

def predict_disease(image_path):
    """Detect plant disease using the local model."""
    try:
        # Open image
        image = Image.open(image_path).convert("RGB")

        # Preprocess image
        inputs = processor(images=image, return_tensors="pt")

        # Make prediction
        with torch.no_grad():
            outputs = model(**inputs)

        # Get predicted label
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()
        label = model.config.id2label[predicted_class_idx]

        # Extract only disease name (remove plant name)
        disease_name = label.split("___")[-1]  # Assumes format "Plant___Disease"

        return disease_name
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/predict', methods=['POST'])
def predict():
    """Handles image upload and performs plant disease prediction."""
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Securely save uploaded image
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Detect disease using local model
    disease_name = predict_disease(filepath)

    # Get disease info from Google Gemini
    disease_info = get_disease_info(disease_name)

    return jsonify({
        'disease': disease_name,
        'info': disease_info
    })

if __name__ == '__main__':
    app.run(port=5002,debug=True)
