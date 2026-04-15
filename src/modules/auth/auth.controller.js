import ApiError from "../../utils/apiErrorHandler.js";
import ApiResponse from '../../utils/apiResponseHandler.js'
import AsyncHandler from "../../utils/asyncHandler.js";
import User from '../../models/user.model.js'
import bcrypt from 'bcrypt'
import { clearAuthCookies, setAuthCookies } from "../../utils/cookie.utils.js";
import { deleteFile } from "../../utils/deleteFile.js";

export const registerUser = AsyncHandler(async (req, res) => {
    // console.log('request:',req.file)
    const { email, mobile, name, role, password } = req.body;

    if (!name || !email || !mobile || !password || !role) {
        deleteFile(req.file.path)
        throw new ApiError(400, `All fields are required!`)
    };

    const user = await User.findOne({ email });
    if (user) {
        deleteFile(req.file.path)
        throw new ApiError(400, 'This user is already exists, Please login')
    }

    // const avatar = req.file ? req.file.path : null;
    const avatar = req.file.path || "";

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name: name,
        email: email,
        mobile: mobile,
        avatar: avatar,
        password: hashedPassword,
        role: role
    })

    if (!newUser) {
        deleteFile(req.body.path)
        throw new ApiError(400, 'Database error while create user')
    }

    const responseObj = {
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        avatar: newUser.avatar,
        role: newUser.role
    }

    res.status(201).json(
        new ApiResponse(201, 'User registration completed successfully', responseObj)
    )


})

export const loginUser = AsyncHandler(async (req, res) => {
    // check email & password
    const { email, password } = req.body;
    console.log('req.body:', email, password)
    if (!email || !password) {
        throw new ApiError(401, 'All fields are required!')
    };

    const user = await User.findOne({ email }).select('+password');
    console.log('user', user)
    // console.log("Constructor:", user.constructor.name);
    // console.log("Has method:", typeof user.generateAccessToken);
    if (!user) {
        throw new ApiError(400, 'This email is not register')
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    // generate JWT
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // DB me refresh token save
    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    const safeUser = {
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        mobile: user.mobile
    };


    res.status(200).json(
        new ApiResponse(200, "User login successful", { safeUser })
    );
});

export const logoutUser = AsyncHandler(async (req, res) => {
    // clear token
    clearAuthCookies(res);

    res.json({
        success: true,
        message: "Logged out successfully",
    });
});