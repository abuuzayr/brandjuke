import { NextApiRequest, NextApiResponse } from "next";
import duckdb from "duckdb";

const db = new duckdb.Database(":memory:");

const buildQuery = (count: number) => {
  let query = "SELECT * FROM read_csv_auto('data/brands.csv') ORDER BY RANDOM() LIMIT " + count;
  return query;
};

const getBrands = (count: number) => {
  return new Promise((resolve, reject) => {
    db.all(buildQuery(count), (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const count = parseInt(req.query?.count as string) || 5;
    const brands = await getBrands(count);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(brands);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default create;
