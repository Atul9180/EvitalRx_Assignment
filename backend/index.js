import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToDb from "./db.js";
import authRoutes from "./routes/auth.route.js";
import path from "path";

// environment variable configuration
dotenv.config();

// Load environment variables from .env file
const port = process.env.PORT || 3000;
const client_url = process.env.CLIENT_URL;

// create express server instance
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //creating window of 15min
  max: 100, //limit req per IP 100 req/window
});

//Middlewares
app.use(helmet());
app.use(cors({ origin: client_url, credentials: true }));
app.use(cookieParser()); //allow parsing of incoming cookie
app.use(limiter);
app.use(express.json()); //allows to parse incoming requests: req.body
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
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message:
//       "Hello Server boilerPlate code with connection to mongo db and header security, api hitting rate limit!",
//   });
// });

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

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
