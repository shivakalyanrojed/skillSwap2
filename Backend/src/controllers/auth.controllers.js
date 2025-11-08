import { generateJWTToken_email, generateJWTToken_username } from "../utils/generateJWTToken.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

dotenv.config();

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("❌ Missing Google OAuth credentials");
}

const callbackURL = process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback";
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

export const googleAuthHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: `${frontendURL}/login`,
  session: false,
});

export const handleGoogleLoginCallback = asyncHandler(async (req, res) => {
  console.log("\n******** Inside handleGoogleLoginCallback function ********");

  if (!req.user || !req.user._json) {
    throw new ApiError(401, "Authentication failed");
  }

  const { email, name, picture } = req.user._json;

  if (!email) {
    throw new ApiError(400, "Email not provided by Google");
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    const jwtToken = generateJWTToken_username(existingUser);
    const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
    
    res.cookie("accessToken", jwtToken, {
      httpOnly: true,
      expires: expiryDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    
    return res.redirect(`${frontendURL}/discover`);
  }

  let unregisteredUser = await UnRegisteredUser.findOne({ email: email });
  
  if (!unregisteredUser) {
    console.log("Creating new Unregistered User");
    unregisteredUser = await UnRegisteredUser.create({
      name: name,
      email: email,
      picture: picture,
    });
  }

  const jwtToken = generateJWTToken_email(unregisteredUser);
  const expiryDate = new Date(Date.now() + 0.5 * 60 * 60 * 1000);
  
  res.cookie("accessTokenRegistration", jwtToken, {
    httpOnly: true,
    expires: expiryDate,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  
  return res.redirect(`${frontendURL}/register`);
});

export const handleLogout = asyncHandler(async (req, res) => {
  console.log("\n******** Inside handleLogout function ********");
  
  res.clearCookie("accessToken");
  res.clearCookie("accessTokenRegistration");
  
  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});