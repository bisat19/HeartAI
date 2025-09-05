from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

# Inisialisasi aplikasi Flask
app = Flask(__name__)
CORS(app) # Mengizinkan Cross-Origin Resource Sharing

# Memuat model dan scaler yang sudah dilatih
try:
    svc = joblib.load('svc_model.pkl')
    ss = joblib.load('scaler.pkl')
except Exception as e:
    print(f"Error loading model or scaler: {e}")
    svc = None
    ss = None

# Daftar fitur sesuai urutan saat training
feature_columns = [
    'age', 'gender', 'chest_pain', 'blood_pressure', 'cholesterol', 
    'fasting_sugar', 'ecg_result', 'heart_rate', 'exercise_angina', 
    'st_depression', 'st_slope', 'vessels_count', 'thalassemia_type'
]

# Route untuk halaman utama (form)
@app.route('/')
def home():
    return render_template('index.html')

# Route untuk API prediksi
@app.route('/predict', methods=['POST'])
def predict():
    if not svc or not ss:
        return jsonify({'error': 'Model or scaler not loaded properly'}), 500

    # Mendapatkan data JSON dari request
    data = request.get_json()
    
    # Memastikan semua fitur ada di data
    try:
        input_values = [float(data[col]) for col in feature_columns]
    except KeyError as e:
        return jsonify({'error': f'Missing feature: {e}'}), 400
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid input data type. All features must be numeric.'}), 400

    # Membuat DataFrame dari input
    input_data = pd.DataFrame([input_values], columns=feature_columns)

    # Melakukan scaling pada data input
    scaled_input_data = ss.transform(input_data)

    # Melakukan prediksi probabilitas
    probability = svc.predict_proba(scaled_input_data)[:, 1] # Probabilitas kelas 1 (terkena penyakit)
    prediction = (probability > 0.5).astype(int) # Prediksi berdasarkan probabilitas

    # Menentukan hasil dan saran
    health_percentage = (1 - probability[0]) * 100
    risk_status = ""
    prevention_tips = []

    if prediction[0] == 1:
        risk_status = "High Risk of Heart Disease"
        prevention_tips = [
            {"icon": "🩺", "text": "Consult with a doctor immediately for a detailed check-up."},
            {"icon": "💊", "text": "Adhere strictly to prescribed medications."},
            {"icon": "🥗", "text": "Adopt a low-sodium, low-fat diet like DASH or Mediterranean."},
            {"icon": "🏃‍♂️", "text": "Engage in light, doctor-approved physical activities."},
            {"icon": "🚭", "text": "Stop smoking and avoid alcohol completely."},
            {"icon": "🧘", "text": "Manage stress through meditation or relaxation techniques."}
        ]
    else:
        risk_status = "Low Risk of Heart Disease"
        prevention_tips = [
            {"icon": "🍎", "text": "Maintain a balanced diet rich in fruits, vegetables, and whole grains."},
            {"icon": "🏋️‍♀️", "text": "Exercise regularly for at least 30 minutes, 5 days a week."},
            {"icon": "💤", "text": "Ensure you get 7-8 hours of quality sleep per night."},
            {"icon": "💧", "text": "Stay hydrated by drinking plenty of water throughout the day."},
            {"icon": "📅", "text": "Schedule annual health check-ups to monitor your condition."},
            {"icon": "😊", "text": "Keep stress levels low and maintain a positive outlook."}
        ]

    # Mengembalikan hasil dalam format JSON
    return jsonify({
        'prediction': int(prediction[0]),
        'probability': float(probability[0]),
        'health_percentage': f"{health_percentage:.0f}",
        'risk_status': risk_status,
        'prevention_tips': prevention_tips
    })

# Route untuk menampilkan halaman hasil
@app.route('/result')
def result():
    return render_template('result.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)