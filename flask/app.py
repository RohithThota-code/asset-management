from flask import Flask, request, jsonify,send_file
from prophet import Prophet
import pandas as pd
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
@app.route('/forecast.json')
def get_forecast_file():
    return send_file('forecast.json')


@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        asset_name = request.json.get('assetName')
        filepath = f'data/{asset_name}.json'

        if not os.path.exists(filepath):
            return jsonify({'error': 'Asset data not found'}), 404

        # Load and prepare data
        df = pd.read_json(filepath)
        df = df.rename(columns={"date": "ds", "quantity": "y"})
        df["ds"] = pd.to_datetime(df["ds"]).dt.tz_localize(None)

        if df["y"].dropna().shape[0] < 2:
            return jsonify({"error": "Not enough data to forecast"}), 400

        # Fit model
        model = Prophet()
        model.fit(df)

        # Forecast 1 year into future
        future = model.make_future_dataframe(periods=365)
        forecast = model.predict(future)

        # Save full forecast for frontend visualization
        forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_json('forecast.json', orient='records')

        # Return 6M and 1Y values
        forecast_result = forecast[['ds', 'yhat']].tail(365)
        forecast_6mo = forecast_result.iloc[180]
        forecast_12mo = forecast_result.iloc[-1]

        return jsonify({
            'assetName': asset_name,
            'forecast_6_months': {
                'date': forecast_6mo['ds'].strftime('%Y-%m-%d'),
                'predicted_quantity': round(forecast_6mo['yhat'], 2)
            },
            'forecast_1_year': {
                'date': forecast_12mo['ds'].strftime('%Y-%m-%d'),
                'predicted_quantity': round(forecast_12mo['yhat'], 2)
            }
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5001)
