import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";

import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/user", userRoutes);

//ERROR MIDDLEWARE
app.use(errorMiddleware);

export default app;
