import { NextApiRequest, NextApiResponse } from "next";
import { INDUSTRIES } from "@/lib/constants";
import { _query } from "@/lib/db";

type BrandQuery = {
  name?: string;
  colors?: string;
  industries?: string;
};

const buildQuery = (filter: BrandQuery) => {
  const { name, colors, industries } = filter;
  let query = "SELECT * FROM read_csv_auto('public/data/brands.csv')";
  if (name) {
    query += ` WHERE name ILIKE '%${name}%'`;
  }
  if (colors) {
    query += ` ${name ? "AND" : "WHERE"} color IN (${colors
      .split(",")
      .map((color) => `'${color}'`)
      .join(",")})`;
  }
  if (industries) {
    const industriesArr = industries
      .split(",")
      .map((i) => decodeURIComponent(i));
    const industryKeys = industriesArr.map((i) =>
      Object.values(INDUSTRIES).findIndex(
        (e) => (e as string).toLowerCase() === i,
      ),
    );
    query += ` ${
      name || colors ? "AND" : "WHERE"
    } industry IN (${industryKeys.join(",")})`;
  }

  return query;
};

const getBrands = (filter: BrandQuery, query: any) => {
  return new Promise((resolve, reject) => {
    query(buildQuery(filter), (err: any, res: any) => {
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
    await query(`SET home_directory='/tmp';`);
    const brands = await query(
      buildQuery({
        name: req.query?.search as string,
        colors: req.query?.colors as string,
        industries: req.query?.industries as string,
      }),
    );
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(brands);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default create;
