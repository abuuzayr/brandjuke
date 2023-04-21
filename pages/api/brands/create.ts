import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "@/lib/prisma";
import axios from "axios";
import hasha from "hasha";
import { getColor } from "colorthief";
import ntc from "@/lib/ntc";
import sharp from "sharp"
import path from "path"
import * as fs from 'fs';
import { Octokit } from "@octokit/rest";

const UPLOAD_LIMIT = 2 * 1024 * 1024; // 2MB

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { name, image, industry } = req.body;
    // Upload to b2
    const { data: fileBuffer } = await axios.get(image, {
      decompress: false,
      // Ref: https://stackoverflow.com/a/61621094/4050261
      responseType: "arraybuffer",
    });
    if (Buffer.byteLength(fileBuffer) > UPLOAD_LIMIT) {
      res.statusCode = 413;
      res.setHeader("Content-Type", "application/json");
      return res.status(413).json({ error: "File too large" });
    }
    const authObj = await axios.get(
      `https://api.backblazeb2.com/b2api/v2/b2_authorize_account`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.B2_APP_ID}:${process.env.B2_APP_KEY}`,
          ).toString("base64")}`,
        },
      },
    );
    const uploadUrlObj = await axios.post(
      `${authObj["data"]["apiUrl"]}/b2api/v2/b2_get_upload_url`,
      { bucketId: process.env.B2_BUCKET_ID },
      {
        headers: {
          Authorization: authObj["data"]["authorizationToken"],
        },
      },
    );
    await sharp(fileBuffer).toFile(path.join(__dirname, "/tmp.webp"));
    const fileHash = await hasha.fromFile(path.join(__dirname, "/tmp.webp"), {
      algorithm: "sha1",
    });
    const b64EncodedFileName =
      encodeURI(Buffer.from(image.split("/").slice(-1)[0]).toString("base64")) +
      ".webp";
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

    // Get dominant color
    await sharp(fileBuffer).toFile(path.join(__dirname, "/tmp.png"));
    const color = await getColor(path.join(__dirname, "/tmp.png"));
    const rgb = `#${color[0].toString(16).padStart(2, "0")}${color[1]
      .toString(16)
      .padStart(2, "0")}${color[2].toString(16).padStart(2, "0")}`;
    const baseColorName = `${ntc.name(rgb)[3]}`.toLowerCase();

    const newBrand = {
      name,
      image: `${authObj["data"]["downloadUrl"]}/file/brandbuzza/${b64EncodedFileName}`,
      industry,
      color: baseColorName,
    };

    const client = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    const commits = await client.repos.listCommits({
      // TODO: Change to brandbuzza-bot or something
      owner: "abuuzayr",
      repo: "brandbuzza",
    });
    const commitSHA = commits.data[0].sha;

    const {
      data: { sha: currentTreeSHA },
    } = await client.git.createTree({
      owner: "abuuzayr",
      repo: "brandbuzza",
      tree: [
        {
          path: "data/brands.csv",
          mode: "100644",
          type: "commit",
          content:
            fs.readFileSync("data/brands.csv").toString() +
            `${name},${newBrand["image"]},${baseColorName},${industry}\r\n`,
        },
      ],
      base_tree: commitSHA,
      message: `Add ${name} data by user`,
      parents: [commitSHA],
    });

    const {
      data: { sha: newCommitSHA },
    } = await client.git.createCommit({
      owner: "abuuzayr",
      repo: "brandbuzza",
      tree: currentTreeSHA,
      message: `Add ${name} data by user`,
      parents: [commitSHA],
    });

    const refHash = hasha(new Date().toISOString(), {
      algorithm: "md5",
    }).substring(0, 10);
    const branchName = `add-${name.toLowerCase()}-${refHash}`;
    const refName = `heads/${branchName}`;

    await client.git.createRef({
      owner: "abuuzayr",
      repo: "brandbuzza",
      ref: `refs/${refName}`,
      sha: newCommitSHA,
    });

    const createPrResponse = await client.rest.pulls.create({
      owner: "abuuzayr",
      repo: "brandbuzza",
      head: branchName,
      base: "main",
      title: `Add ${name} data by user`,
    });

    await client.rest.pulls.merge({
      owner: "abuuzayr",
      repo: "brandbuzza",
      pull_number: createPrResponse.data.number,
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(newBrand);
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default create;
