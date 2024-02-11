import { up } from "@auth/d1-adapter";

let migrated = false;
async function migrationHandler({
  event,
  resolve,
}: {
  event: any;
  resolve: any;
}) {
  if (!migrated) {
    try {
      await up(event.platform.env.db);
      migrated = true;
    } catch (e) {
      console.log(e);
    }
  }
  return resolve(event);
}
