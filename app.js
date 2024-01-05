import "dotenv/config";
import express from "express";
import database from "./database/database.js";
import route from "./routes/file.js";
import route1 from "./routes/showfile.js";
import route2 from "./routes/download.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000 || process.env.PORT;
database;

const corsOption = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:8000",
  ],
};
app.use(cors(corsOption));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());

app.use("/api/files", route);
app.use("/files", route1);
app.use("/files/download", route2);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
