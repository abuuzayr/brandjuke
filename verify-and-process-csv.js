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

  // Get dominant color
  await sharp(fileBuffer).toFile(path.join(__dirname, "/tmp.png"));
  const color = await getColor(path.join(__dirname, "/tmp.png"));
  const rgb = `#${color[0].toString(16).padStart(2, "0")}${color[1]
    .toString(16)
    .padStart(2, "0")}${color[2].toString(16).padStart(2, "0")}`;
  const baseColorName = `${ntc.name(rgb)[3]}`.toLowerCase();

  return {
    url: `${authObj["data"]["downloadUrl"]}/file/brandbuzza/${b64EncodedFileName}`,
    color: baseColorName
  };
}

async function checkAndUploadImages() {
  const csvFile = "data/brands.csv";
  const csvData = fs.readFileSync(csvFile, "utf-8");
  const rows = parse(csvData, { header: true, skipEmptyLines: true }).data;

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

    const { url: uploadedUrl, color } = await uploadFile(imageUrl);
    if (uploadedUrl) {
      row[imageColumn] = uploadedUrl;
    }
    row[colorColumn] = color;
  }

  const csvString = unparse(rows);
  fs.writeFileSync(csvFile, csvString);
  fs.appendFileSync(csvFile, "\r\n", "utf8");

  const client = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  const commits = await client.repos.listCommits({
    // TODO: Change to brandbuzza-bot or something
    owner: process.env.GITHUB_ACTOR,
    repo: "brandbuzza",
  });
  const commitSHA = commits.data[0].sha;

  const {
    data: { sha: currentTreeSHA },
  } = await client.git.createTree({
    owner: process.env.GITHUB_ACTOR,
    repo: "brandbuzza",
    tree: [
      {
        path: "data/brands.csv",
        mode: "100644",
        type: "commit",
        content: fs.readFileSync(csvFile, "utf-8"),
      },
    ],
    base_tree: commitSHA,
    message: `Update brands.csv by Github Action`,
    parents: [commitSHA],
  });

  const {
    data: { sha: newCommitSHA },
  } = await client.git.createCommit({
    owner: process.env.GITHUB_ACTOR,
    repo: "brandbuzza",
    tree: currentTreeSHA,
    message: `Update brands.csv by Github Action`,
    parents: [commitSHA],
  });

  const refHash = hasha(new Date().toISOString(), {
    algorithm: "md5",
  }).substring(0, 10);
  const branchName = `update-brands-${refHash}`;
  const refName = `heads/${branchName}`;

  await client.git.createRef({
    owner: process.env.GITHUB_ACTOR,
    repo: "brandbuzza",
    ref: `refs/${refName}`,
    sha: newCommitSHA,
  });

  const createPrResponse = await client.rest.pulls.create({
    owner: process.env.GITHUB_ACTOR,
    repo: "brandbuzza",
    head: branchName,
    base: "main",
    title: `Update brands.csv by Github Action`,
  });

  await client.rest.pulls.merge({
    owner: process.env.GITHUB_ACTOR,
    repo: "brandbuzza",
    pull_number: createPrResponse.data.number,
  });
}

checkAndUploadImages();
