// lib/duckdb.ts
let duckdb: any;

try {
  // @ts-ignore
  duckdb = await import("duckdb-lambda-x86");
} catch (error) {
  console.log("duckdb init error:", error);
  duckdb = await import("duckdb-async");
}

const db = await duckdb.Database.create(":memory:");
export const _query = (query: string) => db.all(query)
