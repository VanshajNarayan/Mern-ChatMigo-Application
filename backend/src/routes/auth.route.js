// ! packages:-
import express from "express";

// ! controllers:-
import {
  CheckAuth,
  Login,
  Logout,
  Signup,
  UpdateProfile,
} from "../controllers/auth.controller.js";

// ! middleware:-
import { ProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/signup").post(Signup);

router.route("/login").post(Login);

router.route("/logout").post(Logout);

router.route("/update-profile").put(ProtectRoute, UpdateProfile);

router.route("/check").get(ProtectRoute, CheckAuth);

export default router;
