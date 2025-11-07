// pages/api/get-key.js

export default async function handler(req, res) {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "Missing 'key' query parameter",
      });
    }

    const baseUrl = process.env.KV_REST_API_URL; // e.g. https://us1-merry-cat-32748.upstash.io
    const token = process.env.KV_REST_API_READ_ONLY_TOKEN; // your Bearer token

    // Construct final URL for GET command
    const url = `${baseUrl}/GET/${key}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      key,
      value: data.result ?? data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
