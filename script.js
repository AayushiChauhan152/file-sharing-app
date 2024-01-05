import File from "./models/file.js";
import fs from "fs";
import "dotenv/config";
import database from "./database/database.js";

database;

async function fetchData() {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const files = File.find({ createdAt: { $lt: pastDate } });

  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`successfully deleted ${file.filename}`);
      } catch (err) {
        console.log(`error while deleting file ${err} `);
      }
    }
  }
  console.log("Job done!");
}

fetchData().then(process.exit());
