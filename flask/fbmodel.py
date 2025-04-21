import pandas as pd
from prophet import Prophet

df = pd.read_json('asset_demand_data.json')
df.rename(columns={'date': 'ds', 'quantityChange': 'y'}, inplace=True)

model = Prophet()
model.fit(df)

future = model.make_future_dataframe(periods=365)
forecast = model.predict(future)

forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_json('forecast.json', orient='records')
