import { NextApiRequest, NextApiResponse } from "next";
import { parse, unparse } from "papaparse";
import * as fs from "fs";

type BrandQuery = {
    name?: string;
}

type Brand = {
  name: string;
  image: string;
  color: string;
  industry: number;
}

const getBrands = (filter: BrandQuery) => {
  const { name } = filter;
  let brands: Brand[] = parse(fs.readFileSync("data/brands.csv").toString(), {
    header: true,
    skipEmptyLines: true,
  }).data as Brand[];
  if (name) {
    brands = brands.filter((brand: Brand) => brand.name.toLowerCase().includes(name.toLowerCase()));
  }

  return brands
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const brands = getBrands({ name: req.query?.search as string });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(brands);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default create;
