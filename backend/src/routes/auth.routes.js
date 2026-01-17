import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { isValidPassword } from "../utils/validators.js";

const router = express.Router();


router.post("/signup", async (req, res) => {
  const { name, email, address, password, role, adminKey } = req.body;

  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({ message: "Invalid name length" });
  }

  
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Weak password" });
  }

  const allowedRoles = ["USER", "OWNER", "ADMIN"];
  const selectedRole = role || "USER"; 
  if (!allowedRoles.includes(selectedRole)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  if (selectedRole === "ADMIN") {
    if (adminKey !== "ADMIN_SECRET_123") {
      return res.status(403).json({ message: "Invalid admin key" });
    }
  }


  const hash = await bcrypt.hash(password, 10);

  await db.execute(
    "INSERT INTO users (name,email,address,password_hash,role) VALUES (?,?,?,?,?)",
    [name, email, address, hash, selectedRole]
  );

  res.json({ message: `${selectedRole} registered successfully` });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await db.execute(
    "SELECT * FROM users WHERE email=?",
    [email]
  );

  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });
});

export default router;
