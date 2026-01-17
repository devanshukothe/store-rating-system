import express from "express";
import { db } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const [stores] = await db.execute(`
    SELECT s.id, s.name, s.address,
    IFNULL(AVG(r.rating),0) AS avgRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
  `);

  res.json(stores);
});

export default router;
