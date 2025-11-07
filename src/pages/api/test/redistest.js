// pages/api/test.js

export default async function handler(req, res) {
  try {
    const url = process.env.KV_REST_API_URL; // e.g. https://us1-merry-cat-32748.upstash.io
    const token = process.env.KV_REST_API_TOKEN; // your Upstash REST token

    // The same payload as in your curl command
    const payload = ["SET", "foo", "bar", "EX", 100];

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);

    return res.status(200).json({
      success: true,
      response: data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
