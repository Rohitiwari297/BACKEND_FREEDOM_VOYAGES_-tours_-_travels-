import config from "../Config/config.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiErrorHandler.js";
import AsyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const isLoggedIn = AsyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies?.generateAccessToken) {
        token = req.cookies?.generateAccessToken
    } else if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new ApiError(401, "Not authorized, please login");
    };

    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select('-password -refreshToken')
    if (!user) {
        throw new ApiError(401, 'User not found!')
    }

    req.user = user;
    next();
})