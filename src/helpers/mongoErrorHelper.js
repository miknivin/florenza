export function parseDuplicateKeyError(error) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const match = error.message.match(/dup key: \{([^}]+)\}/);
    if (match && match[1]) {
      const keyValuePairs = match[1].split(",").map((pair) => pair.trim());
      for (const pair of keyValuePairs) {
        const [key, value] = pair
          .split(":")
          .map((item) => item.trim().replace(/['"]/g, ""));
        if (key) {
          return `The ${key.toLowerCase()} '${value}' is already in use.`;
        }
      }
    }
    return "A duplicate key error occurred. Please try with different details.";
  }
  return null; // Return null if not a duplicate key error
}
