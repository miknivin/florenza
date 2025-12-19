// utils/cancelDelhiveryShipment.js

import axios from "axios";
import qs from "qs";

async function cancelDelhiveryShipment(token, waybill) {
  if (!token || !waybill) {
    throw new Error("Token and waybill are required");
  }

  const options = {
    method: "POST",
    url: "https://track.delhivery.com/api/p/edit",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({
      waybill,
      cancellation: "true",
    }),
    timeout: 15000,
    // Important: Tell axios to return raw response as text if needed
    responseType: "text", // This prevents auto-parsing issues
  };

  console.log(`Attempting to cancel Delhivery waybill: ${waybill}`);

  try {
    const response = await axios(options);

    // Delhivery usually returns plain text success message like "success" or JSON
    const data =
      typeof response.data === "string"
        ? response.data.trim().toLowerCase()
        : "";

    // Check for success indicators
    if (
      data.includes("success") ||
      data.includes("cancelled") ||
      response.status === 200
    ) {
      console.log(`Delhivery waybill ${waybill} cancelled successfully`);
      return { success: true, rawResponse: response.data };
    } else {
      throw new Error(`Unexpected response: ${response.data}`);
    }
  } catch (error) {
    console.error(
      `Delhivery cancellation failed for ${waybill}:`,
      error.message
    );

    let errorMessage = "Unknown error";

    if (error.response) {
      // Server responded with error status
      const respData = error.response.data;
      errorMessage =
        typeof respData === "string"
          ? respData.trim()
          : JSON.stringify(respData) || `HTTP ${error.response.status}`;
    } else if (error.request) {
      errorMessage =
        "No response from Delhivery API (timeout or network issue)";
    } else {
      errorMessage = error.message;
    }

    throw new Error(`Delhivery cancellation failed: ${errorMessage}`);
  }
}

export { cancelDelhiveryShipment };
