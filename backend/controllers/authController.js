import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { getJwtSecret } from "../config/env.js";

function createAdminToken(admin) {
  return jwt.sign(
    {
      sub: String(admin._id),
      username: admin.username,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

function serializeAdmin(admin) {
  return {
    id: admin._id,
    username: admin.username,
  };
}

export const loginAdmin = async (req, res) => {
  try {
    const username = String(req.body?.username || req.body?.adminId || "").trim();
    const password = String(req.body?.password || "");

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createAdminToken(admin);
    console.log("Admin login token:", token);

    return res.json({
      token,
      admin: serializeAdmin(admin),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminMe = async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json({
    admin: serializeAdmin(req.admin),
  });
};
