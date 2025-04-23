const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const warehouseRoutes = require("./routes/warehouseRoutes");
const adminRoutes = require('./routes/adminRoutes');

app.use(cors({
  
  origin: 'http://localhost:5173',
  credentials: true, 
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use('/api/admin', adminRoutes);

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


app.use('/', require('./routes/authRoutes'));
app.use('/api/warehouses', warehouseRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
