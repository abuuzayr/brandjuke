import * as fs from "fs"
import { NextApiRequest, NextApiResponse } from "next";
import { _query } from "@/lib/db";

const buildQuery = (count: number) => {
  fs.readdir('.', (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });
  let query = "SELECT * FROM read_csv_auto('public/data/brands.csv') ORDER BY RANDOM() LIMIT " + count;
  return query;
};

const getBrands = (count: number, query: any) => {
  return new Promise((resolve, reject) => {
    query(buildQuery(count), (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const query = await _query;
    const count = parseInt(req.query?.count as string) || 5;
    await query(`SET home_directory='/tmp';`);
    const brands = await query(buildQuery(count));
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(brands);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default create;
