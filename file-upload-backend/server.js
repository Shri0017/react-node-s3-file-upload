require("dotenv").config();
const app = require("express")();
const multer = require("multer");
const upload = multer({ dest: "uploads" });
const fs = require("fs");
const AWS = require("aws-sdk");
const cors = require("cors")();
app.use(cors);

const port = process.env.PORT | 3002;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

app.get("/", (req, res) => {
  res.send(`server is running ${process.env.PORT}`);
});

app.post("/files/upload", upload.array("files", 6), (req, res, next) => {
  try {
    console.log("files are : ", req.files);
    for (var i = 0; i < req.files?.length; i++) {
      console.log("file is ", req.files[i]?.filename);
      const filestream = fs.createReadStream(req.files[i]?.path);
      if (req.files[i]?.originalname.includes(".json")) {
        console.log(
          `${i + 1} file is - `,
          filestream.on("data", async function (chunk) {
            console.log(chunk);
          })
        );
      } else {
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: filestream,
          key: req.files[i]?.filename,
        };
        const result = s3.upload(uploadParams).promise();
        console.log("result ", result);
      }
    }
    res.status(201).json({
      message: "Done file uploaded",
    });
  } catch (error) {
    console.log("error ", error);
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.get("/s3files", (req, res) => {
  var files = [];
  s3.listObjects({ Bucket: process.env.AWS_BUCKET_NAME }, function (err, data) {
    if (err) {
      res.status(500).json({
        message: err.message,
        error: err,
      });
    } else {
      console.log("data containt");
      data.Contents.forEach(function (obj, index) {
        console.log("file path - ", obj.Key);
        files.push(obj.Key);
      });
      res.status(200).json({
        message: "uploaded files",
        files,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on ${port} port`);
});
