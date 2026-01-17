console.log("Owner routes loaded");

import express from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();


router.put(
  "/update-password",
  authenticate,
  authorizeRoles("OWNER"),
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const [[user]] = await db.execute(
      "SELECT password_hash FROM users WHERE id=?",
      [req.user.id]
    );

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password_hash=? WHERE id=?",
      [newHash, req.user.id]
    );

    res.json({ message: "Password updated successfully" });
  }
);


router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("OWNER"),
  async (req, res) => {

    const [[store]] = await db.execute(
      "SELECT id,name FROM stores WHERE owner_id=?",
      [req.user.id]
    );

    if (!store) {
      return res.status(404).json({ message: "No store assigned" });
    }
   
    const [[avg]] = await db.execute(
      "SELECT IFNULL(AVG(rating),0) avgRating FROM ratings WHERE store_id=?",
      [store.id]
    );

    const [users] = await db.execute(`
      SELECT u.name, u.email, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id=?
    `, [store.id]);

    res.json({
      storeName: store.name,
      averageRating: avg.avgRating,
      ratedByUsers: users
    });
  }
);

export default router;
