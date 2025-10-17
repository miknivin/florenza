const sendToken = (user, statusCode, res) => {
  const token = user?.getJwtToken();

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax", // Fixed to valid sameSite value
    maxAge: (process.env.COOKIE_EXPIRES_TIME || 7) * 24 * 60 * 60,
    path: "/",
  };

  // Set the cookie in the response headers
  res.setHeader(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=${
      cookieOptions.maxAge
    }; SameSite=${cookieOptions.sameSite}${
      cookieOptions.secure ? "; Secure" : ""
    }`
  );

  // Send the JSON response
  return res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user?.phone || "",
    },
  });
};

export default sendToken;
