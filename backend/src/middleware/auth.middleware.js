import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const ProtectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    // ! verify the token:-
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    // ! get the user from the token:-
    const user = await User.findById(decoded.userId).select("-passowrd");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // * authenticate to allow

    next();
  } catch (error) {
    console.log(`Error in protected middleware :- ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
