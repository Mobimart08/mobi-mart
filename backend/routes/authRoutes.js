import express from "express";
import {
  getAdminMe,
  loginAdmin,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", authMiddleware, getAdminMe);

export default router;
