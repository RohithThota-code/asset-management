import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import _ from "lodash";

const History = () => {
  const { warehouseId } = useParams();
  const [graphData, setGraphData] = useState([]);
  const [assetNames, setAssetNames] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`/api/warehouses/${warehouseId}/asset-history`);
      const rawData = res.data;
  
      const uniqueAssets = _.uniq(rawData.map((item) => item.assetName));
  
      const groupedByDate = _.groupBy(rawData, (item) =>
        moment(item.date).format("YYYY-MM-DD")
      );
  
      const formattedData = Object.entries(groupedByDate).map(([date, entries]) => {
        const entry = { date };
  
        uniqueAssets.forEach(asset => {
          entry[asset] = null;
        });
  
        entries.forEach(({ assetName, quantity }) => {
          entry[assetName] = quantity;
        });
  
        return entry;
      });
  
      const sortedData = formattedData.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
  
      setAssetNames(uniqueAssets);
      setGraphData(sortedData);
  
      console.log("Sorted Data for Debug:", sortedData); // DEBUG
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };
  
  
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Inventory Change History</h2>
      {graphData.length === 0 ? (
        <p className="text-white">No history data found.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData}>
          <XAxis
        dataKey="date"
        tickFormatter={(date) => moment(date).format("MMM D")}
        stroke="#ccc"
        />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Legend />
        {assetNames.map((asset, index) => (
          <Line
       key={asset}
       type="monotone"
       dataKey={asset}
        stroke={`hsl(${index * 60}, 70%, 60%)`}
       dot={true}
        connectNulls={true}
        />
        ))}
       </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default History;

