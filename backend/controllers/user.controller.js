import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import "dotenv/config";
import redisClient from "../utils/redis.js";

export const registerUser = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? `Email: ${email} already exists`
            : `Contact Number: ${phoneNumber} already exists`,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    
    res.status(200).json({
      message: "User Registered Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password, deviceId, deviceInfo } = req.body; // ✅ include device info from frontend

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const isPasswordVerified = await bcrypt.compare(password, user.password);

    if (!isPasswordVerified) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    // ✅ Save last login
    const updateLogin = await userModel.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    if (!updateLogin) {
      return res.status(400).json({
        message: "Something went wrong",
        success: false,
      });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { userId: user._id, deviceId: deviceId }, // Payload (first argument)
      process.env.SECRET_KEY,                  // Secret key (second argument)
      { expiresIn: '1d' }                      // Optional: token expiration
    );

    // ✅ Save session token in Redis
    const redisKey = `session:${user._id}:${deviceId}`;
    await redisClient.set(redisKey, token, 'EX', 86400); // 1 day expiration

    // ✅ Save device info in Redis
    const deviceInfoKey = `device-info:${user._id}:${deviceId}`;
    await redisClient.set(deviceInfoKey, JSON.stringify(deviceInfo), 'EX', 86400);

    const { password: _, ...userWithoutPassword } = user._doc;

    userWithoutPassword.token = token;

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.name}`,
        user: userWithoutPassword,
        token,
        success: true,
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};


// logout

export const logout = async (req, res) => {
  const userId = req.id; 
  const deviceId = req.deviceId; // Extract deviceId from the request

  console.log(userId, deviceId);

  if (!userId || !deviceId) {
    return res.status(400).json({
      message: "Missing userId or deviceId",
      success: false,
    });
  }

  try {
    const redisKey = `session:${userId}:${deviceId}`;
    const deviceInfoKey = `device-info:${userId}:${deviceId}`;

    // Delete session token and device info from Redis
    await redisClient.del(redisKey);
    await redisClient.del(deviceInfoKey);

    return res.status(200).json({
      message: "Successfully logged out",
      success: true,
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "Logout failed",
      success: false,
    });
  }
};
