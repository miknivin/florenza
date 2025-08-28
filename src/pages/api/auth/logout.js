import { NextResponse } from "next/server";

export default function handler(req, res) {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
    );
    res.status(200).json({ message: "Logged Out" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
