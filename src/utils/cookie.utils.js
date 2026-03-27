export const setAuthCookies = (res, accessToken, refreshToken) => {
  // const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    // secure: isProduction,
    secure: true,
    sameSite: "strict",
  };

  // Access Token (short life)
  res.cookie("accessToken", accessToken, {
    ...options,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  // Refresh Token (long life)
  res.cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
};