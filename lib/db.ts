// lib/duckdb.ts
let duckdb: any;
let db: any

try {
  // @ts-ignore
  duckdb = await import("duckdb-lambda-x86");
  db = new duckdb.Database(":memory:")
} catch (error) {
  console.log("duckdb init error:", error);
  duckdb = await import("duckdb-async");
  db = await duckdb.Database.create(":memory:");
}

export const _query = (query: string) => db.all(query)
