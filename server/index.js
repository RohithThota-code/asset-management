const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const warehouseRoutes = require("./routes/warehouseRoutes");

// ✅ Set CORS BEFORE any routes
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173', // Your frontend URL
}));

// ✅ Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ✅ Connect to DB
if (!process.env.MONGO_URL) {
  console.error('MONGO_URL is not set in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database is connected'))
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// ✅ Define routes
app.use('/', require('./routes/authRoutes'));
app.use('/api/warehouses', warehouseRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
