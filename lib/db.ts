// lib/duckdb.ts
let _query: Promise<(query: string) => any>;

_query = import("duckdb-async")
  .then((duckdb) => duckdb.Database)
  .then((Database) => Database.create(":memory:"))
  .then((db: any) => (query: string) => db.all(query))
  .catch(async (error) => {
    console.log("duckdb init error:", error);
    // @ts-ignore
    let duckdb = await import("duckdb-lambda-x86");
    let Database: any = await duckdb.Database;
    const db = new Database(":memory:");
    const connection = db.connect();
    return (query: string) => {
      return new Promise((resolve, reject) => {
        connection.all(query, (err: any, res: any) => {
          if (err) reject(err);
          resolve(res);
        });
      });
    };
  });

export { _query };
