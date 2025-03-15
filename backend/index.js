const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const claimRoute = require("./routes/claimRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://couponapp.onrender.com", credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// API Routes
app.use("/api/coupons", claimRoute);
app.use("/api/admin", adminRoute);

// ✅ Serve Frontend (React Build)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 10000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("DB Connection Failed", err));
