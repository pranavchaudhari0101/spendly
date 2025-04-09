from flask import Flask, request, jsonify, render_template, send_from_directory
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

app = Flask(__name__, static_folder='.')

# Define global variables
model = None
categories = ['Food', 'Vacation', 'Transport', 'Education', 'Rent',
              'Entertainment', 'Investment', 'EMI', 'Savings']

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

def load_or_train_model():
    global model
    
    # Check if model file exists
    if os.path.exists('spendly_model.joblib'):
        model = joblib.load('spendly_model.joblib')
    else:
        # Train the model
        print("Training new model...")
        
        # Load data
        df = pd.read_csv("spendly_final_dataset_10_years.csv")
        
        # Prepare input and output
        X = df[['Month', 'Income_Type', 'Payment_Method', 'Amount_to_be_Spent']]
        # Normalize target outputs to percentages
        y_raw = df[categories]
        y = y_raw.div(y_raw.sum(axis=1), axis=0)  # Convert to % share
        
        # Preprocessing
        categorical_cols = ['Month', 'Income_Type', 'Payment_Method']
        
        preprocessor = ColumnTransformer([
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ], remainder='passthrough')
        
        # Train/Test Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Create and train model
        model = Pipeline([
            ('preprocess', preprocessor),
            ('regressor', RandomForestRegressor(n_estimators=200, random_state=42))
        ])
        
        model.fit(X_train, y_train)
        
        # Save the model
        joblib.dump(model, 'spendly_model.joblib')
    
    return model

@app.route('/predict', methods=['POST'])
def predict():
    # Get data from request
    data = request.json
    
    # Create dataframe from input
    user_input = pd.DataFrame([{
        'Month': data['month'],
        'Income_Type': data['income_type'],
        'Payment_Method': data['payment_method'],
        'Amount_to_be_Spent': float(data['amount'])
    }])
    
    # Make prediction
    predicted_percent = model.predict(user_input)[0]
    
    # Fix negative values and normalize to sum = 1
    predicted_percent = np.maximum(predicted_percent, 0)
    predicted_percent /= predicted_percent.sum()
    
    # Convert to amounts
    amount = float(data['amount'])
    predicted_amounts = predicted_percent * amount
    predicted_dict = dict(zip(categories, predicted_amounts.tolist()))
    
    return jsonify(predicted_dict)

if __name__ == '__main__':
    # Load or train model when the app starts
    model = load_or_train_model()
    
    # Run app
    app.run(debug=True) 