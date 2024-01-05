import express from "express";
import File from "../models/file.js";
const router = express.Router();

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download.ejs", { error: "Link has been expired" });
    }
    return res.render("download.ejs", {
      uuid: file.uuid,
      filename: file.filename,
      fileSize: file.size,
      download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (err) {
    return res.render("download.ejs", { error: "something went wrong!!" });
  }
});

export default router;
