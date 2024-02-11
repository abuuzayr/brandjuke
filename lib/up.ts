import { up } from "@auth/d1-adapter";

let migrated = false;
async function migrationHandler({ event, resolve }) {
  if (!migrated) {
    try {
      await up(event.platform.env.db);
      migrated = true;
    } catch (e) {
      console.log(e.cause.message, e.message);
    }
  }
  return resolve(event);
}
