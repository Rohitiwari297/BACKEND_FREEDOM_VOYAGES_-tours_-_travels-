import User from "../../models/user.model.js";
import AsyncHandler from "../../utils/asyncHandler.js";

export const getProfile = AsyncHandler(async (req, res) => {
  // logged-in user data
  const user = await User.findById(req.user.id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", user)
  );
});

export const updateProfile = AsyncHandler(async (req, res) => {
  // update user
  const { name, email, mobile, avatar } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // update only provided fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (mobile) user.mobile = mobile;
  if (avatar) user.avatar = avatar;

  await user.save();

  const updatedUser = await User.findById(req.user.id).select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", updatedUser)
  );
});

export const getAllUsers = AsyncHandler(async (req, res) => {
  // admin only
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const users = await User.find().select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, "All users fetched successfully", users)
  );
});