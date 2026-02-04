import express from "express";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import todoRouter from "./routes/todo.routes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/todos", todoRouter);

app.get("/", (req, res) => {
  res.send(`<h1>This is Express App </h1>`);
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`app is listening on http://localhost:${PORT}`);
  });
};

startServer();
