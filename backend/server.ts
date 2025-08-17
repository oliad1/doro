import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const CORS_ALLOW_LIST = [
  "http://localhost:3000"  
];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

const app = express();
app.use(cors(CORS_OPTIONS));
app.use(express.json());

import outlinesRouter from "./controllers/outlinesController";

app.use("/outlines", outlinesRouter);

app.listen({ port: process.env.PORT || 5000 }, () => {
  console.info(`Server is listening on port ${process.env.PORT || 5000}`);
});
