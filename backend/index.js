import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import connectToDb from "./db.js";

// environment variable configuration
dotenv.config();

// Load environment variables from .env file
const port = process.env.PORT || 3000;
const client_url = process.env.CLIENT_URL;

// create express server instance
const app = express();

// cors allowed options
const corsOptions = {
  origin: client_url,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //creating window of 15min
  max: 100, //limit req per IP 100 req/window
});

//Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

//global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

//Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Hello Server boilerPlate code with connection to mongo db and header security, api hitting rate limit!",
  });
});

//start Server and connect to server
const startServer = async () => {
  try {
    // Connect to database
    await connectToDb();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    console.error(error.stack);
    process.exit(1); // Exit process with failure
  }
};

// Initialize server
startServer();
