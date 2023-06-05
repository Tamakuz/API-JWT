import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import http from "http";
import config from "./src/configs/index.js";
import routes from "./src/routes/index.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      /http:\/\/localhost:\d+/,
      /http:\/\/127\.0\.0\.1:\d+/,
      "http://localhost",
      "http://127.0.0.1",
      "https://tamakuz.github.io",
      "127.0.0.1:8080",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);
app.use("/", (req, res) => {
  res.send("Welcome");
});

const port = 5000;

const server = http.createServer(app);

mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log({ error });
    process.exit(1);
  });

server.listen(port, () => {
  console.log("Server run on port " + port);
});
