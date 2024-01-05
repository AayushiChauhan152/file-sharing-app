import express from "express";
import multer from "multer";
import File from "../models/file.js";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();
import { sendMail } from "../services/emailservice.js";
import { template } from "../services/emailTemplate.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${file.originalname}`
    );
  },
});

const upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  //store file
  upload(req, res, async (err) => {
    //validate request
    if (!req.file) {
      return res.json({ error: "All files are required" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    //store into database
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });

  //response->link
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  //validate data
  if (!uuid || !emailTo || !emailFrom) {
    return res.json({ error: "All fields are required" });
  }

  //get data from database

  const file = await File.findOne({ uuid: uuid });

  if (file.sender) {
    return res.json({ error: "email already sent!!" });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();

  // send email
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "file sharing",
    text: `${emailFrom} shared a file with you.`,
    html: template({
      emailFrom: emailFrom,
      download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });
  console.log(response);
  return res.json({ success: true });
});
export default router;
