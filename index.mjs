import express from "express";
import http from "http";
import cors from "cors";
import adminRoute from "./routes/adminRoute.mjs";
import logisticRoute from "./routes/logisticRoute.mjs";
import mailRoute from "./routes/mailRoute.mjs";
import connectDB from "./config/database.mjs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const httpServer = http.Server(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://caboluxurytransportationandshipping.com",
  "https://admin.caboluxurytransportationandshipping.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

connectDB();

app.use("/api/logistics/", logisticRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/mail/", mailRoute);

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "API was not found",
  });
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log("Server running on Port: " + PORT);
});
