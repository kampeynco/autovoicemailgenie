
// Parse request body
export async function parseRequestBody(req: Request) {
  let body = {};
  try {
    if (req.body) {
      const bodyText = await req.text();
      if (bodyText) {
        body = JSON.parse(bodyText);
      }
    }
  } catch (e) {
    console.error('Failed to parse request body:', e);
  }
  return body;
}
