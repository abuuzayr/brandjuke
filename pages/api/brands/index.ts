import { NextApiRequest, NextApiResponse } from "next";
import duckdb from "duckdb";

const db = new duckdb.Database(":memory:");

type BrandQuery = {
    name?: string;
}

const buildQuery = (filter: BrandQuery) => {
  const { name } = filter;
  let query = "SELECT * FROM read_csv_auto('data/brands.csv')";
  if (name) {
    query += ` WHERE name ILIKE '%${name}%'`;
  }
  
  return query;
};

const getBrands = (filter: BrandQuery) => {
  return new Promise((resolve, reject) => {
    db.all(buildQuery(filter), (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const brands = await getBrands({ name: req.query?.search as string });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(brands);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default create;
