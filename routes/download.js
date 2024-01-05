import express from "express";
import File from "../models/file.js";

const router = express.Router();

router.get("/:uuid", async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.render("download.ejs", { error: "Link has been expired" });
  }
  const filepath = `./${file.path}`;
  res.download(filepath);
});

export default router;
