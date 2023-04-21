const axios = require("axios");
const hasha = require("hasha");
const { getColor } = require("colorthief");
const ntc = require("./lib/ntc");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { Octokit } = require("@octokit/rest");
const { parse, unparse } = require("papaparse");

require("dotenv").config();

const UPLOAD_LIMIT = 2 * 1024 * 1024; // 2MB

const applicationKeyId = process.env.B2_APP_ID;
const applicationKey = process.env.B2_APP_KEY;
const bucketId = process.env.B2_BUCKET_ID;

const imageColumn = "image";
const colorColumn = "color";

async function uploadFile(imageUrl) {
  const fileBuffer = await axios.get(imageUrl, { responseType: "arraybuffer" });
  if (fileBuffer.status !== 200) {
    return imageUrl;
  }

  const contentLength = Number(fileBuffer.headers["content-length"]);
  if (contentLength > 2 * 1024 * 1024) {
    return imageUrl;
  }

  const authObj = await axios.get(
    `https://api.backblazeb2.com/b2api/v2/b2_authorize_account`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${applicationKeyId}:${applicationKey}`,
        ).toString("base64")}`,
      },
    },
  );

  if (authObj.status !== 200) {
    return imageUrl;
  }

  const uploadUrlObj = await axios.post(
    `${authObj["data"]["apiUrl"]}/b2api/v2/b2_get_upload_url`,
    { bucketId },
    {
      headers: {
        Authorization: authObj["data"]["authorizationToken"],
      },
    },
  );

  if (uploadUrlObj.status !== 200) {
    return imageUrl;
  }

  await sharp(fileBuffer.data).toFile(path.join(__dirname, "/tmp.webp"));
  const fileHash = await hasha.fromFile(path.join(__dirname, "/tmp.webp"), {
    algorithm: "sha1",
  });
  const b64EncodedFileName =
    encodeURI(
      Buffer.from(imageUrl.split("/").slice(-1)[0]).toString("base64"),
    ) + ".webp";
  const uploadedObj = await axios({
    url: uploadUrlObj["data"]["uploadUrl"],
    method: "POST",
    data: fs.readFileSync(path.join(__dirname, "/tmp.webp")),
    headers: {
      Authorization: uploadUrlObj["data"]["authorizationToken"],
      "X-Bz-File-Name": b64EncodedFileName,
      "Content-Type": "b2/x-auto",
      "X-Bz-Content-Sha1": fileHash,
    },
  });

  if (uploadedObj.status !== 200) {
    return imageUrl;
  }

  return `${authObj["data"]["downloadUrl"]}/file/brandbuzza/${b64EncodedFileName}`;
}

async function checkAndUploadImages() {
  const csvFile = "data/brands.csv";
  const csvData = await fs.readFileSync(csvFile, "utf-8");
  const rows = parse(csvData, { header: true, skipEmptyLines: true }).data;

  console.log(rows)

  for (const row of rows) {
    const imageUrl = row[imageColumn];
    if (imageUrl.startsWith("https://f000.backblazeb2.com/file/brandbuzza/")) {
      continue;
    }

    try {
      const response = await axios.head(imageUrl);
      if (!response.status === 200) {
        continue;
      }
    } catch (err) {
      console.error(err);
      continue;
    }

    const uploadedUrl = await uploadFile(imageUrl);
    if (uploadedUrl) {
      row[imageColumn] = uploadedUrl;
    }
  }

  const csvString = unparse(rows);
  fs.writeFileSync(csvFile, csvString);
  fs.appendFileSync(csvFile, "\r\n", "utf8");
}

checkAndUploadImages();
