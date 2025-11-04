import { getHonoContext } from "#/utils/get-hono-context";

export default async function handler(_request: Request) {
  let ctx = getHonoContext();

  // if ctx is null, we're in the build phase of the app
  console.log(ctx?.req.header("User-Agent"));
  return new Response("Hello, world!");
}
