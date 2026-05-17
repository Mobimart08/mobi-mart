import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { getJwtSecret } from "../config/env.js";

export default async function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    console.log("Authorization header:", authorization);

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, getJwtSecret());
    const admin = await Admin.findById(payload.sub).select("_id username");

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.admin = admin;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
