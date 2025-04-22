// ! packages:-
import bcrypt from "bcryptjs";

// ! models:-
import User from "../models/user.model.js";

// ! middleware:-
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const Signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // ! Hash the password:-
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ! Create a new user:-
    const newUser = new User({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res); // * generate jwt token here:-
      await newUser.save(); // * we are saving the user to the database
      return res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(`Signup error message :-${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body; //* get the user data and check for the login
  try {
    const user = await User.findOne({ email }); //* find the user
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password); // * compare the password is correct or incorrect
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res); // * send the response from cookie

    // * send the user data to the client for the log in:-
    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(`Login error message :- ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(`Logout error message ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Please provide a profile pic" });
    }

    // ! cloudinary upload:-
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    // ! update user profile pic in database:-
    const updatedUser = await User.findOneAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating profile: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const CheckAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error(
      `Error checking in checkAuth for authentication: ${error.message}`
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
