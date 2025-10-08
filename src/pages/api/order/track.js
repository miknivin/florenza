import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { searchParams } = new URL(req.url || "", `http://${req.headers.host}`);
  const waybill = searchParams.get("waybill");
  const refIds = searchParams.get("ref_ids") || "ORD1243244";
  const token = process.env.DELHIVERY_API_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "Delhivery API token not set" });
  }

  try {
    const response = await axios.get(
      "https://track.delhivery.com/api/v1/packages/json/",
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          waybill,
          ref_ids: refIds,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);
    return res.status(500).json({ error: errorMessage });
  }
}
