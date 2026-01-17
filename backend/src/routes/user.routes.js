import express from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.put("/update-password", authenticate, async (req, res) => {
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
});

router.get("/stores", authenticate, async (req, res) => {
  const { name, address } = req.query;

  let query = `
    SELECT 
      s.id,
      s.name,
      s.email,
      s.address,
      IFNULL(AVG(r.rating),0) AS rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;

  let params = [];

  if (name) {
    query += " AND s.name LIKE ?";
    params.push(`%${name}%`);
  }

  if (address) {
    query += " AND s.address LIKE ?";
    params.push(`%${address}%`);
  }

  query += " GROUP BY s.id";

  const [stores] = await db.execute(query, params);
  res.json(stores);
});

export default router;
