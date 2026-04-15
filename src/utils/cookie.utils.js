export const setAuthCookies = (res, accessToken, refreshToken) => {
  // const isProduction = process.env.NODE_ENV === "production";

  // const options = {
  //   httpOnly: true,
  //   // secure: isProduction,
  //   // secure: true,
  //   // sameSite: "strict",
  //   secure: false,        // dev ke liye false
  //   sameSite: "none",      // ya "none"
  // };

  const options = {
    httpOnly: true,
    secure: false,        //  VERY IMPORTANT
    sameSite: "lax",      //  VERY IMPORTANT
  };

  // Access Token (short life)
  res.cookie("accessToken", accessToken, {
    ...options,
    // maxAge: 15 * 60 * 1000, // 15 min
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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