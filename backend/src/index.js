// ! packages:-
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { fileURLToPath } from "url";
import { dirname } from "path";

// ! routers:-
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";

// ! db connection:-
import { ConnectDB } from "./lib/db.js";

// ! socket server:-
import { app, server } from "./lib/socket.js";

// ? configure dotenv:
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ? configure express server:
// const app = express(); // * using socket server

// ? port server:-
const port = process.env.PORT;

// ? allow the server to accept json data from the client:-
app.use(express.json());

// ? allow the server to the cookies parse:-
app.use(cookieParser());

// ? allow the server to accept cors requests from the client:-
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ? routers:-
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ? start server:
server.listen(port, () => {
  console.log(`server is running on port ${port}`);

  // ? connect the db:-
  ConnectDB();
});
