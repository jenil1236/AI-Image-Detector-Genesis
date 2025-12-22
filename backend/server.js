require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

/* =======================
   Global Middlewares
======================= */

// CORS
app.use(
  cors({
    origin: "*", // restrict later in prod
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON body parser
app.use(express.json());

/* =======================
   Health Check
======================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "AI Image Detector API is running 🚀",
  });
});

/* =======================
   Routes (plug-in)
======================= */

// Teammate will add:
// const analyzeRoutes = require("./routes/analyze.routes");
// app.use("/api/analyze", analyzeRoutes);

// Optional
// const authRoutes = require("./routes/auth.routes");
// app.use("/api/auth", authRoutes);

/* =======================
   404 Handler
======================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =======================
   Global Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* =======================
   Server Start
======================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
