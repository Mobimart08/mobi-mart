import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { getAdminSeedConfig } from "./env.js";

export default async function bootstrapAdmin() {
  const { username, password } = getAdminSeedConfig();
  const existingAdmin = await Admin.findOne({ username });

  if (existingAdmin) {
    console.log(`Admin "${username}" already exists. Skipping admin bootstrap.`);
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    username,
    password: hashedPassword,
  });

  console.log(`Admin "${username}" created successfully.`);
  return admin;
}
