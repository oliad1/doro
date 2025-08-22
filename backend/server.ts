import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const CORS_ALLOW_LIST = [
  "http://localhost:3000",
  "https://doro-study-git-main-oliad-rs-projects.vercel.app",
  "http://ec2-18-222-29-243.us-east-2.compute.amazonaws.com",
  "https://www.doro.study",
];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

const app = express();
app.use(cors(CORS_OPTIONS));
app.use(express.json());

import outlinesRouter from "./controllers/outlinesController";
import enrollmentsRouter from "./controllers/enrollmentsController";
import gradesRouter from "./controllers/gradesController";

app.use("/outlines", outlinesRouter);
app.use("/enrollments", enrollmentsRouter);
app.use("/grades", gradesRouter);

app.listen({ port: process.env.PORT || 8080 }, () => {
  console.info(`Server is listening on port ${process.env.PORT || 8080}`);
});
