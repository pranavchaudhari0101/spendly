# Spendly - AI Budget Recommendation System

Spendly is an AI-powered budget recommendation system that uses machine learning to provide personalized budget allocation suggestions based on various factors like month, income type, and payment method.

## Features

- Provides personalized budget recommendations across 9 categories
- Interactive web interface
- Visualizations including pie charts and bar graphs
- Responsive design for all device sizes

## Installation

1. Clone this repository
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

1. Start the Flask application:

```bash
python app.py
```

2. Open your browser and navigate to:

```
http://127.0.0.1:5000
```

3. Enter your details in the form:
   - Month
   - Income Type
   - Payment Method
   - Amount to Spend

4. Click "Get Recommendations" to see your personalized budget allocation

## Technical Details

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Data Visualization**: Chart.js
- **Machine Learning**: scikit-learn (RandomForestRegressor)

## Project Structure

```
spendly/
  ├── app.py               # Flask backend
  ├── index.html           # Frontend HTML
  ├── styles.css           # CSS styles
  ├── app.js               # Frontend JavaScript
  ├── spendly_final_dataset_10_years.csv  # Dataset
  └── requirements.txt     # Python dependencies
```

## Model Information

The application uses a RandomForestRegressor model to predict budget allocations. The model is trained on 10 years of budget data and takes into account:

- Month of the year
- Income type (Salary, Business, Investment Returns, Real Estate Rents)
- Payment method preference (Cash, Card, UPI, Net Banking)
- Total amount to be spent

The model outputs percentage allocations across 9 categories:
- Food
- Vacation
- Transport
- Education
- Rent
- Entertainment
- Investment
- EMI
- Savings 