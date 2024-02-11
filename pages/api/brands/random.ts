import * as fs from "fs"
import * as path from "path"
import { NextApiRequest, NextApiResponse } from "next";
import { _query } from "@/lib/db";

path.join(process.cwd(), "public/data/brands.csv");
// @ts-ignore
BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

const buildQuery = (count: number) => {
  let query = "SELECT * FROM read_csv_auto('public/data/brands.csv') ORDER BY RANDOM() LIMIT " + count;
  return query;
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
