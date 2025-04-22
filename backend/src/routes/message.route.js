// ! packages:-
import express from "express";

// ! middleware:-
import { ProtectRoute } from "../middleware/auth.middleware.js";

// ! controllers:-
import {
  GetMessages,
  GetUserForSidebar,
  SendMessage,
} from "../controllers/message.controller.js";

// ! router:-
const router = express.Router();

// ! endpoint:-
router.route("/user").get(ProtectRoute, GetUserForSidebar);
router.route("/:id").get(ProtectRoute, GetMessages);
router.route("/send/:id").post(ProtectRoute, SendMessage);

// ! export the router:
export default router;
