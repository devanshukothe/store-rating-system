import express from "express";
import { db } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();


router.post("/:storeId", authenticate, async (req, res) => {
  const { rating } = req.body;
  const storeId = req.params.storeId;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  await db.execute(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE rating=?`,
    [req.user.id, storeId, rating, rating]
  );

  res.json({ message: "Rating submitted successfully" });
});

export default router;
