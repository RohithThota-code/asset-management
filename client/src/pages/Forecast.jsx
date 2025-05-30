import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Forecast = () => {
  const { assetId } = useParams();
  const [forecast, setForecast] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchForecast();
  }, [assetId]);

  const fetchForecast = async () => {
    try {
      const res = await axios.post(`/api/warehouses/${assetId}/forecast`);
      console.log("✅ Forecast response:", res.data);
      setForecast(res.data);

      
      const fullData = await axios.get("http://localhost:5001/forecast.json", {
        withCredentials: true
      });      
      console.log("Chart data:", fullData.data);
      setChartData(fullData.data);
    } catch (err) {
      console.error("Error fetching forecast:", err);
      if (err.response?.data?.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg("Could not fetch forecast. Try again later.");
      }
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📈 Demand Forecast</h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : forecast ? (
        <>
          <div className="mb-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{forecast.assetName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="bg-blue-100 p-4 rounded-md">
                <h3 className="font-bold text-lg">6 Months Forecast</h3>
                <p>Date: {forecast.forecast_6_months.date}</p>
                <p>Predicted Quantity: {forecast.forecast_6_months.predicted_quantity}</p>
              </div>

              <div className="bg-green-100 p-4 rounded-md">
                <h3 className="font-bold text-lg">1 Year Forecast</h3>
                <p>Date: {forecast.forecast_1_year.date}</p>
                <p>Predicted Quantity: {forecast.forecast_1_year.predicted_quantity}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              Forecast Trend (with Confidence Interval)
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorYhat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ds" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="yhat"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorYhat)"
                  name="Predicted Demand"
                />
                <Area
                  type="monotone"
                  dataKey="yhat_lower"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                  name="Lower Bound"
                />
                <Area
                  type="monotone"
                  dataKey="yhat_upper"
                  stroke="#f87171"
                  fill="#f87171"
                  fillOpacity={0.1}
                  name="Upper Bound"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>No forecast data available.</p>
      )}
    </div>
  );
};

export default Forecast;
