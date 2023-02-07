const express = require("express");
const multer = require("multer");
const router = express.Router();
const processhandler = require("./processhandler");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media/photos");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.originalname.split(".")[0].toString() +
        "-" +
        uniqueSuffix +
        `.${file.mimetype.split("/")[1].toString()}`
    );
  },
});
const upload = multer({ storage: storage }).array("files");

router.post("/", (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.json({
          ...processhandler?.returnJSONfailure,
          msg: `Error: ${err}`,
        });
      } else if (err) {
        res.json({
          ...processhandler?.returnJSONfailure,
          msg: `Something went wrong: ${err}`,
        });
      }
      let returnArr = req.files.map((i) => {
        return { ...i, path: i?.filename };
      });
      res.json({
        ...processhandler?.returnJSONsuccess,
        returnData: returnArr,
        msg: "Files uploaded successfully!",
      });
    });
  } catch (error) {
    res.json({
      ...processhandler?.returnJSONfailure,
      msg: `Something went wrong: ${error}`,
    });
  }
});

module.exports = router;
