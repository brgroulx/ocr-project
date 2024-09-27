from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pytesseract
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@app.route("/", methods=["GET","POST"])
def index():
    return render_template("index.html")

@app.route('/extract-text', methods=['POST'])
def extract_text():
    data = request.json
    img_data = data['image']
    
    img_bytes = base64.b64decode(img_data)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    text = pytesseract.image_to_string(gray_img)

    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True)
